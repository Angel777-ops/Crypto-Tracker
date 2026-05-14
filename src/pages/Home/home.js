import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchCryptos, addToPortfolio, fetchGlobalData, searchCryptos } from '../../Redux/cryptoSlice';

// --- 1. Componentes de Estilos ---
import {
  MainWrapper, ViewMoreButton, DashboardGrid, InfoCard, MiniItem, SearchInput, Container, Card
} from './styles';

// --- 2. Componentes Arquitectónicos Modulares ---
import PriceTicker from '../../components/PriceTicker';
import Paginator from '../../components/Paginator';
import GlobalStats from '../../components/GlobalStats';
import SystemScanner from '../../components/SystemScanner';
import BaseFooter from '../../components/BaseFooter';

const COLORS = ['#00ff88', '#ff4d4d'];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- 3. Selectores de Redux ---
  const { list = [], status, globalData, portfolio = [], error } = useSelector((state) => state.crypto);

  // --- 4. Estados Locales ---
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  // --- 5. Efectos (Llamadas a APIs externas) ---
  useEffect(() => {
    dispatch(fetchGlobalData());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      dispatch(fetchCryptos(page));
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      dispatch(searchCryptos(searchTerm));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page, dispatch]);

  // --- 6. Operaciones de Rendimiento Memorizadas (useMemo) ---
  const topGainers = useMemo(() => {
    return [...list]
      .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
      .slice(0, 5);
  }, [list]);

  const topLosers = useMemo(() => {
    return [...list]
      .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
      .slice(0, 5);
  }, [list]);

  const pieData = useMemo(() => {
    const up = list.filter(coin => (coin.price_change_percentage_24h || 0) > 0).length;
    const down = list.filter(coin => (coin.price_change_percentage_24h || 0) <= 0).length;
    return {
      data: [{ name: 'Alza', value: up }, { name: 'Baja', value: down }],
      up,
      down
    };
  }, [list]);

  // --- 7. Controladores de Interfaz ---
  const scrollToTop = (e) => {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- 8. Renderizados Condicionales de Error y Carga Estricta ---
  if (status === 'failed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f0e17', gap: '15px' }}>
        <p style={{ color: '#ff4d4d', fontSize: '1.2rem', fontWeight: 'bold' }}>❌ Error del Servidor</p>
        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <MainWrapper>
      {/* Banner Superior Infinito */}
      <PriceTicker list={list} />

     

      {/* Dashboard Ejecutivo (Oculto en búsquedas activas) */}
      {!searchTerm && list.length > 0 && status !== 'loading' && (
        <DashboardGrid>
          {/* Panel Ganadoras */}
          <InfoCard>
            <h5>Top Ganadoras 24h</h5>
            <ViewMoreButton onClick={() => navigate('/top-ranking/gainers')}>
              VER TODOS LOS GANADORES +
            </ViewMoreButton>
            {topGainers.map(coin => (
              <MiniItem key={coin.id} to={`/coin/${coin.id}`}>
                <div className="info">
                  <img src={coin.image} width="18" alt="" />
                  {coin.name}
                </div>
                <div style={{ color: '#00ff88' }}>
                  ▲ {coin.price_change_percentage_24h ? `${coin.price_change_percentage_24h.toFixed(2)}%` : "0.00%"}
                </div>
              </MiniItem>
            ))}
          </InfoCard>

          {/* Panel Perdedoras */}
          <InfoCard>
            <h5>Top Perdedoras 24h</h5>
            <ViewMoreButton onClick={() => navigate('/top-ranking/losers')}>
              VER TODOS LOS PERDEDORES +
            </ViewMoreButton>
            {topLosers.map(coin => (
              <MiniItem key={coin.id} to={`/coin/${coin.id}`}>
                <div className="info">
                  <img src={coin.image} width="18" alt="" />
                  {coin.name}
                </div>
                <div style={{ color: '#ff4d4d' }}>
                  ▼ {coin.price_change_percentage_24h ? `${coin.price_change_percentage_24h.toFixed(2)}%` : "0.00%"}
                </div>
              </MiniItem>
            ))}
          </InfoCard>

          {/* Panel Métricas de Sentimiento */}
          <InfoCard>
            <h5>📊 Sentimiento del Mercado</h5>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={pieData.data} innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value">
                  {pieData.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#484848', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: '5px' }}>
              <strong style={{ color: pieData.up >= pieData.down ? '#00ff88' : '#ff4d4d' }}>
                {pieData.up >= pieData.down ? 'MERCADO AL ALZA' : 'MERCADO A LA BAJA'}
              </strong>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#aaa' }}>
                {pieData.up} Subiendo | {pieData.down} Bajando
              </p>
            </div>
          </InfoCard>
        </DashboardGrid>
      )}

       {/* Control de Filtrado */}
      <SearchInput 
        type="text" 
        placeholder="Buscar criptomoneda..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        $isSearching={!!searchTerm}
      />

      {/* Indicador de carga sutil e informativo */}
      {status === 'loading' && (
        <p style={{ color: '#00ff88', textAlign: 'center', fontWeight: 'bold', margin: '20px 0' }}>
          ⏳ Sincronizando con la red de CoinGecko...
        </p>
      )}

      {/* Mensaje de Búsqueda sin Resultados */}
      {status === 'succeeded' && list.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ color: '#fff' }}>No se encontraron criptomonedas que coincidan con "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} style={{ color: '#00ff88', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* Rejilla Comercial de Monedas */}
      <Container>
        {list.map((coin) => (
          <Card key={coin.id}>
            <img src={coin.image} alt={coin.name} width="50" />
            <h3>{coin.name}</h3>
            <p>{coin.current_price > 0 ? `$${coin.current_price.toLocaleString()}` : "Precio no disponible"}</p>
            <span 
              className="percentage" 
              style={{ color: (coin.price_change_percentage_24h || 0) >= 0 ? '#00ff88' : '#ff4d4d' }}
            >
              {coin.price_change_percentage_24h ? (
                <>
                  {coin.price_change_percentage_24h >= 0 ? '▲ ' : '▼ '} 
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </>
              ) : "0.00%"}
            </span>

            <Link to={`/coin/${coin.id}`}>Ver detalles</Link>

            {portfolio.some((item) => item.id === coin.id) ? (
              <span style={{ color: '#ff4d4d', fontWeight: 'bold' }} className="already-added">¡Añadido!</span>
            ) : (
              <button onClick={() => dispatch(addToPortfolio(coin))}>Añadir al Portafolio</button>
            )}
          </Card>
        ))}
      </Container>

      {/* Inyecciones Arquitectónicas Modulares de Control e Infraestructura */}
      {!searchTerm && <Paginator page={page} setPage={setPage} totalPages={300} />}

      <GlobalStats globalData={globalData} />
      <SystemScanner />
      <BaseFooter scrollToTop={scrollToTop} />
    </MainWrapper>
  );
};

export default Home;
