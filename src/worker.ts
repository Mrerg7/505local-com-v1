// @ts-nocheck
/**
 * 505local.com — Workers Static Assets entrypoint
 *
 * Normalizes URLs for Google Search Console:
 *  - www → apex (301)
 *  - /index.html → / (301)
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (url.hostname === 'www.505local.com') {
      return Response.redirect(`https://505local.com${pathname}${url.search}`, 301);
    }

    if (pathname === '/index.html') {
      return Response.redirect('https://505local.com/', 301);
    }

    return env.ASSETS.fetch(request);
  },
};
