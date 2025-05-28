// /api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({ error: 'Missing url parameter' });
    return;
  }

  try {
    const response = await fetch(url);

    // Copy content-type header from proxied response
    const contentType = response.headers.get('content-type') || 'text/plain';
    res.setHeader('Content-Type', contentType);

    // Stream the proxied response body directly
    const body = await response.buffer();
    res.status(response.status).send(body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
}
