import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = "CG-CVSihdKbZ8xoL7sZbKMaGzoZ";

// 1. Acción para las criptos individuales
export const fetchCryptos = createAsyncThunk('crypto/fetchCryptos', async (page, { rejectWithValue }) => {
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



export const searchCryptos = createAsyncThunk(
  'crypto/searchCryptos',
  async (query, { rejectWithValue }) => {
    try {
      // 1. CORREGIDO: Se elimina el espacio al final de 'search' para evitar el 404
      const response = await axios.get('https://api.coingecko.com/api/v3/search', {
        params: { query: query },
        headers: { 'x-cg-demo-api-key': API_KEY }
      });

      const coins = response.data.coins;

      // Si la búsqueda no arroja resultados, retornamos un array vacío de inmediato
      if (!coins || coins.length === 0) return [];

      // Limitamos a los primeros 12 resultados para optimizar la velocidad y no saturar la API
      const limitedCoins = coins.slice(0, 12);
      const coinIds = limitedCoins.map(coin => coin.id).join(',');

      // 2. PETICIÓN SECUNDARIA: Obtenemos los precios reales y variaciones de 24h para esos IDs
      const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: coinIds,
          vs_currencies: 'usd',
          include_24hr_change: 'true'
        },
        headers: { 'x-cg-demo-api-key': API_KEY }
      });

      const pricesData = priceResponse.data || {};

      // 3. UNIFICACIÓN: Cruzamos los datos básicos de la búsqueda con sus precios reales de mercado
     return limitedCoins.map(coin => ({
  id: coin.id,
  name: coin.name,
  symbol: coin.symbol,
  image: coin.large, 
  current_price: pricesData[coin.id]?.usd ?? 0,
  price_change_percentage_24h: pricesData[coin.id]?.usd_24h_change ?? 0,
  
  // INYECCIÓN: Agrega estas 3 líneas para blindar el componente Details de pantallas en blanco
  high_24h: pricesData[coin.id]?.usd ?? 0, 
  low_24h: pricesData[coin.id]?.usd ?? 0,  
  market_cap: 0                            
}));

    } catch (error) {
      return rejectWithValue(error.response?.data || "Error en la búsqueda");
    }
  }
);






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
      const exists = state.portfolio.find(coin => coin.id === action.payload.id);
       if (!exists) {
        state.portfolio.push(action.payload);
        // Guarda la lista actualizada de inmediato en el disco del navegador
        localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); 
      }
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
      })

      .addCase(searchCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload; // Reemplaza la lista actual por los resultados globales
      });




      
  },
});

export const { addToPortfolio, removeFromPortfolio, clearPortfolio } = cryptoSlice.actions;
export default cryptoSlice.reducer;
