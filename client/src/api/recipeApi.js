import axios from 'axios';

/**
 * Helper function to handle API errors consistently
 */
const handleApiError = (error, customMessage = 'An error occurred') => {
  // Check if it's a connection error
  if (error.code === 'ERR_NETWORK' || 
      (error.response?.data && error.response.data.includes('ECONNREFUSED'))) {
    console.error('Server connection error:', error);
    return {
      success: false,
      message: 'Could not connect to the server. Please make sure the backend is running.',
      serverDown: true
    };
  }
  
  console.error(customMessage, error);
  
  return {
    success: false,
    message: error.response?.data?.message || error.message || customMessage
  };
};

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

    // Upload the file
    const response = await axios.post('/api/recipes/batch', formData, {
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
    };
  } catch (error) {
    return handleApiError(error, 'Error uploading recipes');
  }
};

/**
 * Process a recipe image using OCR
 * @param {File} imageFile - The image file to process
 * @param {Function} progressCallback - Callback for upload progress
 * @returns {Promise<Object>} The processed recipe data
 */
export const processRecipeImage = async (imageFile, progressCallback) => {
  console.log('Processing recipe image:', imageFile.name);
  
  // Create FormData
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    // Log upload start
    console.log('Uploading image for OCR processing');
    
    // Try connecting to server and uploading image
    const response = await axios.post('/api/import/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressCallback,
      // Increase timeout for OCR processing - Tesseract can take a while
      timeout: 120000, // 120 seconds (2 minutes)
    });
    
    console.log('OCR processing completed successfully');
    return response.data;
    
  } catch (error) {
    console.error('Error during OCR processing:', error);
    
    // Handle different error scenarios
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error('Server error:', error.response.status, error.response.data);
      return {
        success: false,
        error: error.response.data.error || 'Server error',
        message: error.response.data.message || 'Error processing image. The server returned an error. Please try again with a clearer image.',
        status: error.response.status
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server:', error.request);
      return {
        success: false,
        error: 'connectivity',
        message: 'Could not connect to the server or the request timed out. OCR processing can take time for complex images. Please try again with a simpler, clearer image.',
        serverDown: true
      };
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      return {
        success: false,
        error: 'client',
        message: 'An error occurred while processing your request. Please try again: ' + error.message
      };
    }
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