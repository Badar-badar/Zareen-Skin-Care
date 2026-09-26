const mongoose = require('mongoose');

/**
 * BlockedDate Schema
 * Full-day unavailable dates for a specialist (holidays, leave, clinical conferences).
 */
const blockedDateSchema = new mongoose.Schema(
  {
    specialist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialist',
      required: [true, 'Specialist reference is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Blocked date is required'],
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [200, 'Reason cannot exceed 200 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound unique index prevents duplicate blocked records for the same calendar date
blockedDateSchema.index({ specialist: 1, date: 1 }, { unique: true });

const BlockedDate = mongoose.model('BlockedDate', blockedDateSchema);

module.exports = BlockedDate;
