import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Navbar from '../components/Navbar'; // Ajusta la ruta a tu componente

const mockStore = configureStore([]);

describe('Navbar Component', () => {
  let store;

  const renderComponent = (portfolioItems = []) => {
    store = mockStore({
      crypto: { portfolio: portfolioItems }
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );
  };

  test('debe renderizar el logo y los enlaces principales', () => {
    renderComponent();
    
    expect(screen.getByText(/CryptoTracker/i)).toBeInTheDocument();
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Portafolio/i)).toBeInTheDocument();
  });

  test('no debe mostrar el Badge si el portafolio está vacío', () => {
    renderComponent([]); // Portafolio con 0 items
    
    // Buscamos un número dentro del componente
    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });

  test('debe mostrar el Badge con el número correcto de items', () => {
    const mockPortfolio = [{ id: 'btc' }, { id: 'eth' }, { id: 'sol' }];
    renderComponent(mockPortfolio);

    // Debe aparecer el número 3
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
    
    // Verificamos que sea un Badge (puedes checar estilos si quieres, pero con el texto basta)
    expect(badge.tagName).toBe('SPAN');
  });

  test('los enlaces deben tener la ruta correcta', () => {
    renderComponent();
    
    expect(screen.getByText(/CryptoTracker/i).closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText(/Portafolio/i).closest('a')).toHaveAttribute('href', '/portfolio');
  });
});
