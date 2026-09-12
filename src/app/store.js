import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../features/ui/uiSlice';
import authReducer from '../features/auth/authSlice';
import specialistReducer from '../features/specialist/specialistSlice';
import appointmentReducer from '../features/appointment/appointmentSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    specialist: specialistReducer,
    appointment: appointmentReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
