import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-server';
import { Opik } from 'opik';

// Debug environment variables
console.log('🔍 Environment check:', {
    hasApiKey: !!process.env.OPIK_API_KEY,
    apiKeyLength: process.env.OPIK_API_KEY?.length,
    workspace: process.env.OPIK_WORKSPACE_NAME ?? process.env.OPIK_WORKSPACE,
    project: process.env.OPIK_PROJECT_NAME,
    url: process.env.OPIK_URL_OVERRIDE,
});

const concatenatedEnvWarnings = [
    {
        key: 'NEXT_PUBLIC_SUPABASE_URL',
        marker: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=',
    },
    { key: 'OPIK_API_KEY', marker: 'OPIK_WORKSPACE_NAME=' },
    { key: 'OPIK_API_KEY', marker: 'OPIK_WORKSPACE=' },
];

for (const warning of concatenatedEnvWarnings) {
    const value = process.env[warning.key];
    if (value && value.includes(warning.marker)) {
        console.warn(
            `⚠️ ${warning.key} appears concatenated. Check that each .env.local entry is on its own line.`
        );
        break;
    }
}

// Validate required environment variables
const workspaceName = process.env.OPIK_WORKSPACE_NAME ?? process.env.OPIK_WORKSPACE;
const requiredEnvVars = {
    OPIK_API_KEY: process.env.OPIK_API_KEY,
    OPIK_WORKSPACE_NAME: workspaceName,
    OPIK_PROJECT_NAME: process.env.OPIK_PROJECT_NAME,
    OPIK_URL_OVERRIDE: process.env.OPIK_URL_OVERRIDE,
};

const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Create Opik configuration
const OPIK_CONFIG = {
    apiKey: process.env.OPIK_API_KEY!,
    workspaceName: workspaceName!,
    projectName: process.env.OPIK_PROJECT_NAME!,
    apiUrl: process.env.OPIK_URL_OVERRIDE!,
};

const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_ROLE ??
    process.env.SUPABASE_SERVICE_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;

const supabaseService = supabaseServiceRoleKey && supabaseUrl
    ? createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
    : supabaseAdmin;

if (!supabaseServiceRoleKey || !supabaseUrl) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL missing; using fallback client');
}

// Function to create a fresh Opik client
function createOpikClient() {
    const config = {
        apiKey: process.env.OPIK_API_KEY!,
        workspaceName: workspaceName!,
        projectName: process.env.OPIK_PROJECT_NAME!,
        apiUrl: process.env.OPIK_URL_OVERRIDE!,
        headers: {
            Authorization: process.env.OPIK_API_KEY!,
            'X-API-KEY': process.env.OPIK_API_KEY!,
        },
        requestOptions: {
            headers: {
                Authorization: process.env.OPIK_API_KEY!,
                'X-API-KEY': process.env.OPIK_API_KEY!,
            },
        },
    };

    console.log('🔍 Creating Opik client with config:', {
        apiKey: config.apiKey ? `${config.apiKey.substring(0, 8)}...` : 'MISSING',
        workspaceName: config.workspaceName,
        projectName: config.projectName,
        apiUrl: config.apiUrl,
        configType: typeof config,
        apiKeyType: typeof config.apiKey,
        apiKeyLength: config.apiKey?.length
    });

    return new Opik({ ...config });
}

console.log(`✅ Opik Client configuration ready. Workspace: ${OPIK_CONFIG.workspaceName}, Project: ${OPIK_CONFIG.projectName}`);

export interface TraceData {
    userId?: string;
    agentName: string;
    input: string;
    output: string;
    metadata?: Record<string, unknown>;
    feedbackScore?: number;
    sessionId?: string;
    tags?: string[];
    model?: string;
    latencyMs?: number;
    tokenCount?: number;
}

export async function logTrace(data: TraceData) {
    const results = await Promise.allSettled([
        logToSupabase(data),
        logToOpik(data)
    ]);

    const [supabaseResult, opikResult] = results;

    return {
        id: supabaseResult.status === 'fulfilled' ? supabaseResult.value : null,
        opikTraceId: opikResult.status === 'fulfilled' ? opikResult.value : undefined,
        errors: results
            .filter(r => r.status === 'rejected')
            .map(r => (r as PromiseRejectedResult).reason)
    };
}

