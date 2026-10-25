import app from './worker-home-ultra.js';

const LLMS_DISCOVERY_LINK = '<link rel="describedby" href="/llms.txt" type="text/plain">';

export default {
  async fetch(request, env, ctx) {
    const response = await app.fetch(request, env, ctx);
    const contentType = response.headers.get('content-type') || '';

    if (
      request.method === 'HEAD' ||
      !response.ok ||
      !contentType.includes('text/html')
    ) {
      return response;
    }

    return new HTMLRewriter()
      .on('head', {
        element(element) {
          element.append(LLMS_DISCOVERY_LINK, { html: true });
        }
      })
      .transform(response);
  }
};
