export async function sendMessage(query: string, model: string) {
  const start = Date.now();

  const res = await fetch("http://127.0.0.1:8000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      model, // send selected model
    }),
  });

  const data = await res.json();

  const latency = Date.now() - start;

  return {
    ...data,
    latency,
  };
}