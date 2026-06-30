/**
 * 505local.com — Workers Static Assets entrypoint
 *
 * Minimal worker: handles /index.html → / redirect.
 * All other requests pass through to static assets unchanged.
 * Canonical enforcement is handled via HTML <link rel="canonical">.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Redirect /index.html to / (301)
    if (pathname === '/index.html') {
      return Response.redirect(url.origin + '/', 301);
    }

    // Serve all other requests from static assets
    return env.ASSETS.fetch(request);
  },
};