async function logToSupabase(data: TraceData): Promise<string> {
    try {
        const { data: insertedTrace, error } = await supabaseService
            .from('agent_traces')
            .insert({
                user_id: data.userId,
                agent_name: data.agentName,
                input: data.input,
                output: data.output,
                metadata: data.metadata || {},
                session_id: data.sessionId,
                tags: data.tags,
                model: data.model,
                latency_ms: data.latencyMs,
                token_count: data.tokenCount,
                feedback_score: data.feedbackScore,
                status: 'completed'
            })
            .select('id')
            .single();

        if (error) throw new Error(`Supabase error: ${error.message}`);

        console.log('✅ Supabase trace logged with ID:', insertedTrace.id);
        return insertedTrace.id;
    } catch (error) {
        console.error('❌ Supabase logging failed:', error);
        throw error;
    }
}

function getTraceId(trace: unknown): string | undefined {
    if (typeof trace !== 'object' || trace === null) {
        return undefined;
    }

    if ('data' in trace) {
        const data = (trace as { data?: { id?: unknown } }).data;
        if (data && typeof data.id === 'string') {
            return data.id;
        }
    }

    if ('id' in trace) {
        const id = (trace as { id?: unknown }).id;
        return typeof id === 'string' ? id : undefined;
    }

    return undefined;
}

async function logToOpik(data: TraceData): Promise<string> {
    try {
        console.log('🔍 Creating Opik trace for:', data.agentName);

        // Create a fresh client for each request to avoid state issues
        const opikClient = createOpikClient();

        // Create trace using SDK
        const trace = opikClient.trace({
            name: data.agentName,
            input: { message: data.input },
            output: { response: data.output },
            metadata: {
                ...data.metadata,
                userId: data.userId,
                sessionId: data.sessionId,
                model: data.model,
                latencyMs: data.latencyMs,
                tokenCount: data.tokenCount,
                timestamp: new Date().toISOString(),
            },
            tags: data.tags,
        });

        // Get the trace ID immediately
        const traceId = getTraceId(trace);
        console.log('🔍 Generated trace ID:', traceId);

        // Add feedback score if provided
        if (data.feedbackScore !== undefined) {
            try {
                trace.score({
                    name: "quality_score",
                    value: data.feedbackScore,
                    reason: "Initial score"
                });
                console.log('✅ Initial feedback score added:', data.feedbackScore, { traceId });
            } catch (scoreError) {
                console.warn('⚠️ Failed to add initial feedback score:', scoreError);
            }
        }

        // End the trace
        trace.end();

        // Flush with timeout and better error handling
        try {
            await Promise.race([
                opikClient.flush(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Opik flush timeout after 10s')), 10000)
                )
            ]);
            console.log('✅ Opik trace flushed successfully');
        } catch (flushError) {
            console.error('❌ Opik flush failed:', flushError);
            // Don't throw here - the trace was still created locally
        }

        console.log('✅ Opik trace completed with ID:', traceId);
        return traceId ?? `trace-missing-${Date.now()}`;

    } catch (error) {
        console.error('❌ Opik logging failed:', error);
        return `error-${Date.now()}`;
    }
}

export async function updateTraceScore(
    dbTraceId: string,
    score: number,
    reason?: string,
    metadata?: Record<string, unknown>
) {
    try {
        const { error } = await supabaseService
            .from('agent_traces')
            .update({
                feedback_score: score,
                feedback_reason: reason,
                metadata: metadata ? { ...metadata, evaluationUpdated: new Date().toISOString() } : undefined,
                updated_at: new Date().toISOString()
            })
            .eq('id', dbTraceId);

        if (error) throw new Error(`Supabase update error: ${error.message}`);

        console.log('✅ Trace score updated in Supabase:', { dbTraceId, score, reason });
    } catch (error) {
        console.error("❌ Failed to update trace score:", error);
        throw error;
    }
}

export async function updateOpikTraceId(dbTraceId: string, opikTraceId: string) {
    try {
        const { error } = await supabaseService
            .from('agent_traces')
            .update({
                opik_trace_id: opikTraceId,
                updated_at: new Date().toISOString()
            })
            .eq('id', dbTraceId);

        if (error) throw new Error(`Failed to update Opik trace ID: ${error.message}`);

        console.log('✅ Opik trace ID updated in Supabase:', { dbTraceId, opikTraceId });
    } catch (error) {
        console.error("❌ Failed to update Opik trace ID:", error);
        throw error;
    }
}

