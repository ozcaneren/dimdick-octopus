import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user: any;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const initialState: AuthState = {
  user: getInitialUser(),
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Kullanıcı kaydı
export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Bir hata oluştu');
    }
  }
);

// Kullanıcı girişi
export const login = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post('/api/auth/login', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Bir hata oluştu');
    }
  }
);

// Kullanıcı güncelleme
export const updateUser = createAsyncThunk(
  'auth/update',
  async (userData: { name: string; avatar?: string }, thunkAPI: any) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put('/api/user/update', userData, config);
      
      if (response.data) {
        const updatedUser = { ...state.auth.user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Bir hata oluştu');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    logout: (state) => {
      state.user = null;
      state.isSuccess = false;
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Update
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer; 