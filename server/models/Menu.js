const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'seasonal'],
    default: 'active'
  },
  revenueOutlet: {
    type: String
  },
  sections: [
    {
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      recipes: [
        {
          recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'recipe'
          },
          sellingPrice: {
            type: Number
          },
          displayOrder: {
            type: Number
          }
        }
      ]
    }
  ],
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('menu', MenuSchema); 