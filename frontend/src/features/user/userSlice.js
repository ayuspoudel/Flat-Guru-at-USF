import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const themes = {
  winter: 'winter',
  dracula: 'dracula',
};

const getUserFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const getThemeFromLocalStorage = () => {
  const theme = localStorage.getItem('theme') || themes.winter;
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
};

const initialState = {
  user: getUserFromLocalStorage(),
  theme: getThemeFromLocalStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Registered successfully');
    },
    loginUser: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Logged in successfully');
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    },
    toggleTheme: (state) => {
      const { dracula, winter } = themes;
      state.theme = state.theme === dracula ? winter : dracula;
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('theme', state.theme);
    },
  },
});

export const { registerUser, loginUser, logoutUser, toggleTheme } = userSlice.actions;

export default userSlice.reducer