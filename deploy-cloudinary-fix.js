/**
 * Script to deploy the Cloudinary fix to Heroku
 */
const { execSync } = require('child_process');

try {
  console.log('Adding modified files to git...');
  execSync('git add server/config/cloudinary.js server/utils/cloudinaryUploader.js server/routes/import.js');
  
  console.log('Committing changes...');
  execSync('git commit -m "Fix OCR image upload for Heroku by using Cloudinary"');
  
  console.log('Pushing to Heroku with force option...');
  // Use --force to override the remote changes since we want our local changes to take precedence
  execSync('git push heroku main --force');
  
  console.log('\n✅ Deployment complete! The OCR feature should now work on Heroku.');
  console.log('You can test it by trying to upload an image for OCR processing.');
  
} catch (error) {
  console.error('Error during deployment:', error.message);
  if (error.stdout) console.log('Output:', error.stdout.toString());
  if (error.stderr) console.log('Error output:', error.stderr.toString());
  process.exit(1);
} 