export async function logDelayedFeedback(
    originalTraceData: TraceData,
    feedbackScore: number,
    feedbackName: string = "delayed_feedback"
) {
    try {
        console.log('🔍 Logging delayed feedback for:', originalTraceData.agentName);

        // Create a fresh client
        const opikClient = createOpikClient();

        // Create feedback trace
        const feedbackTrace = opikClient.trace({
            name: `${originalTraceData.agentName}_feedback`,
            input: { original_input: originalTraceData.input },
            output: {
                feedback_provided: true,
                feedback_score: feedbackScore,
                feedback_name: feedbackName
            },
            metadata: {
                ...originalTraceData.metadata,
                feedbackType: "delayed",
                userId: originalTraceData.userId,
                sessionId: originalTraceData.sessionId,
                originalAgent: originalTraceData.agentName,
                timestamp: new Date().toISOString(),
            },
            tags: [...(originalTraceData.tags || []), 'feedback', 'delayed']
        });

        // Add feedback score
        const feedbackTraceId = getTraceId(feedbackTrace);
        feedbackTrace.score({
            name: feedbackName,
            value: feedbackScore,
            reason: "Delayed evaluation feedback"
        });

        // End the trace
        feedbackTrace.end();

        // Flush with timeout
        try {
            await Promise.race([
                opikClient.flush(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Delayed feedback flush timeout')), 10000)
                )
            ]);
            console.log('✅ Delayed feedback flushed successfully');
        } catch (flushError) {
            console.warn('⚠️ Delayed feedback flush failed:', flushError);
        }

        console.log('✅ Delayed feedback logged with ID:', feedbackTraceId);
        return feedbackTraceId ?? `trace-missing-${Date.now()}`;

    } catch (error) {
        console.error("❌ Failed to log delayed feedback:", error);
        throw error;
    }
}

// Test function to verify Opik connection
export async function testOpikConnection(): Promise<boolean> {
    try {
        console.log('🧪 Testing Opik connection...');

        // Create a fresh client
        const opikClient = createOpikClient();

        // Create test trace
        const testTrace = opikClient.trace({
            name: "connection_test",
            input: { test: "hello" },
            output: { response: "world" },
            metadata: {
                test: true,
                timestamp: new Date().toISOString(),
            },
            tags: ['test', 'connection']
        });

        const traceId = getTraceId(testTrace);
        console.log('🔍 Test trace ID:', traceId);

        // End the trace
        testTrace.end();

        // Flush with timeout
        await Promise.race([
            opikClient.flush(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Test connection timeout')), 15000)
            )
        ]);

        console.log('✅ Opik connection test PASSED');
        console.log(`🔗 Dashboard URL: https://www.comet.com/${OPIK_CONFIG.workspaceName}/opik/${OPIK_CONFIG.projectName}`);
        return true;

    } catch (error) {
        console.error('❌ Opik connection test ERROR:', error);
        return false;
    }
}

export async function testBothSystems(): Promise<void> {
    console.log('🧪 Testing both Supabase and Opik...');

    try {
        const { data, error } = await supabaseService
            .from('agent_traces')
            .insert({
                agent_name: 'test-agent',
                input: 'test input',
                output: 'test output',
                status: 'completed'
            })
            .select('id')
            .single();

        if (error) {
            console.error('❌ Supabase test failed:', error);
        } else {
            console.log('✅ Supabase test passed:', data.id);
            await supabaseService
                .from('agent_traces')
                .delete()
                .eq('id', data.id);
        }
    } catch (error) {
        console.error('❌ Supabase test error:', error);
    }

    await testOpikConnection();
}

export function checkOpikConfiguration(): boolean {
    const hasApiKey = !!OPIK_CONFIG.apiKey;
    const hasWorkspace = !!OPIK_CONFIG.workspaceName;
    const hasProject = !!OPIK_CONFIG.projectName;
    const hasUrl = !!OPIK_CONFIG.apiUrl;

    if (!hasApiKey || !hasWorkspace || !hasProject || !hasUrl) {
        console.error("❌ Opik configuration incomplete:", {
            hasApiKey,
            hasWorkspace,
            hasProject,
            hasUrl,
        });
        return false;
    }

    console.log('✅ Opik configuration complete');
    return true;
}

