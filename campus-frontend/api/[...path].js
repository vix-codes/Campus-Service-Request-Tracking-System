export default async function handler(req, res) {
  const origin =
    process.env.API_ORIGIN ||
    process.env.BACKEND_ORIGIN ||
    process.env.BACKEND_URL ||
    process.env.API_URL ||
    "";

  if (!origin) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        message:
          "Missing API_ORIGIN env var. Set it to your Railway backend origin, e.g. https://your-app.up.railway.app",
      })
    );
    return;
  }

  const pathParts = Array.isArray(req.query?.path) ? req.query.path : [];
  const target = new URL(origin.replace(/\/+$/, "") + "/api/" + pathParts.join("/"));

  const qIndex = req.url.indexOf("?");
  if (qIndex !== -1) target.search = req.url.slice(qIndex);

  const method = (req.method || "GET").toUpperCase();

  const headers = { ...req.headers };
  delete headers.host;
  // Fetch will compute this for us if we send a body.
  delete headers["content-length"];
  delete headers["Content-Length"];
  // Avoid forwarding compressed encodings; Node fetch will manage downstream.
  delete headers["accept-encoding"];
  delete headers["Accept-Encoding"];

  // Rebuild body for JSON requests (Vercel may parse `req.body` into an object).
  let body = undefined;
  if (!["GET", "HEAD"].includes(method)) {
    const ct = String(headers["content-type"] || "").toLowerCase();
    if (ct.includes("application/json") && req.body && typeof req.body === "object") {
      body = JSON.stringify(req.body);
    } else if (typeof req.body === "string" || Buffer.isBuffer(req.body)) {
      body = req.body;
    } else if (req.body != null) {
      // Fallback: attempt to serialize unknown shapes.
      body = JSON.stringify(req.body);
      headers["content-type"] = "application/json";
    }
  }

  const upstream = await fetch(target, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  res.statusCode = upstream.status;
  res.setHeader("cache-control", "no-store");

  upstream.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    // Don't forward hop-by-hop headers.
    if (k === "transfer-encoding" || k === "content-encoding" || k === "connection") return;
    res.setHeader(key, value);
  });

  const buf = Buffer.from(await upstream.arrayBuffer());
  res.end(buf);
}
