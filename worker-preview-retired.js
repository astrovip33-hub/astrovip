export default {
  async fetch(request) {
    const source = new URL(request.url);
    const target = new URL(source.pathname + source.search, 'https://astrovip.ro');
    return new Response(null, {
      status: 301,
      headers: {
        'Location': target.toString(),
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'Cache-Control': 'public, max-age=300'
      }
    });
  }
};
