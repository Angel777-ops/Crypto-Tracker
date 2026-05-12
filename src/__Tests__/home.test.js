import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import Home from '../pages/Home/home'; // Ajusta la ruta según tu estructura

// 1. Mocks de Navegación y Scroll
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock de window.scrollTo (JSDOM no lo tiene)
window.scrollTo = jest.fn();

// 2. Mock de Recharts
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
  Tooltip: () => <div />,
}));

const mockStore = configureStore([thunk]);

describe('Home Component', () => {
  let store;
  const mockList = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 50000, price_change_percentage_24h: 5, image: 'btc.png' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3000, price_change_percentage_24h: -2, image: 'eth.png' },
  ];

  beforeEach(() => {
    store = mockStore({
      crypto: {
        list: mockList,
        status: 'idle',
        portfolio: [],
        globalData: {
          market_cap_percentage: { btc: 40 },
          total_market_cap: { usd: 2000000000000 },
          total_volume: { usd: 100000000000 },
          active_cryptocurrencies: 12000,
        }
      },
    });
    store.dispatch = jest.fn();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );

  test('debe mostrar el estado de carga inicialmente', () => {
    store = mockStore({ crypto: { list: [], status: 'loading', portfolio: [] } });
    renderComponent();
    expect(screen.getByText(/Cargando criptos.../i)).toBeInTheDocument();
  });

test('debe renderizar la lista de criptomonedas y las estadísticas globales', () => {
  renderComponent();

  
  expect(screen.getAllByText(/Bitcoin/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Ethereum/i).length).toBeGreaterThan(0);
  
  expect(screen.getByText('Dominancia BTC')).toBeInTheDocument();
  expect(screen.getByText('40.0%')).toBeInTheDocument();
});


  test('debe filtrar las monedas cuando se escribe en el buscador', () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Buscar criptomoneda.../i);
    
    fireEvent.change(input, { target: { value: 'bit' } });
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });

  test('debe disparar la acción fetchCryptos al cambiar de página', () => {
    renderComponent();
    const page2Button = screen.getByText('2');
    
    fireEvent.click(page2Button);
    
    // Verificamos que dispatch se llamó (fetchCryptos es una función thunk)
    expect(store.dispatch).toHaveBeenCalled();
  });

  test('debe navegar a la sección de ganadores al hacer clic en el botón', () => {
    renderComponent();
    const viewMoreBtn = screen.getByText(/VER TODOS LOS GANADORES/i);
    
    fireEvent.click(viewMoreBtn);
    
    expect(mockNavigate).toHaveBeenCalledWith('/top-ranking/gainers');
  });

  test('debe mostrar "¡Añadido!" si la moneda ya está en el portafolio', () => {
    store = mockStore({
      crypto: {
        list: mockList,
        status: 'idle',
        portfolio: [{ id: 'bitcoin' }], // Bitcoin ya está
        globalData: null
      },
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('¡Añadido!')).toBeInTheDocument();
  });
});
