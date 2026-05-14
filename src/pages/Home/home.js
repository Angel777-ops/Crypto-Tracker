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

  // --- 3. selectores de Redux ---
  const { list, status, globalData, portfolio } = useSelector((state) => state.crypto);

  // --- 4. Estados Locales ---
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false); 

  // --- 5. Efectos (Llamadas a APIs externas) ---
  useEffect(() => {
    setIsMounted(true);
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
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5);
  }, [list]);

  const topLosers = useMemo(() => {
    return [...list]
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 5);
  }, [list]);

  const pieData = useMemo(() => {
    const up = list.filter(coin => coin.price_change_percentage_24h > 0).length;
    const down = list.filter(coin => coin.price_change_percentage_24h <= 0).length;
    return {
      data: [{ name: 'Alza', value: up }, { name: 'Baja', value: down }],
      up,
      down
    };
  }, [list]);

  // --- 7. Controladores de Interfaz ---
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- 8. Estados de Carga e Interrupciones Técnicas ---
  if (status === 'loading') return <p style={{ textAlign: 'center', color: 'white', marginTop: '40px' }}>Cargando criptos...</p>;
  if (status === 'failed') return <p style={{ textAlign: 'center', color: 'white', marginTop: '40px' }}>Error al cargar criptos...</p>;

  return (
    <MainWrapper>
      {/* Banner Superior Infinito */}
      <PriceTicker list={list} />

      {/* Dashboard Ejecutivo (Desaparece en modo búsqueda) */}
      {!searchTerm && list.length > 0 && (
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
            {isMounted && (
              <ResponsiveContainer width="100%" height={120} minHeight={120}>
                <PieChart>
                  <Pie
                    data={pieData.data}
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#484848', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
            
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
      />

      {/* Rejilla Comercial de Monedas */}
      <Container>
        {list?.map((coin) => (
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

            {portfolio?.some((item) => item.id === coin.id) ? (
              <span style={{ color: 'red' }} className="already-added">¡Añadido!</span>
            ) : (
              <button onClick={() => dispatch(addToPortfolio(coin))}>Añadir al Portafolio</button>
            )}
          </Card>
        ))}
      </Container>

      {/* Inyecciones Arquitectónicas Modulares de Control e Infraestructura */}
      <Paginator page={page} setPage={setPage} totalPages={300} />

      <GlobalStats globalData={globalData} />

      <SystemScanner />

      <BaseFooter scrollToTop={scrollToTop} />
    </MainWrapper>
  );
};

export default Home;
