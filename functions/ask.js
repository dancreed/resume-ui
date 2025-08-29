export async function onRequestPost(context) {
  const reqBody = await context.request.json();
  // Replace with your actual Worker endpoint!
  const workerURL = "https://resume-worker.dan-creed.workers.dev/ask";
  const result = await fetch(workerURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody)
  });
  return result;
}
