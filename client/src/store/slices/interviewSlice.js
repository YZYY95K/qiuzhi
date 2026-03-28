import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const generateQuestions = createAsyncThunk(
  'interview/generateQuestions',
  async ({ positionId, targetCompany }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/generate-questions`,
        { positionId, targetCompany },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const evaluateAnswer = createAsyncThunk(
  'interview/evaluateAnswer',
  async ({ sessionId, questionIndex, answer }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/evaluate-answer`,
        { sessionId, questionIndex, answer },
        getAuthHeader()
      );
      return { questionIndex, evaluation: response.data.evaluation };
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const completeInterview = createAsyncThunk(
  'interview/complete',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/ai/complete-interview`,
        { sessionId },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    currentSession: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    evaluations: {},
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    resetInterview: (state) => {
      state.currentSession = null;
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.evaluations = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload.sessionId;
        state.questions = action.payload.questions;
        state.currentQuestionIndex = 0;
        state.answers = {};
        state.evaluations = {};
      })
      .addCase(generateQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(evaluateAnswer.fulfilled, (state, action) => {
        const { questionIndex, evaluation } = action.payload;
        state.evaluations[questionIndex] = evaluation;
      })
      .addCase(completeInterview.fulfilled, (state, action) => {
        state.evaluation = action.payload;
      });
  },
});

export const { setCurrentQuestion, resetInterview } = interviewSlice.actions;
export default interviewSlice.reducer;
