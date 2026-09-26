const mongoose = require('mongoose');

/**
 * Single day schedule configuration
 */
const dayScheduleSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0, // 0 = Sunday
      max: 6, // 6 = Saturday
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: String,
      default: null,
      trim: true,
    },
    endTime: {
      type: String,
      default: null,
      trim: true,
    },
    breakStartTime: {
      type: String,
      default: null,
      trim: true,
    },
    breakEndTime: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Availability Schema
 * Recurring weekly working schedule for a specialist doctor.
 * Exactly 1 configuration document per Specialist profile.
 */
const availabilitySchema = new mongoose.Schema(
  {
    specialist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialist',
      required: [true, 'Specialist reference is required'],
      unique: true,
      index: true,
    },
    weeklySchedule: {
      type: [dayScheduleSchema],
      default: () => [
        { dayOfWeek: 0, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
        { dayOfWeek: 1, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
        { dayOfWeek: 2, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
        { dayOfWeek: 3, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
        { dayOfWeek: 4, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
        { dayOfWeek: 5, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
        { dayOfWeek: 6, isEnabled: false, startTime: null, endTime: null, breakStartTime: null, breakEndTime: null },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
