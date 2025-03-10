// runner.js
/**
 * Create an .env file, it should be formated as such:
 * SEARCH_TERM="Tesla Model 3"
 * COOKIE="cl_def_hp=denver; cl...""
 */
require('dotenv').config();
const { scrapeTopFiveListings } = require('./scraper');
const { addItemToFavorites } = require('./favorites');

async function run() {
    try {
        // Pulling in environmental constants.
        const envSearchTerm = process.env.SEARCH_TERM || 'bike';
        const envCookie = process.env.COOKIE || '';

        // CLI overrides the .env if provided, e.g., node runner.js "desk chair" "cl_session=xyz789; cl_b=...".
        const argSearchTerm = process.argv[2] || envSearchTerm;
        const argCookie = process.argv[3] || envCookie;

        console.log(`[RUNNER] Search term: "${argSearchTerm}"`);
        console.log(`[RUNNER] Using cookie: ${argCookie.substring(0, 30)}... (truncated)`);

        // 1. Scrapes top 5 of search results page.
        const listings = await scrapeTopFiveListings(argSearchTerm);

        console.log('[RUNNER] Top 5 listings found:');
        console.log(listings);

        // 2. Parses listing ID from each href, then favorites each item.
        for (let i = 0; i < listings.length; i++) {
            const { title, href, location, price } = listings[i];
            console.log(`\n[RUNNER] Processing listing #${i + 1}:`);
            console.log(`  Title: ${title}`);
            console.log(`  Href:  ${href}`);
            console.log(`  Price: ${price}`);
            console.log(`  Loc:   ${location}`);

            // Attempts to find numeric ID in the href.
            const match = href.match(/\/(\d+)\.html/);
            if (match) {
                const listingId = match[1];
                console.log(`[RUNNER] Extracted listing ID: ${listingId}`);

                // 3. Add to favorites
                await addItemToFavorites(listingId, argCookie);
            } else {
                console.warn(`[RUNNER] Could not parse listing ID from href: ${href}`);
            }
        }

        console.log('[RUNNER] Finished adding listings to favorites.');
    } catch (error) {
        console.error('[RUNNER] Error in run:', error);
    }
}

// "If" for running directly
if (require.main === module) {
    run();
}
