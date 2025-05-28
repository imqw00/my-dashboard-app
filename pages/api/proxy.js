export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host,
      },
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    });

    const contentType = response.headers.get("content-type");
    res.setHeader("Content-Type", contentType || "text/plain");

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: "Proxy request failed", details: error.message });
  }
}
