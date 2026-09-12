import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookingDraft: {
    specialistId: null,
    serviceId: null,
    dateStr: null,
    timeSlot: null,
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    intakeNotes: '',
  },
  status: 'idle',
  error: null,
};

export const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setBookingDraft: (state, action) => {
      state.bookingDraft = { ...state.bookingDraft, ...action.payload };
    },
    clearBookingDraft: (state) => {
      state.bookingDraft = initialState.bookingDraft;
      state.error = null;
    },
  },
});

export const { setBookingDraft, clearBookingDraft } = appointmentSlice.actions;

export const selectBookingDraft = (state) => state.appointment.bookingDraft;

export default appointmentSlice.reducer;
