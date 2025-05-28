// pages/api/proxy.js

export default async function handler(req, res) {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    const response = await fetch(targetUrl, {
      // You can add custom headers here if needed
      // headers: {
      //   'User-Agent': req.headers['user-agent'] || 'GoGard++ Proxy',
      // },
    });

    // Forward content-type header to client
    const contentType = response.headers.get("content-type") || "text/html";
    res.setHeader("content-type", contentType);

    // Stream response body as a buffer
    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send("Proxy error: " + error.message);
  }
}
