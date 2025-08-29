export async function onRequestPost(context) {
  const reqBody = await context.request.json();

  // Use your actual Worker endpoint:
  const WORKER_URL = "https://resume-worker.dan-creed.workers.dev/ask";

  const workerRes = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody)
  });

  // Forward the plain text response as-is
  return new Response(
    await workerRes.text(),
    {
      status: workerRes.status,
      headers: { "Content-Type": "text/plain" }
    }
  );
}
