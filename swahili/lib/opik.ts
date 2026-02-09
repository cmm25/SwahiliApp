import { Opik } from 'opik';
import { createClient } from '@supabase/supabase-js';

// Create service role client that bypasses RLS
const supabaseService = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// Debug environment variables
console.log('🔍 Environment check:', {
    hasApiKey: !!process.env.OPIK_API_KEY,
    apiKeyLength: process.env.OPIK_API_KEY?.length,
    workspace: process.env.OPIK_WORKSPACE,
    project: process.env.OPIK_PROJECT_NAME,
    url: process.env.OPIK_URL_OVERRIDE,
});

// Validate required environment variables
const requiredEnvVars = {
    OPIK_API_KEY: process.env.OPIK_API_KEY,
    OPIK_WORKSPACE: process.env.OPIK_WORKSPACE,
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
    workspaceName: process.env.OPIK_WORKSPACE!,
    projectName: process.env.OPIK_PROJECT_NAME!,
    apiUrl: process.env.OPIK_URL_OVERRIDE || 'https://www.comet.com/opik/api',
};

// Function to create a fresh Opik client
export function createOpikClient() {
    const authHeader = `${OPIK_CONFIG.apiKey}`;
    const headers = {
        'Authorization': authHeader, 
        'X-API-KEY': OPIK_CONFIG.apiKey,
        'Comet-Workspace': OPIK_CONFIG.workspaceName
    };
    
    // Explicitly configure axios/fetch options to ensure headers are sent
    const config = {
        ...OPIK_CONFIG,
        headers,
        // Opik SDK specific options
        requestOptions: {
            headers,
        },
        // Underlying fetch options
        fetchOptions: {
            headers,
        },
    };

    console.log('🔍 Creating Opik client with config:', {
        workspaceName: OPIK_CONFIG.workspaceName,
        projectName: OPIK_CONFIG.projectName,
        apiKeyPrefix: OPIK_CONFIG.apiKey ? `${OPIK_CONFIG.apiKey.substring(0, 8)}...` : 'MISSING'
    });
    
    return new Opik(config);
}

console.log(`✅ Opik Client configuration ready. Workspace: ${OPIK_CONFIG.workspaceName}, Project: ${OPIK_CONFIG.projectName}`);

// Simplified TraceData interface matching your schema
export interface TraceData {
    userId?: string;          // Required for Supabase insert
    agentName: string;       // Required
    input: string;           // Required
    output: string;          // Required for completed traces
    feedbackScore?: number;  // Optional - can be added later
    sessionId?: string;      // Optional - for conversation grouping
    
