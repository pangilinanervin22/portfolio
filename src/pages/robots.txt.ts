import type { APIRoute } from "astro";

export const GET: APIRoute = (context) => {
  const siteUrl = context.site?.toString().replace(/\/$/, "") ?? "";

  const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap-index.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
