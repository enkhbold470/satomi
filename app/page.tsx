"use client";
import { useEffect, useState } from "react";
interface OMIWebhookHealthCheckResponse {
  "status": string;
  service: string;
  description: string;
  version: string;
}

export default function Home() {
  const [data, setData] = useState<OMIWebhookHealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWebhook() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/omi/webhook");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchWebhook();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <h1 className="mb-6 text-3xl font-semibold text-black dark:text-zinc-50">
          /api/omi/webhook response
        </h1>
        <div className="w-full max-w-2xl rounded bg-zinc-100 dark:bg-zinc-900 p-6">
          {loading && <p className="text-zinc-500">Loading...</p>}
          {error && (
            <pre className="text-red-500 whitespace-pre-wrap break-words">
              Error: {error}
            </pre>
          )}
          {!loading && !error && (
            <pre className="whitespace-pre-wrap break-words text-sm text-zinc-800 dark:text-zinc-200">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}
