// Asset guard
// =============================================================================
// Stops people browsing straight to /style.css or /script.js while still letting
// the pages load them normally.
//
// A plain `[[redirects]]` rule cannot do this: without force = true Netlify
// serves the existing file and the rule never fires, and with force = true the
// site's own <link> and <script> tags break too.
//
// The browser tells us the difference. Sec-Fetch-Dest is "document" when someone
// navigates to the URL, and "style" / "script" when the page pulls it in as a
// subresource. We only bounce navigations.
// =============================================================================

export default async function (request, context) {
    const dest = request.headers.get('sec-fetch-dest');
    const mode = request.headers.get('sec-fetch-mode');

    // Subresource load from one of our own pages: serve the file untouched.
    if (dest && dest !== 'document') {
        return context.next();
    }

    // Older browsers omit Sec-Fetch-*. Fall back to Accept, which is
    // text/html for navigations and */* for subresource fetches.
    if (!dest) {
        const accept = request.headers.get('accept') || '';
        if (!accept.includes('text/html')) {
            return context.next();
        }
    }

    if (mode === 'navigate' || !mode) {
        return Response.redirect(new URL('/', request.url), 302);
    }

    return context.next();
}

export const config = {
    path: [
        '/style.css',
        '/script.js',
        '/about.js',
        '/services.js',
        '/threejs-build.js',
        '/orbital-scene.js',
        '/sitemap.xsl'
    ]
};