export async function debugOpikAPI(): Promise<void> {
    console.log('🔍 Debugging Opik SDK configuration...');
    console.log('Configuration:', {
        workspaceName: OPIK_CONFIG.workspaceName,
        projectName: OPIK_CONFIG.projectName,
        apiUrl: OPIK_CONFIG.apiUrl,
        hasApiKey: !!OPIK_CONFIG.apiKey,
        apiKeyPrefix: OPIK_CONFIG.apiKey ? `${OPIK_CONFIG.apiKey.substring(0, 8)}...` : 'MISSING'
    });

    // Check configuration first
    if (!checkOpikConfiguration()) {
        console.error('❌ Cannot test connection - configuration incomplete');
        return;
    }

    // Test the connection
    const connectionResult = await testOpikConnection();

    if (connectionResult) {
        console.log('🎉 Opik SDK integration is working correctly!');
    } else {
        console.log('💡 Troubleshooting tips:');
        console.log('1. Check your .env.local file exists in the project root');
        console.log('2. Restart your Next.js development server');
        console.log('3. Verify your API key is correct and active');
        console.log('4. Ensure workspace and project names match exactly');
        console.log('5. Try running: await debugOpikAPI() in your API route');
    }
}

// Enhanced logging function with correlation
export async function logTraceEnhanced(data: TraceData) {
    try {
        // Log to both systems
        const result = await logTrace(data);

        // If both succeeded, correlate them
        if (result.id && result.opikTraceId) {
            await updateOpikTraceId(result.id, result.opikTraceId);
        }

        return result;
    } catch (error) {
        console.error('❌ Enhanced trace logging failed:', error);
        throw error;
    }
}

// Utility function to search traces
export async function searchTraces(filters: {
    userId?: string;
    agentName?: string;
    sessionId?: string;
    minScore?: number;
    maxScore?: number;
    startDate?: string;
    endDate?: string;
    tags?: string[];
    limit?: number;
}) {
    try {
        let query = supabaseService
            .from('agent_traces')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.userId) {
            query = query.eq('user_id', filters.userId);
        }

        if (filters.agentName) {
            query = query.eq('agent_name', filters.agentName);
        }

        if (filters.sessionId) {
            query = query.eq('session_id', filters.sessionId);
        }

        if (filters.minScore !== undefined) {
            query = query.gte('feedback_score', filters.minScore);
        }

        if (filters.maxScore !== undefined) {
            query = query.lte('feedback_score', filters.maxScore);
        }

        if (filters.startDate) {
            query = query.gte('created_at', filters.startDate);
        }

        if (filters.endDate) {
            query = query.lte('created_at', filters.endDate);
        }

        if (filters.tags && filters.tags.length > 0) {
            query = query.overlaps('tags', filters.tags);
        }

        if (filters.limit) {
            query = query.limit(filters.limit);
        } else {
            query = query.limit(100); // Default limit
        }

        const { data, error } = await query;

        if (error) throw new Error(`Search error: ${error.message}`);

        return data;
    } catch (error) {
        console.error('❌ Failed to search traces:', error);
        throw error;
    }
}

