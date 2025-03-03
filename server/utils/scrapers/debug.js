const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function saveAllrecipesHtml() {
  try {
    console.log('Fetching Allrecipes search page...');
    
    const url = 'https://www.allrecipes.com/search?q=chicken%20pasta';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.allrecipes.com/',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      }
    });
    
    console.log('Response received, saving HTML...');
    
    // Save the HTML to a file
    const outputPath = path.join(__dirname, 'allrecipes_response.html');
    fs.writeFileSync(outputPath, response.data);
    
    console.log(`HTML saved to: ${outputPath}`);
    
    // Also save a simplified version with just the body content
    const bodyMatch = response.data.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      const bodyContent = bodyMatch[1];
      const bodyOutputPath = path.join(__dirname, 'allrecipes_body.html');
      fs.writeFileSync(bodyOutputPath, bodyContent);
      console.log(`Body content saved to: ${bodyOutputPath}`);
    }
    
    // Check for common recipe card selectors
    const selectors = [
      'div.card--searchResult',
      'div.component.card',
      'div[data-tracking-content-type="Recipe"]',
      'a.card__titleLink',
      'div.recipe-card',
      'div.mntl-card',
      'div.card'
    ];
    
    console.log('Checking for common selectors in the HTML:');
    selectors.forEach(selector => {
      const regex = new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = (response.data.match(regex) || []).length;
      console.log(`  ${selector}: ${matches} matches`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

saveAllrecipesHtml(); 