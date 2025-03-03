const { searchAllrecipes, getRecipeDetails } = require('./scrapers/allrecipes');

/**
 * Scrape recipes from a specific source
 * @param {string} query - The search query
 * @param {string} sourceId - The source ID (optional)
 * @param {string} sourceName - The source name (optional)
 * @returns {Promise<Array>} - Array of recipe objects
 */
const scrapeRecipes = async (query, sourceId = null, sourceName = null) => {
  console.log(`Scraping recipes for query: ${query}, source: ${sourceName || 'any'}`);
  
  // If no specific source is provided or the source is Allrecipes, use Allrecipes scraper
  if (!sourceName || sourceName.toLowerCase().includes('allrecipes')) {
    return await searchAllrecipes(query);
  }
  
  // Add more sources here as they are implemented
  // Example:
  // if (sourceName.toLowerCase().includes('foodnetwork')) {
  //   return await searchFoodNetwork(query);
  // }
  
  // Default: return empty array if no matching scraper
  console.log(`No scraper available for source: ${sourceName}`);
  return [];
};

/**
 * Get detailed recipe information
 * @param {Object} recipe - Basic recipe object with sourceUrl
 * @returns {Promise<Object>} - Detailed recipe object
 */
const getRecipeDetailsFromUrl = async (recipe) => {
  if (!recipe || !recipe.sourceUrl) {
    return recipe;
  }
  
  const url = recipe.sourceUrl;
  
  // Determine which scraper to use based on the URL
  if (url.includes('allrecipes.com')) {
    const details = await getRecipeDetails(url);
    return { ...recipe, ...details };
  }
  
  // Add more sources here as they are implemented
  
  // Default: return original recipe if no matching scraper
  return recipe;
};

module.exports = {
  scrapeRecipes,
  getRecipeDetailsFromUrl
}; 