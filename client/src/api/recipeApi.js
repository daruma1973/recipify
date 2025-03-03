import axios from 'axios';

/**
 * Downloads a CSV template for recipe batch import
 */
export const downloadCsvTemplate = async () => {
  try {
    // Make a request to download the CSV template
    const response = await axios.get('/api/recipes/template', {
      responseType: 'blob',
    });

    // Create a URL for the blob and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'recipe-template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (error) {
    console.error('Error downloading template:', error);
    
    // Try fallback to a public endpoint if authenticated one fails
    try {
      window.open('/api/recipes/public-template', '_blank');
      return { success: true, fallback: true };
    } catch (fallbackError) {
      console.error('Fallback download failed:', fallbackError);
      return { 
        success: false, 
        message: 'Failed to download template. Please try again later.' 
      };
    }
  }
};

/**
 * Uploads and processes a batch of recipes from CSV
 * 
 * @param {File} file - The CSV file to upload
 * @param {Function} progressCallback - Optional callback for upload progress
 * @returns {Object} The upload result
 */
export const uploadBatchRecipes = async (file, progressCallback = () => {}) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);

    // Upload the file with progress tracking
    const response = await axios.post('/api/recipes/batch-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        progressCallback(percentCompleted);
      },
    });

    return {
      success: true,
      recipes: response.data.recipes || [],
      message: response.data.message || 'Recipes imported successfully'
    };
  } catch (error) {
    console.error('Error uploading recipes:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error uploading recipes'
    };
  }
};

/**
 * Search for recipes from external sources
 * 
 * @param {string} query - The search query
 * @param {string} source - Optional source ID to filter by
 * @returns {Array} Array of recipe results
 */
export const searchExternalRecipes = async (query, source = '') => {
  try {
    const response = await axios.get(`/api/recipes/search`, {
      params: { q: query, source: source }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

/**
 * Get detailed recipe information from an external source
 * 
 * @param {string} url - The recipe URL
 * @returns {Object} Recipe details
 */
export const getExternalRecipeDetails = async (url) => {
  try {
    const response = await axios.get('/api/recipes/details', {
      params: { url }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
}; 