# Fixing OCR Image Upload on Heroku

The issue with OCR image upload on Heroku is that Heroku has an ephemeral filesystem, which means files uploaded to the server are temporary and can disappear when the application is restarted or redeployed.

## The Solution

We've created the following files to fix this issue:

1. `server/config/cloudinary.js` - Configuration for Cloudinary
2. `server/utils/cloudinaryUploader.js` - Utility functions for uploading to Cloudinary
3. Updated `server/routes/import.js` - Modified OCR route to use Cloudinary for image storage

## Deploying the Fix

Follow these steps to deploy the fix:

1. Make sure your Cloudinary credentials are set in Heroku:

```bash
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
```

2. Add the modified files to git:

```bash
git add server/config/cloudinary.js server/utils/cloudinaryUploader.js server/routes/import.js
```

3. Commit the changes:

```bash
git commit -m "Fix OCR image upload for Heroku by using Cloudinary"
```

4. Push to Heroku with force option:

```bash
git push heroku main --force
```

## Testing the Fix

After deploying, test the OCR functionality by uploading an image in the Recipe Import section. The image should be processed successfully and the extracted text should be displayed.

## How the Fix Works

Instead of storing uploaded images on Heroku's ephemeral filesystem, we now:

1. Upload the image directly to Cloudinary
2. Use the Cloudinary URL for Tesseract OCR processing
3. Remove the local file after processing

This ensures that even if the Heroku dyno restarts, the image will still be accessible from Cloudinary for processing. 