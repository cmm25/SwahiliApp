import { NextRequest, NextResponse } from "next/server";
import { logTrace } from "@/lib/opik";
import { getUserFromRequest } from "@/lib/auth-supabase";

const FIRECRAWL_API_URL = "https://api.firecrawl.dev/v1/search";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const TOPICS = [
  "Swahili language history East Africa",
  "Kiswahili grammar basics tutorial",
  "Swahili proverbs methali meaning",
  "East African culture traditions Swahili",
  "Swahili literature poetry shairi",
  "Tanzania Kenya Swahili language",
  "Swahili vocabulary common words beginners",
  "Swahili music culture taarab",
  "Zanzibar Swahili heritage history",
  "Swahili language learning tips",
];

interface Article {
  url: string;
  title: string;
  description: string;
  source: string;
  imageUrl?: string;
  readingTime?: string;
}

interface CacheEntry {
  data: Article;
  timestamp: number;
  topic: string;
  dayOfYear: number;
}

let dailyCache: CacheEntry | null = null;

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "Unknown";
  }
}

function estimateReadingTime(text: string): string {
  const words = text?.split(/\s+/).length || 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

function isCacheValid(entry: CacheEntry | null, currentDay: number): boolean {
  if (!entry) return false;
  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  const isDifferentDay = entry.dayOfYear !== currentDay;
  return !isExpired && !isDifferentDay;
}

async function searchArticles(query: string, apiKey: string): Promise<Article[]> {
  console.log(`[article-agent] Searching Firecrawl: "${query}"`);

  const response = await fetch(FIRECRAWL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      limit: 5,
      scrapeOptions: {
        formats: ["markdown"],
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[article-agent] Firecrawl error: ${response.status}`, errorText);
    throw new Error(`Firecrawl API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`[article-agent] Firecrawl returned ${data.data?.length || 0} results`);

  if (!data.data || data.data.length === 0) {
    return [];
  }

  return data.data.map((item: Record<string, unknown>) => ({
    url: item.url,
    title:
      (item.title as string | undefined) ||
      (item.metadata as { title?: string } | undefined)?.title ||
      "Swahili Article",
    description:
      (item.description as string | undefined) ||
      (item.metadata as { description?: string } | undefined)?.description ||
      (((item.markdown as string | undefined) ?? "").slice(0, 200) + "...") ||
      "",
    source: extractDomain(item.url as string),
    imageUrl:
      (item.metadata as { ogImage?: string; image?: string } | undefined)?.ogImage ||
      (item.metadata as { ogImage?: string; image?: string } | undefined)?.image ||
      undefined,
    readingTime: item.markdown ? estimateReadingTime(item.markdown as string) : "3 min",
  }));
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let traceInput = "action: unknown";
  let traceTopic = "";
  let userId: string | undefined;
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = user.id;

    const body = await request.json();
    const { action } = body;
    traceInput = `action: ${action || "unknown"}`;

    if (action !== "curate" && action !== "search") {
      return NextResponse.json(
        { error: "Invalid action. Use: curate or search", success: false },
        { status: 400 }
      );
    }

    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    if (!firecrawlApiKey) {
      console.error("[article-agent] FIRECRAWL_API_KEY not configured");
      return NextResponse.json(
        { error: "Firecrawl API key not configured", success: false },
        { status: 500 }
      );
    }

    if (action === "curate") {
      const dayOfYear = getDayOfYear();
      const todaysTopic = TOPICS[dayOfYear % TOPICS.length];
      traceTopic = todaysTopic;

      if (isCacheValid(dailyCache, dayOfYear)) {
        console.log("[article-agent] Cache hit for daily article");
        void logTrace({
          agentName: "article-agent",
          userId,
          input: `action: curate | topic: ${todaysTopic}`,
          output: dailyCache!.data.title,
          metadata: {
            action: "curate",
            topic: todaysTopic,
            cached: true,
            dayOfYear,
          },
          latencyMs: Date.now() - startTime,
          tags: ["article-agent", "curate", "cache"],
        }).catch((error) => {
          console.warn("[article-agent] Trace logging failed:", error);
        });
        return NextResponse.json({
          article: dailyCache!.data,
          topic: dailyCache!.topic,
          dayOfYear,
          cached: true,
          success: true,
        });
      }

      console.log(`[article-agent] Curating for topic: "${todaysTopic}"`);

      const articles = await searchArticles(todaysTopic, firecrawlApiKey);

      if (articles.length === 0) {
        void logTrace({
          agentName: "article-agent",
          userId,
          input: `action: curate | topic: ${todaysTopic}`,
          output: "No daily article found",
          metadata: {
            action: "curate",
            topic: todaysTopic,
            cached: false,
            dayOfYear,
            success: false,
          },
          latencyMs: Date.now() - startTime,
          tags: ["article-agent", "curate", "empty"],
        }).catch((error) => {
          console.warn("[article-agent] Trace logging failed:", error);
        });
        return NextResponse.json({
          article: null,
          message: "No daily article found",
          topic: todaysTopic,
          success: true,
        });
      }

      const article = articles[0];

      dailyCache = {
        data: article,
        timestamp: Date.now(),
        topic: todaysTopic,
        dayOfYear,
      };

      void logTrace({
        agentName: "article-agent",
        userId,
        input: `action: curate | topic: ${todaysTopic}`,
        output: article.title,
        metadata: {
          action: "curate",
          topic: todaysTopic,
          cached: false,
          dayOfYear,
          source: article.source,
          url: article.url,
        },
        latencyMs: Date.now() - startTime,
        tags: ["article-agent", "curate"],
      }).catch((error) => {
        console.warn("[article-agent] Trace logging failed:", error);
      });

      return NextResponse.json({
        article,
        topic: todaysTopic,
        dayOfYear,
        cached: false,
        success: true,
      });
    }

    if (action === "search") {
      const { query } = body;
      if (!query) {
        return NextResponse.json(
          { error: "Query is required for search action", success: false },
          { status: 400 }
        );
      }

      traceInput = `action: search | query: ${query}`;
      const articles = await searchArticles(query, firecrawlApiKey);
      void logTrace({
        agentName: "article-agent",
        userId,
        input: `action: search | query: ${query}`,
        output: `results: ${articles.length}`,
        metadata: {
          action: "search",
          query,
          resultCount: articles.length,
        },
        latencyMs: Date.now() - startTime,
        tags: ["article-agent", "search"],
      }).catch((error) => {
        console.warn("[article-agent] Trace logging failed:", error);
      });
      return NextResponse.json({
        articles,
        query,
        success: true,
      });
    }

    return NextResponse.json({ error: "Unknown action", success: false }, { status: 400 });
  } catch (error) {
    console.error("[article-agent] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    void logTrace({
      agentName: "article-agent",
      userId,
      input: traceInput + (traceTopic ? ` | topic: ${traceTopic}` : ""),
      output: `error: ${message}`,
      metadata: {
        error: message,
      },
      latencyMs: Date.now() - startTime,
      tags: ["article-agent", "error"],
    }).catch((traceError) => {
      console.warn("[article-agent] Trace logging failed:", traceError);
    });
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
