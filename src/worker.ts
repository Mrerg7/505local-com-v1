/**
 * 505local.com — Workers Static Assets entrypoint
 *
 * Normalizes URLs for Google Search Console:
 *  - www → apex (301)
 *  - /index.html → / (301)
 *  - /404 and /404.html → /404/ (301)
 *  - Canonical Link header on homepage
 */
const CANONICAL_ORIGIN = 'https://505local.com';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (url.hostname === 'www.505local.com') {
      return redirect301(toCanonicalPath(pathname) + url.search);
    }

    if (pathname === '/_headers' || pathname === '/_redirects') {
      return new Response('Not Found', { status: 404 });
    }

    if (pathname === '/index.html') {
      return redirect301(`${CANONICAL_ORIGIN}/`);
    }

    if (pathname === '/404.html' || pathname === '/404') {
      return redirect301(`${CANONICAL_ORIGIN}/404/`);
    }

    const response = await env.ASSETS.fetch(request);

    if (response.status === 404) {
      return withSecurityHeaders(response);
    }

    const headers = new Headers(response.headers);

    if (pathname === '/') {
      headers.set('Link', `<${CANONICAL_ORIGIN}/>; rel="canonical"`);
    }

    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (pathname === '/sitemap-index.xml' || pathname === '/sitemap-0.xml') {
      headers.set('Content-Type', 'application/xml; charset=utf-8');
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    }

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

function toCanonicalPath(pathname: string): string {
  if (pathname === '/index.html') {
    return `${CANONICAL_ORIGIN}/`;
  }
  if (pathname === '/404.html' || pathname === '/404') {
    return `${CANONICAL_ORIGIN}/404/`;
  }
  if (pathname !== '/' && !pathname.endsWith('/')) {
    return `${CANONICAL_ORIGIN}${pathname}/`;
  }
  return `${CANONICAL_ORIGIN}${pathname}`;
}

function redirect301(location: string): Response {
  return Response.redirect(location, 301);
}

function withSecurityHeaders(response: Response): Response {
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
