export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.astrovip.ro") {
      url.protocol = "https:";
      url.hostname = "astrovip.ro";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
