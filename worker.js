const SITE_NAME = "دیجی وحید نیری | DJ Vahid Niri";
const DESCRIPTION = "وب‌سایت رسمی وحید نیری؛ خدمات دی‌جی، موسیقی، میکس زنده، صدا و نورپردازی مراسم در آباده.";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/robots.txt") {
      const body = `User-agent: *\nAllow: /\nSitemap: ${url.origin}/sitemap.xml\n`;
      return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
    }
    if (url.pathname === "/sitemap.xml") {
      const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url.origin}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>`;
      return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
    }
    if (url.pathname === "/health") {
      return Response.json({ ok: true, platform: "Cloudflare Workers", aiConfigured: Boolean(env.OPENAI_API_KEY) });
    }
    if (url.pathname === "/api/chat" && request.method === "POST") {
      if (!env.OPENAI_API_KEY) return Response.json({ error: "دستیار هوشمند هنوز پیکربندی نشده است." }, { status: 503 });
      let input;
      try { input = await request.json(); } catch { return Response.json({ error: "درخواست نامعتبر است." }, { status: 400 }); }
      const message = typeof input?.message === "string" ? input.message.trim() : "";
      const language = ["fa", "en", "ru", "tr"].includes(input?.language) ? input.language : "fa";
      if (!message) return Response.json({ error: "Message is required" }, { status: 400 });
      if (message.length > 2000) return Response.json({ error: "Message too long" }, { status: 413 });
      const languageNames = { fa: "Persian", en: "English", ru: "Russian", tr: "Turkish" };
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "authorization": `Bearer ${env.OPENAI_API_KEY}`, "content-type": "application/json" },
          body: JSON.stringify({
            model: env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
              { role: "system", content: `You are the AI concierge for DJ V.N event and DJ services. Reply in ${languageNames[language]}. Explain DJ performance, sound and lighting, live music arrangements, weddings, birthdays and parties. For booking, ask for event date, city/location, event type, estimated guest count, and requested services. Never claim a booking is confirmed. Contact phones: 09217951943 and 09171531992. Location: Abadeh, Saadi Street, opposite Velayat Street. Instagram: djv.n1943. Do not invent prices or availability.` },
              { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });
        const data = await response.json();
        if (!response.ok) return Response.json({ error: "AI request failed. Check Worker logs and API account." }, { status: 502 });
        return Response.json({ reply: data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't form a reply." });
      } catch {
        return Response.json({ error: "AI service temporarily unavailable." }, { status: 502 });
      }
    }
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    if (url.pathname === "/" || url.pathname.endsWith(".html")) {
      headers.set("X-Robots-Tag", "index, follow");
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
};