// Analytics function to get trace statistics
export async function getTraceAnalytics(filters: {
    userId?: string;
    agentName?: string;
    sessionId?: string;
    startDate?: string;
    endDate?: string;
}) {
    try {
        let query = supabaseService
            .from('agent_traces')
            .select(`
                id,
                agent_name,
                feedback_score,
                latency_ms,
                token_count,
                status,
                created_at
            `);

        if (filters.userId) {
            query = query.eq('user_id', filters.userId);
        }

        if (filters.agentName) {
            query = query.eq('agent_name', filters.agentName);
        }

        if (filters.sessionId) {
            query = query.eq('session_id', filters.sessionId);
        }

        if (filters.startDate) {
            query = query.gte('created_at', filters.startDate);
        }

        if (filters.endDate) {
            query = query.lte('created_at', filters.endDate);
        }

        const { data, error } = await query;

        if (error) throw new Error(`Analytics error: ${error.message}`);

        // Calculate statistics
        const analytics = {
            totalTraces: data.length,
            averageScore: data.filter(t => t.feedback_score !== null)
                .reduce((sum, t) => sum + (t.feedback_score || 0), 0) /
                data.filter(t => t.feedback_score !== null).length || 0,
            averageLatency: data.filter(t => t.latency_ms !== null)
                .reduce((sum, t) => sum + (t.latency_ms || 0), 0) /
                data.filter(t => t.latency_ms !== null).length || 0,
            totalTokens: data.reduce((sum, t) => sum + (t.token_count || 0), 0),
            statusDistribution: data.reduce((acc, t) => {
                acc[t.status] = (acc[t.status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            agentDistribution: data.reduce((acc, t) => {
                acc[t.agent_name] = (acc[t.agent_name] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            scoreDistribution: {
                excellent: data.filter(t => (t.feedback_score || 0) >= 0.8).length,
                good: data.filter(t => (t.feedback_score || 0) >= 0.6 && (t.feedback_score || 0) < 0.8).length,
                fair: data.filter(t => (t.feedback_score || 0) >= 0.4 && (t.feedback_score || 0) < 0.6).length,
                poor: data.filter(t => (t.feedback_score || 0) < 0.4 && t.feedback_score !== null).length,
                unrated: data.filter(t => t.feedback_score === null).length,
            }
        };

        return analytics;
    } catch (error) {
        console.error('❌ Failed to get trace analytics:', error);
        throw error;
    }
}

// Function to batch update traces
export async function batchUpdateTraces(
    traceIds: string[],
    updates: {
        feedback_score?: number;
        feedback_reason?: string;
        tags?: string[];
        metadata?: Record<string, unknown>;
        status?: string;
    }
) {
    try {
        const { error } = await supabaseService
            .from('agent_traces')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .in('id', traceIds);

        if (error) throw new Error(`Batch update error: ${error.message}`);

        console.log(`✅ Batch updated ${traceIds.length} traces`);
        return true;
    } catch (error) {
        console.error('❌ Failed to batch update traces:', error);
        throw error;
    }
}

// Function to export traces for analysis
export async function exportTraces(filters: {
    userId?: string;
    agentName?: string;
    sessionId?: string;
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'csv';
}) {
    try {
        const traces = await searchTraces({
            ...filters,
            limit: 10000 // Large limit for export
        });

        if (filters.format === 'csv') {
            // Convert to CSV format
            const headers = [
                'id', 'user_id', 'agent_name', 'input', 'output',
                'feedback_score', 'latency_ms', 'token_count',
                'status', 'session_id', 'created_at'
            ];

            const csvRows = traces.map(trace =>
                headers.map(header => {
                    const value = trace[header];
                    if (typeof value === 'object' && value !== null) {
                        return JSON.stringify(value).replace(/"/g, '""');
                    }
                    return value || '';
                }).join(',')
            );

            return [headers.join(','), ...csvRows].join('\n');
        }

        return traces; // Return as JSON by default
    } catch (error) {
        console.error('❌ Failed to export traces:', error);
        throw error;
    }
}

// Function to clean up old traces
export async function cleanupOldTraces(daysOld: number = 30) {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const { error } = await supabaseService
            .from('agent_traces')
            .delete()
            .lt('created_at', cutoffDate.toISOString());

        if (error) throw new Error(`Cleanup error: ${error.message}`);

        console.log(`✅ Cleaned up traces older than ${daysOld} days`);
        return true;
    } catch (error) {
        console.error('❌ Failed to cleanup old traces:', error);
        throw error;
    }
}

// Real-time trace monitoring function
export async function monitorTraces(callback: (trace: Record<string, unknown>) => void) {
    try {
        const channel = supabaseService
            .channel('trace-monitor')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'agent_traces'
                },
                (payload) => {
                    console.log('🔔 New trace created:', payload.new);
                    callback(payload.new);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'agent_traces'
                },
                (payload) => {
                    console.log('🔔 Trace updated:', payload.new);
                    callback(payload.new);
                }
            )
            .subscribe();

        return channel;
    } catch (error) {
        console.error('❌ Failed to setup trace monitoring:', error);
        throw error;
    }
}

// Health check function
export async function healthCheck(): Promise<{
    supabase: boolean;
    opik: boolean;
    overall: boolean;
}> {
    const results = {
        supabase: false,
        opik: false,
        overall: false
    };

    try {
        // Test Supabase connection
        const { error: supabaseError } = await supabaseService
            .from('agent_traces')
            .select('id')
            .limit(1);

        results.supabase = !supabaseError;

        if (supabaseError) {
            console.error('❌ Supabase health check failed:', supabaseError);
        } else {
            console.log('✅ Supabase health check passed');
        }
    } catch (error) {
        console.error('❌ Supabase health check error:', error);
    }

    try {
        // Test Opik connection
        results.opik = await testOpikConnection();
    } catch (error) {
        console.error('❌ Opik health check error:', error);
    }

    results.overall = results.supabase && results.opik;

    console.log('🏥 Health check results:', results);
    return results;
}

