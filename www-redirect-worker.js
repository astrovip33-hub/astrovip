export default {
  async fetch(request) {
    const source = new URL(request.url);
    const target = new URL(request.url);

    target.protocol = "https:";
    target.hostname = "astrovip.ro";
    target.port = "";

    return new Response(null, {
      status: 301,
      headers: {
        "Location": target.toString(),
        "Cache-Control": "public, max-age=3600"
      }
    });
  }
};
