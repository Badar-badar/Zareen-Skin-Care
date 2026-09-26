const mongoose = require('mongoose');

/**
 * Service Schema
 * Treatment and consultation offerings provided by specialists.
 * Belongs strictly to a single Specialist profile.
 */
const serviceSchema = new mongoose.Schema(
  {
    specialist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialist',
      required: [true, 'Specialist reference is required for a service'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      maxlength: [150, 'Service name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Service description cannot exceed 1000 characters'],
      default: '',
    },
    duration: {
      type: Number,
      required: [true, 'Service duration in minutes is required'],
      min: [5, 'Duration must be at least 5 minutes'],
      max: [480, 'Duration cannot exceed 480 minutes (8 hours)'],
    },
    price: {
      type: Number,
      required: [true, 'Service price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for efficient specialist service filtering by active status
serviceSchema.index({ specialist: 1, isActive: 1 });
serviceSchema.index({ specialist: 1, sortOrder: 1 });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
