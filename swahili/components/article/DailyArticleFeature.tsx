 "use client";

import { useState, useEffect } from "react";
import { BookOpen, Sparkles, RefreshCw, Bot, ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { HandDrawnBorder, DoodleStarburst, CornerSquiggle } from "@/components/shared/Doodle";
import { supabase } from "@/integrations/supabase/client";

interface CuratedArticle {
  url: string;
  title: string;
  description: string;
  source: string;
  imageUrl?: string;
  readingTime?: string;
}

interface DailyArticleFeatureProps {
  className?: string;
}

// Fallback article if agent fails
const FALLBACK_ARTICLE: CuratedArticle = {
  url: "https://en.wikipedia.org/wiki/Swahili_language",
  title: "Swahili Language - History & Culture",
  description: "Swahili, also known as Kiswahili, is a Bantu language spoken by various ethnic groups in East Africa. It is the national language of Tanzania, Kenya, and the Democratic Republic of the Congo.",
  source: "wikipedia.org",
  readingTime: "5 min",
};

export function DailyArticleFeature({ className }: DailyArticleFeatureProps) {
  const [showReadMessage, setShowReadMessage] = useState(false);
  const [dailyArticle, setDailyArticle] = useState<CuratedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [topic, setTopic] = useState<string>("");

  // Fetch AI-curated daily article from agent
  useEffect(() => {
    async function fetchDailyArticle() {
      setIsLoading(true);

      try {
        // console.log("[DailyArticleFeature] Calling article-agent curate...");

        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        if (!accessToken) {
          // console.warn("[DailyArticleFeature] No session found, using fallback article");
          setDailyArticle(FALLBACK_ARTICLE);
          setTopic("");
          setIsLoading(false);
          return;
        }
        
        const response = await fetch("/api/article-agent-proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ action: "curate" }),
          cache: "no-store",
        });

        const rawText = await response.text();
        let data: any = null;
        try {
          data = rawText ? JSON.parse(rawText) : null;
        } catch {
          data = { raw: rawText };
        }
        // console.log("[DailyArticleFeature] Agent response:", data);

        if (!response.ok) {
          const errorDetail = data?.error || data?.message || rawText || "Failed to fetch daily article";
          console.error("[DailyArticleFeature] API Error:", errorDetail);
          // Don't throw, just use fallback to prevent UI crash
          setDailyArticle(FALLBACK_ARTICLE);
          return; 
        }

        if (data?.article) {
          const article: CuratedArticle = {
            url: data.article.url,
            title: data.article.title,
            description: data.article.description,
            source: data.article.source,
            imageUrl: data.article.imageUrl,
            readingTime: data.article.readingTime,
          };
          setDailyArticle(article);
          setTopic(data.topic || "");
        } else {
          // console.log("[DailyArticleFeature] No article in response, using fallback");
          setDailyArticle(FALLBACK_ARTICLE);
        }
      } catch (err) {
        console.error("[DailyArticleFeature] Agent error:", err);
        setDailyArticle(FALLBACK_ARTICLE);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDailyArticle();
  }, []);

  const handleReadArticle = () => {
    if (dailyArticle) {
      window.open(dailyArticle.url, "_blank", "noopener,noreferrer");
      setShowReadMessage(true);

      // Hide message after 5 seconds
      setTimeout(() => {
        setShowReadMessage(false);
      }, 5000);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("relative", className)}>
        <div className="relative overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-lg">
          <HandDrawnBorder variant="accent" strokeWidth={2} />
          <div className="p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
            <div className="relative">
              <Bot size={40} className="text-accent animate-pulse" />
              <RefreshCw size={16} className="absolute -bottom-1 -right-1 text-muted-foreground animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-hand text-lg text-foreground">Wakala anatafuta...</p>
              <p className="font-hand-secondary text-sm text-muted-foreground">
                AI agent is finding today's article
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dailyArticle) return null;

  return (
    <>
      {/* Daily Article Card */}
      <div className={cn("relative", className)}>
        <div
          onClick={handleReadArticle}
          className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <HandDrawnBorder variant="accent" strokeWidth={2} />
          <CornerSquiggle position="top-left" className="text-warning/40 top-2 left-2" />
          <CornerSquiggle position="bottom-right" className="text-accent/40 bottom-2 right-2" />

          {/* Article Image (if available) */}
          {dailyArticle.imageUrl && (
            <div className="relative h-32 overflow-hidden">
              <img
                src={dailyArticle.imageUrl}
                alt={dailyArticle.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 p-5">
            {/* AI-curated badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/90 border-2 border-foreground">
                <BookOpen size={14} className="text-warning-foreground" />
                <span className="font-hand text-sm text-warning-foreground">Makala ya Leo</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/30">
                <Sparkles size={12} className="text-accent" />
                <span className="font-hand-secondary text-xs text-foreground/80">AI Curated</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-hand text-xl text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {dailyArticle.title}
            </h3>

            {/* Description */}
            <p className="font-hand-secondary text-sm text-muted-foreground mb-3 line-clamp-3">
              {dailyArticle.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-hand-secondary text-xs text-muted-foreground/70">
                  {dailyArticle.source}
                </span>
                {dailyArticle.readingTime && (
                  <span className="flex items-center gap-1 font-hand-secondary text-xs text-muted-foreground/70">
                    <Clock size={10} />
                    {dailyArticle.readingTime}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-accent group-hover:translate-x-1 transition-transform">
                <span className="font-hand-secondary text-xs">Soma</span>
                <ExternalLink size={12} />
              </div>
            </div>

            {/* Topic hint */}
            {topic && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <span className="text-xs font-hand-secondary text-accent/70 italic">
                  Mada: {topic.slice(0, 35)}...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Read Message */}
      {showReadMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="relative px-6 py-4 rounded-2xl bg-card/95 backdrop-blur-md border-2 border-foreground shadow-2xl">
            <HandDrawnBorder variant="success" strokeWidth={2} />
            <div className="flex items-center gap-3">
              <DoodleStarburst size={24} className="text-warning" />
              <div>
                <p className="font-hand text-lg text-foreground">Umefanya vizuri! 🎉</p>
                <p className="font-hand-secondary text-sm text-muted-foreground">
                  Wakala atachagua makala mpya kesho
                </p>
                <p className="font-hand-secondary text-xs text-muted-foreground/70">
                  Agent will curate a new article tomorrow
                </p>
              </div>
              <Bot size={20} className="text-accent" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
