# PowerShell script to deploy Cloudinary fix to Heroku

Write-Output "Adding modified files to git..."
git add server/config/cloudinary.js server/utils/cloudinaryUploader.js server/routes/import.js

Write-Output "Committing changes..."
git commit -m "Fix OCR image upload for Heroku by using Cloudinary"

Write-Output "Pushing to Heroku with force option..."
git push heroku main --force

Write-Output "`n✅ Deployment complete! The OCR feature should now work on Heroku."
Write-Output "You can test it by trying to upload an image for OCR processing." 