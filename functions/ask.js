export async function onRequestPost(context) {
  const reqBody = await context.request.json();

  // Proxy to your Worker endpoint:
  const WORKER_URL = "https://resume-worker.dan-creed.workers.dev/ask";

  const workerRes = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody)
  });

  // Forward back the response
  return new Response(
    await workerRes.body,
    {
      status: workerRes.status,
      headers: { "Content-Type": "application/json" }
    }
  );
}
