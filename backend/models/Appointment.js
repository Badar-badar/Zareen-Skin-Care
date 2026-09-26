const mongoose = require('mongoose');

/**
 * Appointment Schema
 * Represents a consultation booking between a Patient and a Specialist for a specific Service.
 */
const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    specialist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialist',
      required: [true, 'Specialist reference is required'],
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service reference is required'],
    },
    date: {
      type: Date,
      required: [true, 'Appointment calendar date is required'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time in HH:mm is required'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'End time in HH:mm is required'],
      trim: true,
    },
    patientName: {
      type: String,
      required: [true, 'Patient full name is required'],
      trim: true,
    },
    patientEmail: {
      type: String,
      required: [true, 'Patient contact email is required'],
      trim: true,
      lowercase: true,
    },
    patientPhone: {
      type: String,
      required: [true, 'Patient contact phone is required'],
      trim: true,
    },
    patientNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
        message: '{VALUE} is not a valid appointment status',
      },
      default: 'confirmed',
      index: true,
    },
    referenceNumber: {
      type: String,
      required: [true, 'Unique reference number is required'],
      unique: true,
      index: true,
      trim: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Cancellation reason cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for conflict resolution and dashboard queries
appointmentSchema.index({ specialist: 1, date: 1, status: 1 });
appointmentSchema.index({ patient: 1, date: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
