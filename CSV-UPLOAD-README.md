# Ingredient CSV Batch Upload

This feature allows you to upload multiple ingredients at once using a CSV file, making it easier to manage your ingredient inventory in bulk.

## Features

- **CSV Template Download**: Download a pre-formatted CSV template to ensure your data is structured correctly
- **Batch Upload**: Upload multiple ingredients at once
- **Validation**: Automatic validation of required fields and data formats
- **Error Reporting**: Detailed error reporting for any issues encountered during upload
- **Success Tracking**: Track which ingredients were successfully imported

## How to Use

### 1. Access the Batch Upload Feature

Navigate to the Ingredients page and click on the "Batch Upload Ingredients" accordion panel to expand it.

### 2. Download the CSV Template

Click the "Download CSV Template" button to get a pre-formatted CSV file with the correct column headers.

### 3. Fill in Your Ingredient Data

Open the downloaded CSV file in a spreadsheet application (like Microsoft Excel, Google Sheets, or LibreOffice Calc) and fill in your ingredient data. The template includes the following columns:

- **name** (required): The name of the ingredient
- **category**: The category the ingredient belongs to (e.g., Produce, Meat, Dairy)
- **unit** (required): The unit of measurement (e.g., kg, liter, piece)
- **costPerUnit** (required): The cost per unit of the ingredient
- **inStock**: The current quantity in stock
- **minStockLevel**: The minimum stock level before reordering
- **description**: A description of the ingredient
- **supplier**: The name of the supplier
- **notes**: Any additional notes

### 4. Save Your CSV File

Save your completed CSV file. Make sure to keep it in CSV format.

### 5. Upload Your CSV File

1. Click the "Select CSV File" button and choose your saved CSV file
2. Click the "Upload" button to start the import process
3. Wait for the upload to complete

### 6. Review Results

After the upload completes, you'll see a summary of the results:
- Total number of rows processed
- Number of ingredients successfully imported
- Any errors that occurred during import

## Troubleshooting

If you encounter errors during upload, check the following:

1. **File Format**: Ensure your file is saved as a CSV (Comma Separated Values) file
2. **Required Fields**: Make sure all required fields (name, unit, costPerUnit) are filled in
3. **Data Types**: Ensure numeric fields contain only numbers
4. **Special Characters**: Avoid using special characters in text fields

## For Developers

### Testing the CSV Upload Feature

You can test the CSV upload functionality using the provided test scripts:

#### Test Template Download

```
npm run test-csv-template
```

This script downloads the CSV template from the public test route and saves it as `downloaded-template.csv`.

#### Test CSV Upload (Requires Authentication)

```
npm run test-csv-upload
```

This script attempts to upload the template CSV file to test if the API endpoint is working correctly. Note that this requires a valid authentication token.

### API Endpoints

- `GET /api/ingredients/template`: Download the CSV template (requires authentication)
- `GET /api/ingredients/test-template`: Download the CSV template (public, for testing)
- `POST /api/ingredients/upload`: Upload a CSV file for batch processing (requires authentication)

The upload endpoint expects a multipart/form-data request with a file field named 'file' containing the CSV data. 