import React, { useState, useEffect, useMemo } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { removeFromPortfolio, clearPortfolio } from '../../Redux/cryptoSlice';

// Estilos locales básicos
import { Container, StatsWrapper, StatBox, ClearButton, HeaderFlex } from './styles';

// Componentes Modulares Refactorizados
import PortfolioPerformance from '../../components/PortfolioPerformance';
import PortfolioChartLayout from '../../components/PortfolioChartLayout';
import PortfolioList from '../../components/PortfolioList';

const Portfolio = () => {
  const dispatch = useDispatch();
  const portfolio = useSelector((state) => state.crypto.portfolio);
  const [selectedCoin, setSelectedCoin] = useState(null);

  // --- 1. Sincronización Automática de Selección ---
  useEffect(() => {
    if (portfolio.length > 0 && !selectedCoin) {
      setSelectedCoin(portfolio[0]);
    }
  }, [portfolio, selectedCoin]);

  // --- 2. Rendimiento de Datos Optimizado (useMemo) ---
  const predictionData = useMemo(() => {
    if (!selectedCoin) return [];
    return [{
      name: selectedCoin.symbol.toUpperCase(),
      Actual: selectedCoin.current_price,
      Prediccion: selectedCoin.current_price * (1 + (selectedCoin.price_change_percentage_24h || 0) / 100)
    }];
  }, [selectedCoin]);

  const { topPerformer, worstPerformer } = useMemo(() => {
    if (portfolio.length === 0) return { topPerformer: null, worstPerformer: null };
    
    const sorted = [...portfolio].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    return {
      topPerformer: sorted[0],
      worstPerformer: sorted[sorted.length - 1]
    };
  }, [portfolio]);

  // --- 3. Controladores de Eventos (Handlers) ---
  const handleClearPortfolio = () => {
    if (window.confirm("¿Estás seguro de que quieres vaciar todo tu portafolio?")) {
      dispatch(clearPortfolio());
      setSelectedCoin(null);
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromPortfolio(id));
    if (selectedCoin?.id === id) {
      setSelectedCoin(null);
    }
  };

  return (
    <Container>
      <HeaderFlex>
        <h1 style={{ border: 'none', margin: 0 }}>Mi Portafolio</h1>
        {portfolio.length > 0 && (
          <ClearButton 
            onClick={handleClearPortfolio}
            style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d' }}
          >
            Limpiar Portafolio
          </ClearButton>
        )}
      </HeaderFlex>

      {portfolio.length > 0 ? (
        <>
          {/* Métricas Globales */}
          <StatsWrapper>
            <StatBox>
              <p>Monedas totales</p>
              <h2>{portfolio.length}</h2>
            </StatBox>
          </StatsWrapper>

          {/* Componente Modular: Tarjetas de Rendimiento Extremas */}
          <PortfolioPerformance topPerformer={topPerformer} worstPerformer={worstPerformer} />

          {/* Componente Modular: Gráfico Analítico y Sidebar de Comparativas */}
          <PortfolioChartLayout 
            portfolio={portfolio}
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
            predictionData={predictionData}
          />

          {/* Componente Modular: Catálogo Comercial Paginado de Activos */}
          <PortfolioList 
            portfolio={portfolio}
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
            onRemove={handleRemoveItem}
            itemsPerPage={6}
          />
        </>
      ) : (
        <p style={{ color: 'white', marginTop: '20px' }}>Tu portafolio está vacío.</p>
      )}
    </Container>
  );
};

export default Portfolio;
