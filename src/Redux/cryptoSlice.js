import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = "CG-CVSihdKbZ8xoL7sZbKMaGzoZ";

// 1. Acción para las criptos individuales
export const fetchCryptos = createAsyncThunk('crypto/fetchCryptos', async (page = 1, { rejectWithValue }) => {
  try{
     const response = await axios.get(
    'https://api.coingecko.com/api/v3/coins/markets', 
    {
      params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 50, page: page },
      headers: { 'x-cg-demo-api-key': API_KEY }
    }
  );
  return response.data;
  } catch (error) {
     
      return rejectWithValue(error.response?.data?.status?.error_message || "Error al cargar criptos");
    }
 
});

// 2. NUEVA ACCIÓN: Para los datos globales del mercado
export const fetchGlobalData = createAsyncThunk('crypto/fetchGlobalData', async () => {
  const response = await axios.get(
    'https://api.coingecko.com/api/v3/global',
    { headers: { 'x-cg-demo-api-key': API_KEY } }
  );
  return response.data.data; 
});



const cryptoSlice = createSlice({
  name: 'crypto',
  
  initialState: { 
    list: [], 
    portfolio: [], 
    globalData: null, 
    status: 'idle', 
    error: null 
  },
  reducers: {
    addToPortfolio: (state, action) => {
      const exists = state.portfolio.find(coin => coin.id === action.payload.id);
      if (!exists) state.portfolio.push(action.payload);
    },
    removeFromPortfolio: (state, action) => {
      state.portfolio = state.portfolio.filter((coin) => coin.id !== action.payload);
    },
    clearPortfolio: (state) => {
        state.portfolio = []; 
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para fetchCryptos
      .addCase(fetchCryptos.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // 4. NUEVO CASO: Para almacenar los datos globales cuando la carga sea exitosa
      .addCase(fetchGlobalData.fulfilled, (state, action) => {
        state.globalData = action.payload;
      });
  },
});

export const { addToPortfolio, removeFromPortfolio, clearPortfolio } = cryptoSlice.actions;
export default cryptoSlice.reducer;
