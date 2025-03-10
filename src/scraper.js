// scraper.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Scrapes the top five search result items from Craigslist Denver search results page.
 * @param {string} searchTerm - The term that is being searched for.
 * @returns {Promise<Array>} Array of item objects in the format: { title, price, location, href }
 */
async function scrapeTopFiveListings(searchTerm) {
    try {
        // Set constant variables for environment
        const baseUrl = 'https://denver.craigslist.org/search/sss?query=';
        const query = encodeURIComponent(searchTerm);
        const searchUrl = `${baseUrl}${query}`;

        console.log(`[SCRAPER] Using search URL: ${searchUrl}`);

        // Use a User-Agent header if needed to avoid potential blocking
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
                    'Chrome/112.0.0.0 Safari/537.36',
                'Origin': 'https://denver.craigslist.org',
                'Referer': 'https://denver.craigslist.org/',
            },
        });
        console.log(`[SCRAPER] Craigslist returned status: ${response.status}`);

        const html = response.data;
        fs.writeFileSync('search.html', html, 'utf8');
        console.log('[SCRAPER] Saved the full search HTML to "search.html" for debugging.');

        // Load HTML with Cheerio
        const $ = cheerio.load(html);

        // Select each 'li' with class 'cl-static-search-result'.
        const allResults = $('li.cl-static-search-result');
        console.log(`[SCRAPER] Found ${allResults.length} .cl-static-search-result elements total`);

        const listings = [];
        allResults.each((i, el) => {
            if (i < 5) {
                // The anchor containing title, price, location.
                const anchor = $(el).find('a');
                const href = anchor.attr('href') || '';

                // Element <div class="title">
                const title = anchor.find('div.title').text().trim();

                // Element <div class="price">
                const price = anchor.find('div.price').text().trim() || 'N/A';

                // Element <div class="location">
                const location = anchor.find('div.location').text().trim() || 'Unknown Location';

                listings.push({
                    title,
                    price,
                    location,
                    href,
                });
            }
        });

        console.log(
            `[SCRAPER] Returning ${listings.length} listings (top 5, if that many exist)`
        );
        return listings;
    } catch (error) {
        console.error('[SCRAPER] Error scraping Craigslist:', error);
        throw error;
    }
}

module.exports = {
    scrapeTopFiveListings,
};