    // These fields go to Opik only, not Supabase
    metadata?: Record<string, unknown>;
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

// Simplified Supabase logging - only essential fields
async function logToSupabase(data: TraceData): Promise<string> {
    try {
        const resolvedUserId = data.userId ?? process.env.PUBLIC_TRACE_USER_ID;
        if (!resolvedUserId) {
            console.warn('⚠️ Skipping Supabase log because userId is missing');
            return `skipped-no-user-${Date.now()}`;
        }

        const { data: insertedTrace, error } = await supabaseService
            .from('agent_traces')
            .insert({
                user_id: resolvedUserId,           // Required
                agent_name: data.agentName,     // Required
                input: data.input,              // Required
                output: data.output,            // Required
                feedback_score: data.feedbackScore, // Optional
                session_id: data.sessionId,     // Optional
                // opik_trace_id will be updated later
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

// Full Opik logging with all metadata
async function logToOpik(data: TraceData): Promise<string> {
    try {
        console.log('🔍 Creating Opik trace for:', data.agentName);

        const opikClient = createOpikClient();

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

        trace.end();

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
        }

        console.log('✅ Opik trace completed with ID:', traceId);
        return traceId ?? `trace-missing-${Date.now()}`;

    } catch (error) {
        console.error('❌ Opik logging failed:', error);
        return `error-${Date.now()}`;
    }
}

// Update trace score in Supabase
export async function updateTraceScore(
    dbTraceId: string,
    score: number
) {
    try {
        const { error } = await supabaseService
            .from('agent_traces')
            .update({
                feedback_score: score
            })
            .eq('id', dbTraceId);

        if (error) throw new Error(`Supabase update error: ${error.message}`);
        
        console.log('✅ Trace score updated in Supabase:', { dbTraceId, score });
    } catch (error) {
        console.error("❌ Failed to update trace score:", error);
        throw error;
    }
}

// Link Supabase trace with Opik trace ID
export async function updateOpikTraceId(dbTraceId: string, opikTraceId: string) {
    try {
        const { error } = await supabaseService
            .from('agent_traces')
            .update({
                opik_trace_id: opikTraceId
            })
            .eq('id', dbTraceId);

        if (error) throw new Error(`Failed to update Opik trace ID: ${error.message}`);
        
        console.log('✅ Opik trace ID updated in Supabase:', { dbTraceId, opikTraceId });
    } catch (error) {
        console.error("❌ Failed to update Opik trace ID:", error);
        throw error;
    }
}

// Enhanced logging with correlation
export async function logTraceEnhanced(data: TraceData) {
    try {
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

// Delayed feedback for evaluations
export async function logDelayedFeedback(
    originalTraceData: TraceData,
    feedbackScore: number,
    feedbackName: string = "delayed_feedback"
) {
    try {
        console.log('🔍 Logging delayed feedback for:', originalTraceData.agentName);

        const opikClient = createOpikClient();

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

        feedbackTrace.score({
            name: feedbackName,
            value: feedbackScore,
            reason: "Delayed evaluation feedback"
        });

        feedbackTrace.end();

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

        const feedbackTraceId = getTraceId(feedbackTrace);
        console.log('✅ Delayed feedback logged with ID:', feedbackTraceId);
        return feedbackTraceId ?? `trace-missing-${Date.now()}`;

    } catch (error) {
        console.error("❌ Failed to log delayed feedback:", error);
        throw error;
    }
}

// Search traces (simplified for your schema)
export async function searchTraces(filters: {
    userId?: string;
    agentName?: string;
    sessionId?: string;
    minScore?: number;
    maxScore?: number;
    startDate?: string;
    endDate?: string;
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
        
        query = query.limit(filters.limit || 50);

        const { data, error } = await query;

        if (error) throw new Error(`Search error: ${error.message}`);
        
        return data;
    } catch (error) {
        console.error('❌ Failed to search traces:', error);
        throw error;
    }
}

// Simple analytics for your schema
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
            .select('id, agent_name, feedback_score, created_at');

        if (filters.userId) query = query.eq('user_id', filters.userId);
        if (filters.agentName) query = query.eq('agent_name', filters.agentName);
        if (filters.sessionId) query = query.eq('session_id', filters.sessionId);
        if (filters.startDate) query = query.gte('created_at', filters.startDate);
        if (filters.endDate) query = query.lte('created_at', filters.endDate);

        const { data, error } = await query;

        if (error) throw new Error(`Analytics error: ${error.message}`);
        
        const analytics = {
            totalTraces: data.length,
            averageScore: data.filter(t => t.feedback_score !== null)
                .reduce((sum, t) => sum + (t.feedback_score || 0), 0) / 
                data.filter(t => t.feedback_score !== null).length || 0,
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

// Test connection
export async function testOpikConnection(): Promise<boolean> {
    try {
        console.log('🧪 Testing Opik connection...');
        
        const opikClient = createOpikClient();

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

        testTrace.end();

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

    if (!checkOpikConfiguration()) {
        console.error('❌ Cannot test connection - configuration incomplete');
        return;
    }

    const connectionResult = await testOpikConnection();
    
    if (connectionResult) {
        console.log('🎉 Opik SDK integration is working correctly!');
    } else {
        console.log('💡 Troubleshooting tips:');
        console.log('1. Check your .env.local file exists in the project root');
        console.log('2. Restart your Next.js development server');
        console.log('3. Verify your API key is correct and active');
        console.log('4. Ensure workspace and project names match exactly');
    }
}

// Health check for both systems
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

// Get user's conversation history
export async function getUserConversationHistory(
    userId: string,
    sessionId?: string,
    limit: number = 20
) {
    try {
        let query = supabaseService
            .from('agent_traces')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (sessionId) {
            query = query.eq('session_id', sessionId);
        }

        const { data, error } = await query;

        if (error) throw new Error(`Failed to get conversation history: ${error.message}`);
        
        return data;
    } catch (error) {
        console.error('❌ Failed to get conversation history:', error);
        throw error;
    }
}

// Get user's learning progress
export async function getUserLearningProgress(userId: string) {
    try {
        const { data, error } = await supabaseService
            .from('agent_traces')
            .select('feedback_score, created_at, agent_name')
            .eq('user_id', userId)
            .not('feedback_score', 'is', null)
            .order('created_at', { ascending: true });

        if (error) throw new Error(`Failed to get learning progress: ${error.message}`);
        
        // Calculate progress metrics
        const progress = {
            totalSessions: data.length,
            averageScore: data.reduce((sum, t) => sum + (t.feedback_score || 0), 0) / data.length || 0,
            recentTrend: data.slice(-10), // Last 10 sessions
            agentUsage: data.reduce((acc, t) => {
                acc[t.agent_name] = (acc[t.agent_name] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            improvementTrend: calculateImprovementTrend(data)
        };
        
        return progress;
    } catch (error) {
        console.error('❌ Failed to get learning progress:', error);
        throw error;
    }
}

// Helper function to calculate improvement trend
function calculateImprovementTrend(
    data: Array<{ feedback_score: number | null }>
) {
    if (data.length < 2) return 0;
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, t) => sum + (t.feedback_score || 0), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, t) => sum + (t.feedback_score || 0), 0) / secondHalf.length;
    
    return secondAvg - firstAvg; // Positive = improvement, Negative = decline
}

// Batch operations for admin/maintenance
export async function batchUpdateTraces(
    traceIds: string[],
    updates: {
        feedback_score?: number;
        session_id?: string;
        opik_trace_id?: string;
    }
) {
    try {
        const { error } = await supabaseService
            .from('agent_traces')
            .update(updates)
            .in('id', traceIds);

        if (error) throw new Error(`Batch update error: ${error.message}`);
        
        console.log(`✅ Batch updated ${traceIds.length} traces`);
        return true;
    } catch (error) {
        console.error('❌ Failed to batch update traces:', error);
        throw error;
    }
}

// Clean up old traces (for maintenance)
export async function cleanupOldTraces(daysOld: number = 90) {
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

