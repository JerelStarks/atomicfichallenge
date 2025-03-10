// favorites.js
const axios = require('axios');

/**
 * Adds a provided listing ID to the user's favorites by POSTing to Craigslist's "favorites/sync" endpoint.
 */
async function addItemToFavorites(listingId, userCookie) {
    try {
        const favoritesUrl = 'https://wapi.craigslist.org/web/v8/user/favorites/sync';

        // Builds the form data
        const formParams = new URLSearchParams();
        formParams.append('cc', 'US');
        formParams.append('lang', 'en');
        formParams.append('favesToAdd', listingId);

        // Convert to string for the request body
        const postBody = formParams.toString();
        // e.g., "cc=US&lang=en&favesToAdd=7833195601"

        console.log(`[FAVORITES] Posting to: ${favoritesUrl}`);
        console.log(`[FAVORITES] Cookie starts with: ${userCookie.substring(0, 30)}...`);
        console.log(`[FAVORITES] Post body: ${postBody}`);

        const response = await axios.post(favoritesUrl, postBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cookie': userCookie,
                'Origin': 'https://denver.craigslist.org',
                'Referer': 'https://denver.craigslist.org/',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                    'Chrome/112.0.0.0 Safari/537.36',
            },
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 500,
        });

        console.log(`[FAVORITES] Response status: ${response.status}`);
        console.log('[FAVORITES] Response data:', response.data);

        if (response.status >= 200 && response.status < 300) {
            console.log(`[FAVORITES] Successfully favorited listing ${listingId}`);
        } else {
            console.warn(
                `[FAVORITES] Possibly failed to favorite listing ${listingId}, status: ${response.status}`
            );
        }
    } catch (error) {
        console.error(`[FAVORITES] Error adding listing ${listingId} to favorites:`, error);
    }
}

module.exports = {
    addItemToFavorites,
};
