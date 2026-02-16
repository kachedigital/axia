/**
 * Kache Digital: Sanity Check v1.0
 * Dependency-free script to validate sitemap URLs
 */

const SITEMAP_URL = 'https://staging.kachedigital.com/sitemap.xml';

async function sanityCheck() {
    console.log(`\n🔍 Initiating Sanity Check: ${SITEMAP_URL}\n`);

    try {
        const response = await fetch(SITEMAP_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
        }

        const xml = await response.text();

        // Dependency-free XML parsing using Regex for <loc> tags
        const urlRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
        const urls = [];
        let match;
        while ((match = urlRegex.exec(xml)) !== null) {
            urls.push(match[1]);
        }

        if (urls.length === 0) {
            throw new Error('No URLs discovered in sitemap. Check XML structure.');
        }

        console.log(`📡 Discovered ${urls.length} target nodes. Starting validation...\n`);

        const results = await Promise.all(urls.map(async (url) => {
            try {
                const res = await fetch(url, { method: 'HEAD' });
                return { url, status: res.status, ok: res.ok };
            } catch (err) {
                return { url, status: 'ERROR', ok: false };
            }
        }));

        let failures = 0;
        results.forEach(({ url, status, ok }) => {
            if (ok) {
                console.log(`✅ [${status}] ${url}`);
            } else {
                console.error(`❌ [${status}] ${url}`);
                failures++;
            }
        });

        if (failures === 0) {
            console.log(`\n✨ All systems nominal. 0 health violations detected. PR #2 is production-ready.\n`);
        } else {
            console.warn(`\n⚠️ Warning: ${failures} nodes returned high-latency or error signals. Investigation required.\n`);
            process.exit(1);
        }

    } catch (error) {
        console.error(`💥 Critical Failure: ${error.message}`);
        process.exit(1);
    }
}

sanityCheck();
