import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import Details from '../pages/Details/details';

import { thunk } from 'redux-thunk'; 


// 1. Declaramos la función que vamos a vigilar
const mockNavigate = jest.fn();

// 2. Mockeamos la librería completa
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // Cuando el componente use el hook, recibirá nuestro espía
}));

// Mock de Axios
jest.mock('axios');

// Mock de Recharts (para evitar errores con ResponsiveContainer y el DOM de JSDOM)
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

const mockStore = configureStore([]);

describe('Details Component', () => {
  let store;
  const mockCoin = {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    image: 'bitcoin.png',
    current_price: 50000,
    price_change_percentage_24h: 5.5,
    high_24h: 51000,
    low_24h: 49000,
    market_cap: 1000000000,
  };

  beforeEach(() => {
    store = mockStore({
      crypto: {
        list: [mockCoin],
      },
    });

    // Mock de la respuesta de la API
    axios.get.mockResolvedValue({
      data: {
        prices: [
          [1625097600000, 48000],
          [1625184000000, 49000],
        ],
      },
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/details/bitcoin']}>
          <Routes>
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test('debe mostrar la información de la moneda correctamente', async () => {
  renderComponent();

  await waitFor(() => {
    expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument();
    
    // Cambiamos getByText por getAllByText para el precio
    const priceElements = screen.getAllByText(/\$50,000 USD/i);
    expect(priceElements.length).toBeGreaterThan(0); 

    expect(screen.getByText(/5.50%/i)).toBeInTheDocument();
  }); 
}); // <--- Asegúrate de cerrar aquí el test antes de empezar el siguiente


  test('debe llamar a la API de CoinGecko al cargar', async () => {
    renderComponent();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/coins/bitcoin/market_chart'),
        expect.any(Object)
      );
    });
  });


  test('debe calcular y mostrar la expectativa alcista cuando el cambio es positivo', () => {
    renderComponent();
    
    expect(screen.getByText(/▲ EXPECTATIVA ALCISTA/i)).toBeInTheDocument();
    // Verifica que el color del texto sea verde (o el hex que definiste)
    expect(screen.getByText(/▲ EXPECTATIVA ALCISTA/i)).toHaveStyle('color: #00ff88');
  });

  test('debe mostrar mensaje de error si la moneda no existe en el store', () => {
    store = mockStore({ crypto: { list: [] } }); // Store vacío
    
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/details/unknown']}>
          <Routes>
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Moneda no encontrada/i)).toBeInTheDocument();
  });

  test('el botón volver debe llamar a la función navigate', () => {
    // Para probar el navigate(-1), necesitamos mockear useNavigate específicamente
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    renderComponent();
    
    const backButton = screen.getByText(/← Volver/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
