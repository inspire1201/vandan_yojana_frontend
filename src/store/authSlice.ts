import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

interface User {
  id: number;
  code: string;
  name: string;
  role: string;
  selectedReport?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedReport: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  selectedReport: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User; selectedReport?: string }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.selectedReport = action.payload.selectedReport || null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      if (action.payload.selectedReport) {
        localStorage.setItem('selectedReport', action.payload.selectedReport);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.selectedReport = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedReport');
    },
    loadFromStorage: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const selectedReport = localStorage.getItem('selectedReport');
      
      if (token && user) {
        // Check if token is expired
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp < currentTime) {
            // Token expired
            toast.error('Your session has expired. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('selectedReport');
            state.isLoading = false;
            return;
          }
          
          state.token = token;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
          state.selectedReport = selectedReport;
        } catch (error) {
          // Invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('selectedReport');
        }
      }
      state.isLoading = false;
    },
    setTempSelectedReport: (state, action: PayloadAction<string>) => {
      state.selectedReport = action.payload;
    },
  },
});

export const { loginSuccess, logout, loadFromStorage, setTempSelectedReport } = authSlice.actions;
export default authSlice.reducer;