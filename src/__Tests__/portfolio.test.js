import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Portfolio from '../pages/Portfolio/portfolio'; // Ajusta la ruta

// Mock de Recharts
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

const mockStore = configureStore([]);

describe('Portfolio Component', () => {
  let store;
  const mockPortfolio = [
    { 
      id: 'bitcoin', 
      name: 'Bitcoin', 
      symbol: 'btc', 
      current_price: 50000, 
      price_change_percentage_24h: 10, 
      image: 'btc.png' 
    },
    { 
      id: 'ethereum', 
      name: 'Ethereum', 
      symbol: 'eth', 
      current_price: 3000, 
      price_change_percentage_24h: -5, 
      image: 'eth.png' 
    },
  ];

  beforeEach(() => {
    store = mockStore({
      crypto: { portfolio: mockPortfolio }
    });
    store.dispatch = jest.fn();
    // Mock de window.confirm para el botón de limpiar
    window.confirm = jest.fn(() => true);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Portfolio />
        </MemoryRouter>
      </Provider>
    );

  test('debe mostrar mensaje si el portafolio está vacío', () => {
    store = mockStore({ crypto: { portfolio: [] } });
    renderComponent();
    expect(screen.getByText(/Tu portafolio está vacío/i)).toBeInTheDocument();
  });

  test('debe mostrar las estadísticas de rendimiento (Mejor y Peor)', () => {
  renderComponent();
  
  // Verificamos que existan en la lista (sin importar cuántos haya)
  expect(screen.getAllByText(/Mejor Rendimiento/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Bitcoin/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Peor Rendimiento/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Ethereum/i).length).toBeGreaterThan(0);
});


 test('debe cambiar la moneda seleccionada al hacer clic en una fila de predicción', async () => {
  renderComponent();
  
  // 1. Buscamos la fila de Ethereum específicamente en el sidebar.
  // Usamos el rol 'heading' o buscamos por texto pero forzamos el clic.
  const ethRow = screen.getAllByText(/Ethereum/i).find(el => 
    el.closest('div').className.includes('PredictionRow') || 
    el.closest('div').className.includes('coin-name-tag')
  );

  fireEvent.click(ethRow);

  // 2. Verificamos que el título del gráfico contenga "Ethereum"
  // Usamos un regex parcial que es menos propenso a fallar por etiquetas internas
  await waitFor(() => {
    const chartTitle = screen.getByRole('heading', { name: /Predicción de Ethereum/i });
    expect(chartTitle).toBeInTheDocument();
  }, { timeout: 2000 });
});


  test('debe llamar a removeFromPortfolio al hacer clic en Eliminar', () => {
    renderComponent();
    
    // Buscamos el botón eliminar de la primera moneda
    const removeButtons = screen.getAllByText(/Eliminar/i);
    fireEvent.click(removeButtons[0]);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'crypto/removeFromPortfolio' })
    );
  });

  test('debe pedir confirmación y limpiar el portafolio', () => {
    renderComponent();
    const clearBtn = screen.getByText(/Limpiar Portafolio/i);
    
    fireEvent.click(clearBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'crypto/clearPortfolio' })
    );
  });

  test('debe calcular correctamente la predicción visualmente', () => {
    renderComponent();
    // Bitcoin: 50,000 + 10% = 55,000
    // Buscamos el texto del precio predicho en el Sidebar
    expect(screen.getByText(/\$55,000\.00/i)).toBeInTheDocument();
    // Ethereum: 3,000 - 5% = 2,850
    expect(screen.getByText(/\$2,850\.00/i)).toBeInTheDocument();
  });
});
