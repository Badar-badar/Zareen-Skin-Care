import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSpecialistId: null,
  filters: {
    searchQuery: '',
    specialty: 'All Specialties',
    location: 'All Locations',
    service: 'All Services',
    availability: 'all',
    sortBy: 'rating',
  },
  status: 'idle',
  error: null,
};

export const specialistSlice = createSlice({
  name: 'specialist',
  initialState,
  reducers: {
    setSelectedSpecialistId: (state, action) => {
      state.selectedSpecialistId = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setSelectedSpecialistId, setFilters, resetFilters } =
  specialistSlice.actions;

export const selectSpecialistFilters = (state) => state.specialist.filters;
export const selectSelectedSpecialistId = (state) =>
  state.specialist.selectedSpecialistId;

export default specialistSlice.reducer;
