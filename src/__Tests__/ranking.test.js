import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Ranking from '../pages/Ranking/ranking'; // Ajusta la ruta

// Reutilizamos el mock de navegación que ya tenemos
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore([]);

describe('Ranking Component', () => {
  let store;
  const mockList = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 50000, price_change_percentage_24h: 10, image: 'btc.png' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3000, price_change_percentage_24h: -5, image: 'eth.png' },
    { id: 'cardano', name: 'Cardano', symbol: 'ada', current_price: 0.5, price_change_percentage_24h: 15, image: 'ada.png' },
  ];

  beforeEach(() => {
    store = mockStore({
      crypto: { list: mockList }
    });
    mockNavigate.mockClear();
  });

  const renderComponent = (type = 'gainers') =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/ranking/${type}`]}>
          <Routes>
            <Route path="/ranking/:type" element={<Ranking />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

  test('debe mostrar solo los ganadores ordenados de mayor a menor', () => {
    renderComponent('gainers');
    
    expect(screen.getByText(/Top Ganadores 24h/i)).toBeInTheDocument();
    expect(screen.getByText('Cardano')).toBeInTheDocument(); // 15% (Primero)
    expect(screen.getByText('Bitcoin')).toBeInTheDocument(); // 10% (Segundo)
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument(); // -5% (Oculto)
  });

  test('debe mostrar solo los perdedores cuando el tipo es losers', () => {
    renderComponent('losers');
    
    expect(screen.getByText(/Top Perdedores 24h/i)).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
  });

  test('debe navegar a los detalles al hacer clic en una moneda', () => {
    renderComponent('gainers');
    
    const bitcoinRow = screen.getByText('Bitcoin').closest('div');
    fireEvent.click(bitcoinRow);
    
    expect(mockNavigate).toHaveBeenCalledWith('/coin/bitcoin');
  });

  test('debe navegar hacia atrás al hacer clic en Volver', () => {
    renderComponent('gainers');
    
    const backBtn = screen.getByText(/Volver/i);
    fireEvent.click(backBtn);
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('debe manejar correctamente el cambio de página', () => {
    // Creamos una lista larga para forzar paginación (12 items)
    const longList = Array.from({ length: 12 }, (_, i) => ({
      id: `coin-${i}`,
      name: `Coin ${i}`,
      symbol: 'c',
      price_change_percentage_24h: 5,
      image: 'img.png'
    }));
    
    store = mockStore({ crypto: { list: longList } });
    renderComponent('gainers');

    // Inicialmente muestra los primeros 10
    expect(screen.getByText('Coin 0')).toBeInTheDocument();
    expect(screen.queryByText('Coin 11')).not.toBeInTheDocument();

    // Clic en página 2
    const page2Btn = screen.getByText('2');
    fireEvent.click(page2Btn);

    // Ahora debería mostrar los restantes
    expect(screen.getByText('Coin 11')).toBeInTheDocument();
    expect(screen.queryByText('Coin 0')).not.toBeInTheDocument();
  });
});
