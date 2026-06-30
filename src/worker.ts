/**
 * 505local.com — Workers Static Assets entrypoint
 *
 * Handles:
 *  - /index.html → / 301 redirect
 *  - Canonical Link header on root path
 *  - Security headers on all responses
 *  - Cache control for static assets
 *  - Sitemap Content-Type enforcement
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Redirect /index.html to / (301) — prevents duplicate canonical indexing
    if (pathname === '/index.html') {
      return Response.redirect(`${url.origin}/`, 301);
    }

    // Block direct access to edge config files
    if (pathname === '/_headers' || pathname === '/_redirects') {
      return new Response('Not Found', { status: 404 });
    }

    // Serve from static assets
    let response = await env.ASSETS.fetch(request);

    // If assets didn't find anything, return the raw response (likely 404)
    if (response.status === 404) {
      return addSecurityHeaders(response);
    }

    // Clone and enrich headers
    const headers = new Headers(response.headers);

    // --- Canonical Link header on root ---
    if (pathname === '/') {
      headers.set('Link', '<https://505local.com/>; rel="canonical"');
    }

    // --- Security headers on all responses ---
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // --- Cache-Control for sitemaps ---
    if (pathname === '/sitemap-index.xml' || pathname === '/sitemap-0.xml') {
      headers.set('Content-Type', 'application/xml; charset=utf-8');
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    }

    // --- Immutable cache for hashed assets ---
    if (pathname.startsWith('/_astro/')) {
      const ext = pathname.split('.').pop();
      if (ext === 'css' || ext === 'js' || ext === 'svg' || ext === 'woff2') {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

/** Apply security headers to a response (used for 404s too) */
function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}
