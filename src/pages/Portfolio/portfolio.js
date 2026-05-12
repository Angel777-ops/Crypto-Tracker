import React, { useState, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { removeFromPortfolio, clearPortfolio } from '../../Redux/cryptoSlice';
import { Link } from 'react-router-dom'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import{Container, ChartContainer, StatsWrapper, StatBox, CryptoItem, RemoveButton, Pagination, PerformanceWrapper, PerformanceCard, DashboardLayout, PredictionsSidebar, PredictionRow, ClearButton, HeaderFlex 

}from './styles';




const Portfolio = () => {
  const portfolio = useSelector((state) => state.crypto.portfolio);
  const dispatch = useDispatch();

  // --- ESTADO PARA SELECCIONAR MONEDA ---
  const [selectedCoin, setSelectedCoin] = useState(null);

  // Seleccionar la primera moneda por defecto cuando carga el portafolio
  useEffect(() => {
    if (portfolio.length > 0 && !selectedCoin) {
      setSelectedCoin(portfolio[0]);
    }
  }, [portfolio, selectedCoin]);

  // Lógica para los datos del gráfico basándose en la selección
  const predictionData = selectedCoin ? [{
    name: selectedCoin.symbol.toUpperCase(),
    Actual: selectedCoin.current_price,
    Prediccion: selectedCoin.current_price * (1 + (selectedCoin.price_change_percentage_24h || 0) / 100) //prediccion basada en el cambio porcentual
  }] : [];

  const totalItems = portfolio.length;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = portfolio.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(portfolio.length / itemsPerPage);


  // Buscamos la moneda con mayor y menor cambio porcentual
const topPerformer = portfolio.length > 0 
  ? [...portfolio].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h) 
  : null;

const worstPerformer = portfolio.length > 0 
  ? [...portfolio].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h) 
  : null;

  const handleClearPortfolio = () => {
  if (window.confirm("¿Estás seguro de que quieres vaciar todo tu portafolio?")) {
    dispatch(clearPortfolio());
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

      {portfolio.length > 0 && (
        <>
          <StatsWrapper>
            <StatBox>
              <p>Monedas totales</p>
              <h2>{totalItems}</h2>

            </StatBox>
          </StatsWrapper>

          
                 {/* --- NUEVAS TARJETAS DE RENDIMIENTO --- */}
          <PerformanceWrapper>
            <p style={{ color: '#c4c4c4', width: '100%' }}>Rendimiento en las últimas 24 horas de tu portafolio</p>
            <PerformanceCard $type="best">
              <span className="label">🚀 Mejor Rendimiento</span>
              <span className="name">{topPerformer?.[0]?.name}</span>
              <span className="value">+{topPerformer?.[0]?.price_change_percentage_24h.toFixed(2)}%</span>
            </PerformanceCard>

            <PerformanceCard $type="worst">
              <span className="label">📉 Peor Rendimiento</span>
              <span className="name">{worstPerformer?.[0]?.name}</span>
              <span className="value">{worstPerformer?.[0]?.price_change_percentage_24h.toFixed(2)}%</span>
            </PerformanceCard>
          </PerformanceWrapper>


            <DashboardLayout>
            {/* Gráfico principal */}
            <ChartContainer style={{ flex: 2, marginBottom: 0 }}>
              <h3>📈 Predicción de {selectedCoin?.name || 'Mercado'} (24h)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" vertical={false} />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2d0529', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="Actual" fill="#6c5ce7" radius={[4, 4, 0, 0]} barSize={60} />
                  <Bar dataKey="Prediccion" fill="#00ff88" radius={[4, 4, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Módulo de Predicciones a la derecha */}
        <PredictionsSidebar>
            <h3>🔮 Comparativa 24h</h3>
            {portfolio.map((coin) => {
                const actualPrice = coin.current_price;
                const change = coin.price_change_percentage_24h || 0;
                const predPrice = actualPrice * (1 + change / 100);
                const isPositive = change >= 0;

                return (
                <PredictionRow 
                    key={coin.id} 
                    $active={selectedCoin?.id === coin.id}
                    onClick={() => setSelectedCoin(coin)}
                >
                    <div className="coin-name-tag">
                    <span className="name">{coin.name}</span>
                    <span className="symbol">{coin.symbol}</span>
                    </div>

                    <div className="comparison-box">
                    <span className="actual">
                        ${actualPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="pred" style={{ color: isPositive ? '#00ff88' : '#ff4d4d' }}>
                        {isPositive ? '▲' : '▼'} 
                        ${predPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    </div>
                </PredictionRow>
                );
            })}
        </PredictionsSidebar>

        </DashboardLayout>

        </>
      )}

      {portfolio.length === 0 ? (
        <p style={{ color: 'white' }}>Tu portafolio está vacío.</p>
      ) : (
        <>
          {currentItems.map((coin) => (
            <CryptoItem 
              key={coin.id} 
              active={selectedCoin?.id === coin.id}
              onClick={() => setSelectedCoin(coin)} // Al hacer clic, actualiza el gráfico
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={coin.image} alt={coin.name} width="30" />
                <Link 
                  to={`/coin/${coin.id}`} 
                  className="coin-link" 
                  onClick={(e) => e.stopPropagation()} // Evita que el Link active el clic del div
                >
                  {coin.name}
                </Link>
                <span>${coin.current_price.toLocaleString()}</span>
              </div>
              <RemoveButton onClick={(e) => {
                e.stopPropagation(); // Evita seleccionar antes de borrar
                dispatch(removeFromPortfolio(coin.id));
                if (selectedCoin?.id === coin.id) setSelectedCoin(null);
              }}>
                Eliminar
              </RemoveButton>
            </CryptoItem>
          ))}

          {totalPages > 1 && (
            <Pagination>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}> &lt; </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button key={num} className={currentPage === num ? 'active' : ''} onClick={() => setCurrentPage(num)}>{num}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}> &gt; </button>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default Portfolio;
