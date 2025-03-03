# Recipify

A chef's recipe and ingredient management platform designed to streamline the creation, management, and costing of recipes while maintaining a detailed database of ingredients and suppliers.

## Features

- **Ingredient Management**: Create and manage ingredients with detailed information including costs, nutritional data, and allergen information
- **Supplier Management**: Track suppliers and their associated ingredients
- **Recipe Management**: Create, edit, and organize recipes with detailed costing
- **Web Recipe Import**: Search and import recipes from the web
- **AI-Based Ingredient Matching**: Automatically match imported ingredients with your database
- **Costing and Profitability Analysis**: Calculate costs, suggested selling prices, and profit margins

## Tech Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **AI/ML**: Python for ingredient matching

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Python 3.8+ (for AI features)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/recipify.git
   cd recipify
   ```

2. Install dependencies
   ```
   npm run install-all
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   NODE_ENV=development
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
recipify/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       ├── context/        # React context
│       ├── utils/          # Utility functions
│       └── App.js          # Main App component
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   └── index.js            # Entry point
├── python/                 # Python scripts for AI features
├── .env                    # Environment variables
└── package.json            # Project metadata
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 