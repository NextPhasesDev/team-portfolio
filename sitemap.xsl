<?xml version="1.0" encoding="UTF-8"?>
<!--
  Renders sitemap.xml as a readable page when opened in a browser.
  Crawlers ignore this entirely and read the raw XML, so it costs nothing in SEO.
-->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="robots" content="noindex, follow"/>
        <title>Sitemap | NextPhases</title>
        <link rel="icon" href="/favicon.ico" sizes="any"/>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&amp;family=Space+Grotesk:wght@400;500;600;700&amp;family=Space+Mono:wght@400;700&amp;display=swap" rel="stylesheet"/>
        <style>
          :root {
            --navy: #0D1B2A; --teal: #14B8A6; --gold: #F4C542;
            --white: #F0F4F8; --deep: #060D14;
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Open Sans', system-ui, sans-serif;
            background:
              radial-gradient(ellipse 120% 90% at 50% 0%, #0f1f35 0%, #0a1626 45%, #050d18 100%);
            background-attachment: fixed;
            color: var(--white);
            line-height: 1.6;
            min-height: 100vh;
            padding: clamp(1.5rem, 5vw, 4rem);
          }
          .wrap { max-width: 1000px; margin: 0 auto; }
          .eyebrow {
            font-family: 'Space Mono', monospace;
            font-size: 0.7rem; letter-spacing: 0.28em; text-transform: uppercase;
            color: var(--teal); margin-bottom: 0.75rem; display: block;
          }
          h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: clamp(1.9rem, 6vw, 3rem); font-weight: 700;
            letter-spacing: -0.03em; margin-bottom: 0.6rem;
          }
          .lede { color: rgba(240,244,248,0.62); max-width: 60ch; margin-bottom: 2rem; }
          .count {
            display: inline-block;
            font-family: 'Space Mono', monospace; font-size: 0.72rem;
            padding: 0.3rem 0.7rem; border-radius: 999px;
            background: rgba(20,184,166,0.12); border: 1px solid rgba(20,184,166,0.3);
            color: var(--teal); margin-bottom: 2rem;
          }
          .card {
            background: rgba(15,31,53,0.55);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px; overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset;
          }
          table { width: 100%; border-collapse: collapse; }
          th {
            font-family: 'Space Mono', monospace;
            font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase;
            color: var(--teal); text-align: left; padding: 0.9rem 1.1rem;
            border-bottom: 1px solid rgba(20,184,166,0.2);
            background: rgba(19,38,63,0.6);
          }
          td { padding: 0.85rem 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.9rem; }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: rgba(20,184,166,0.05); }
          a { color: var(--white); text-decoration: none; font-weight: 600; }
          a:hover { color: var(--teal); text-decoration: underline; text-underline-offset: 3px; }
          .meta { font-family: 'Space Mono', monospace; font-size: 0.74rem; color: rgba(240,244,248,0.5); }
          .prio {
            font-family: 'Space Mono', monospace; font-size: 0.72rem;
            padding: 0.15rem 0.5rem; border-radius: 5px;
            background: rgba(244,197,66,0.1); border: 1px solid rgba(244,197,66,0.25);
            color: var(--gold);
          }
          footer { margin-top: 2rem; font-size: 0.82rem; color: rgba(240,244,248,0.45); }
          footer a { font-weight: 400; color: rgba(240,244,248,0.6); }
          @media (max-width: 640px) {
            th:nth-child(2), td:nth-child(2) { display: none; }
            td, th { padding: 0.7rem 0.75rem; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <span class="eyebrow">NextPhases</span>
          <h1>Sitemap</h1>
          <p class="lede">Every page on nextphases.dev, as submitted to search engines. This view is styled for people; crawlers read the underlying XML.</p>
          <span class="count">
            <xsl:value-of select="count(s:urlset/s:url)"/> URLs
          </span>

          <div class="card">
            <table>
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Updated</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <xsl:sort select="s:priority" order="descending"/>
                  <tr>
                    <td>
                      <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                    </td>
                    <td class="meta">
                      <xsl:choose>
                        <xsl:when test="s:changefreq"><xsl:value-of select="s:changefreq"/></xsl:when>
                        <xsl:otherwise>&#8211;</xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td>
                      <span class="prio"><xsl:value-of select="s:priority"/></span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            <p>NextPhases, Lusaka, Zambia. <a href="https://nextphases.dev">Back to the site</a></p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
