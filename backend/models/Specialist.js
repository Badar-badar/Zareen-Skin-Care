const mongoose = require('mongoose');

/**
 * Specialist Schema
 * Professional clinical profile for verified doctors, skin specialists, and aesthetic practitioners.
 * Linked 1-to-1 with a User record (role: 'specialist').
 */
const specialistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for specialist profile'],
      unique: true,
      index: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      enum: {
        values: [
          'Dermatologist',
          'Skin Specialist',
          'Aesthetic Practitioner',
          'Cosmetic Dermatologist',
          'Trichologist',
          'Aesthetic Physician',
        ],
        message: '{VALUE} is not a supported specialty',
      },
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'Dr.',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    licenseNumber: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      default: 0,
    },
    qualifications: [
      {
        type: String,
        trim: true,
      },
    ],
    clinicName: {
      type: String,
      trim: true,
      default: '',
    },
    clinicAddress: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    cancellationPolicy: {
      type: String,
      trim: true,
      default: 'Free cancellation up to 24 hours prior to appointment.',
    },
    isVisible: {
      type: Boolean,
      default: true,
      index: true,
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be lower than 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 5.0,
    },
    reviewCount: {
      type: Number,
      min: [0, 'Review count cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Specialist = mongoose.model('Specialist', specialistSchema);

module.exports = Specialist;
