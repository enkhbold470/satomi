"use client";
import { useEffect, useState } from "react";

interface Transcript {
  id: number;
  session_id: string;
  transcript: string;
  created_at: string;
  audio_file_path: string | null;
}

interface TranscriptsResponse {
  transcripts: Transcript[];
  count: number;
  timestamp: string;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function Home() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTranscripts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/transcripts");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json: TranscriptsResponse = await res.json();
      setTranscripts(json.transcripts);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setTranscripts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscripts();
    // Refresh every 5 seconds
    const interval = setInterval(fetchTranscripts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Satomi Transcripts
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Real-time audio transcriptions from OMI device
          </p>
        </div>

        {loading && transcripts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">Loading transcripts...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          </div>
        )}

        {!loading && transcripts.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No transcripts yet. Start speaking to see transcriptions appear here.</p>
          </div>
        )}

        {transcripts.length > 0 && (
          <div className="space-y-6">
            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800"></div>

              {transcripts.map((transcript, index) => (
                <div key={transcript.id} className="relative flex gap-6 pb-8 last:pb-0">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-black flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-zinc-600 dark:bg-zinc-400"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Session: {transcript.session_id.slice(0, 8)}...
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                            {formatTime(transcript.created_at)}
                          </div>
                        </div>
                        <div className="text-xs text-zinc-400 dark:text-zinc-500">
                          #{transcript.id}
                        </div>
                      </div>

                      {/* Transcript */}
                      <div className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {transcript.transcript}
                      </div>

                      {/* Footer */}
                      {transcript.audio_file_path && (
                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            Audio: {transcript.audio_file_path.split('/').pop()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {transcripts.length > 0 && (
          <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Showing {transcripts.length} transcript{transcripts.length !== 1 ? 's' : ''}
          </div>
        )}
      </main>
    </div>
  );
}
