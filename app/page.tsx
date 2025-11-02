"use client";

import { useEffect, useState } from "react";

interface Transcript {
  id: string;
  sessionId: string;
  transcript: string;
  audioFilepath: string | null;
  createdAt: string;
}

interface TranscriptsResponse {
  transcripts: Transcript[];
  total: number;
  timestamp: string;
}

export default function Home() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchTranscripts = async () => {
    try {
      const res = await fetch("/api/transcripts");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data: TranscriptsResponse = await res.json();
      setTranscripts(data.transcripts);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching transcripts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately
    fetchTranscripts();

    // Then fetch every 10 seconds
    const interval = setInterval(() => {
      fetchTranscripts();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            🎌 Satomi Transcript Timeline
          </h1>
          <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Auto-refreshing every 10 seconds</span>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && transcripts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-50"></div>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading transcripts...</p>
          </div>
        )}

        {/* Transcripts Timeline */}
        {transcripts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400">No transcripts yet. Start speaking to see them appear here!</p>
          </div>
        )}

        {transcripts.length > 0 && (
          <div className="space-y-4">
            {transcripts.map((transcript, index) => {
              const isNew = index === 0;
              const prevDate = index > 0 ? new Date(transcripts[index - 1].createdAt) : null;
              const currentDate = new Date(transcript.createdAt);
              const showDateDivider = !prevDate || 
                prevDate.toDateString() !== currentDate.toDateString();

              return (
                <div key={transcript.id}>
                  {/* Date Divider */}
                  {showDateDivider && (
                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></div>
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {formatDate(transcript.createdAt)}
                      </span>
                      <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></div>
                    </div>
                  )}

                  {/* Transcript Card */}
                  <div className={`bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 transition-all ${
                    isNew ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          isNew ? 'bg-blue-500 animate-pulse' : 'bg-zinc-400'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Session: <span className="font-mono text-xs">{transcript.sessionId.slice(0, 8)}</span>
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500">
                            {formatTime(transcript.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-zinc-900 dark:text-zinc-100 text-lg leading-relaxed">
                      {transcript.transcript}
                    </p>

                    {transcript.audioFilepath && (
                      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 font-mono truncate">
                          📁 {transcript.audioFilepath.split('/').pop()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Footer */}
        {transcripts.length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
              <span>Total transcripts: <strong className="text-zinc-900 dark:text-zinc-50">{transcripts.length}</strong></span>
              <span>Showing latest {transcripts.length} entries</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
