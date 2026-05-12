import cryptoReducer, { 
  addToPortfolio, 
  removeFromPortfolio, 
  clearPortfolio,
  fetchCryptos 
} from '../Redux/cryptoSlice'; // Ajusta la ruta a tu archivo

describe('cryptoSlice reducer', () => {
  const initialState = { 
    list: [], 
    portfolio: [], 
    globalData: null, 
    status: 'idle', 
    error: null 
  };

  test('debe retornar el estado inicial', () => {
    expect(cryptoReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  // --- TESTS DE REDUCERS (Síncronos) ---
  
  test('debe añadir una moneda al portafolio si no existe', () => {
    const coin = { id: 'bitcoin', name: 'Bitcoin' };
    const state = cryptoReducer(initialState, addToPortfolio(coin));
    
    expect(state.portfolio.length).toBe(1);
    expect(state.portfolio[0].id).toBe('bitcoin');
  });

  test('no debe añadir una moneda duplicada al portafolio', () => {
    const coin = { id: 'bitcoin', name: 'Bitcoin' };
    const stateWithCoin = { ...initialState, portfolio: [coin] };
    
    const newState = cryptoReducer(stateWithCoin, addToPortfolio(coin));
    expect(newState.portfolio.length).toBe(1);
  });

  test('debe eliminar una moneda del portafolio', () => {
    const stateWithCoin = { 
      ...initialState, 
      portfolio: [{ id: 'bitcoin' }, { id: 'ethereum' }] 
    };
    
    const state = cryptoReducer(stateWithCoin, removeFromPortfolio('bitcoin'));
    expect(state.portfolio.length).toBe(1);
    expect(state.portfolio[0].id).toBe('ethereum');
  });

  test('debe limpiar todo el portafolio', () => {
    const stateWithCoins = { ...initialState, portfolio: [{ id: 'btc' }, { id: 'eth' }] };
    const state = cryptoReducer(stateWithCoins, clearPortfolio());
    expect(state.portfolio).toEqual([]);
  });

  // --- TESTS DE EXTRA REDUCERS (Asíncronos - Thunks) ---

  test('debe cambiar status a "loading" cuando fetchCryptos está pendiente', () => {
    const action = { type: fetchCryptos.pending.type };
    const state = cryptoReducer(initialState, action);
    expect(state.status).toBe('loading');
  });

  test('debe cambiar status a "succeeded" y llenar la lista cuando fetchCryptos se cumple', () => {
    const mockData = [{ id: 'bitcoin', price: 50000 }];
    const action = { type: fetchCryptos.fulfilled.type, payload: mockData };
    
    const state = cryptoReducer(initialState, action);
    
    expect(state.status).toBe('succeeded');
    expect(state.list).toEqual(mockData);
  });

  test('debe guardar los datos globales cuando fetchGlobalData se cumple', () => {
    const mockGlobal = { active_cryptocurrencies: 10000, total_market_cap: {} };
    // Usamos el string del tipo de acción directamente
    const action = { type: 'crypto/fetchGlobalData/fulfilled', payload: mockGlobal };
    
    const state = cryptoReducer(initialState, action);
    expect(state.globalData).toEqual(mockGlobal);
  });
});
