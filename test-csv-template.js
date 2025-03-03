/**
 * Test CSV Template Download
 * 
 * This script tests the CSV template download functionality by making a direct API call
 * to download the ingredient template CSV file from the public test route.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function testCSVTemplateDownload() {
  console.log('Testing CSV template download functionality...');
  
  try {
    console.log('Downloading template from public test route...');
    
    // Make API request
    const response = await axios.get('http://localhost:5000/api/ingredients/test-template', {
      responseType: 'stream'
    });
    
    // Create a write stream to save the file
    const outputPath = path.join(__dirname, 'downloaded-template.csv');
    const writer = fs.createWriteStream(outputPath);
    
    // Pipe the response data to the file
    response.data.pipe(writer);
    
    // Return a promise that resolves when the file is written
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    console.log('Template downloaded successfully to:', outputPath);
    
    // Read and display the first few lines of the downloaded file
    const fileContent = fs.readFileSync(outputPath, 'utf8');
    const lines = fileContent.split('\n').slice(0, 3);
    
    console.log('\nTemplate content preview:');
    lines.forEach(line => console.log(line));
    
    console.log('\nTest completed successfully!');
  } catch (err) {
    console.error('Error testing CSV template download:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

// Run the test
testCSVTemplateDownload(); 