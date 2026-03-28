import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const uploadResume = createAsyncThunk(
  'resume/upload',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await axios.post(
        `${API_URL}/resume/upload`,
        formData,
        {
          headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getResume = createAsyncThunk(
  'resume/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/resume`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateResume = createAsyncThunk(
  'resume/update',
  async (resumeData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/resume`,
        resumeData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const analyzeResume = createAsyncThunk(
  'resume/analyze',
  async ({ resumeContent, targetPosition }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/analyze-resume`,
        { resumeContent, targetPosition },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    data: null,
    analysis: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAnalysis: (state) => {
      state.analysis = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadResume.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getResume.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(analyzeResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.loading = false;
        state.analysis = action.payload.analysis;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalysis } = resumeSlice.actions;
export default resumeSlice.reducer;
