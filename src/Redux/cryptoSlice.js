import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = "CG-CVSihdKbZ8xoL7sZbKMaGzoZ";
const BASE_URL = "https://api.coingecko.com/api/v3";
const API_HEADERS = { headers: { 'x-cg-demo-api-key': API_KEY } };

// --- Helpers de Persistencia del Almacenamiento Local ---
const updateLocalStorage = (portfolio) => {
  localStorage.setItem('portfolio', JSON.stringify(portfolio));
};

// --- 1. Acciones Asíncronas (Thunks) ---

export const fetchCryptos = createAsyncThunk(
  'crypto/fetchCryptos', 
  async (page, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/coins/markets`, {
        params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 50, page },
        ...API_HEADERS
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.status?.error_message || "Error al cargar criptomonedas");
    }
  }
);

export const fetchGlobalData = createAsyncThunk(
  'crypto/fetchGlobalData', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/global`, API_HEADERS);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.status?.error_message || "Error de red global");
    }
  }
);

export const searchCryptos = createAsyncThunk(
  'crypto/searchCryptos',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: { query },
        ...API_HEADERS
      });

      const coins = response.data.coins;
      if (!coins || coins.length === 0) return [];

      const limitedCoins = coins.slice(0, 12);
      const coinIds = limitedCoins.map(coin => coin.id).join(',');

      const priceResponse = await axios.get(`${BASE_URL}/simple/price`, {
        params: { ids: coinIds, vs_currencies: 'usd', include_24hr_change: 'true' },
        ...API_HEADERS
      });

      const pricesData = priceResponse.data || {};

      return limitedCoins.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.large, 
        current_price: pricesData[coin.id]?.usd ?? 0,
        price_change_percentage_24h: pricesData[coin.id]?.usd_24h_change ?? 0,
        high_24h: pricesData[coin.id]?.usd ?? 0, 
        low_24h: pricesData[coin.id]?.usd ?? 0,  
        market_cap: 0                            
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error en la búsqueda");
    }
  }
);

// --- 2. Definición del Segmento de Estado (Slice) ---

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: { 
    list: [], 
    portfolio: JSON.parse(localStorage.getItem('portfolio')) || [],
    globalData: null, 
    status: 'idle', 
    error: null 
  },
  reducers: {
    addToPortfolio: (state, action) => {
      const exists = state.portfolio.some(coin => coin.id === action.payload.id);
      if (!exists) {
        state.portfolio.push(action.payload);
        updateLocalStorage(state.portfolio);
      }
    },
    removeFromPortfolio: (state, action) => {
      state.portfolio = state.portfolio.filter((coin) => coin.id !== action.payload);
      updateLocalStorage(state.portfolio); 
    },
    clearPortfolio: (state) => {
      state.portfolio = []; 
      updateLocalStorage(state.portfolio); 
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos de Carga: Lista de Criptomonedas
      .addCase(fetchCryptos.pending, (state) => { 
        state.status = 'loading'; 
        state.error = null;
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message; 
      })

      // Casos de Carga: Búsqueda Semántica Dinámica
      .addCase(searchCryptos.pending, (state) => {
        state.status = 'loading'; 
        state.error = null;
      })
      .addCase(searchCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload; 
      })
      .addCase(searchCryptos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Casos de Carga: Datos Globales del Ecosistema
      .addCase(fetchGlobalData.fulfilled, (state, action) => {
        state.globalData = action.payload;
      })
      .addCase(fetchGlobalData.rejected, (state, action) => {
        console.error("Fallo técnico al recuperar métricas globales:", action.payload);
      });
  },
});

export const { addToPortfolio, removeFromPortfolio, clearPortfolio } = cryptoSlice.actions;
export default cryptoSlice.reducer;
