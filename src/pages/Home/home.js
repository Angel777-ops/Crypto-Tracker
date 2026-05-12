import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptos, addToPortfolio, fetchGlobalData } from '../../Redux/cryptoSlice';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import{
  MainWrapper, ViewMoreButton, DashboardGrid, InfoCard, MiniItem, SearchInput, Container, Card, Pagination, GlobalStatsBar, Footer, TickerWrapper, TickerContent, TickerItem, LivePulseWrapper, PulseDot, ScannerWrapper, BlockGrid, Block, ScannerText
} from './styles';





const Home = () => {
  const dispatch = useDispatch();
   const navigate = useNavigate();
  const { list, status } = useSelector((state) => state.crypto);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
   const { globalData } = useSelector((state) => state.crypto);

const portfolio = useSelector((state) => state.crypto.portfolio);




  useEffect(() => {
    dispatch(fetchCryptos(page));
      dispatch(fetchGlobalData());
  }, [dispatch, page]);


    
  

  // 2. Lógica para Ganadoras, Perdedoras y Gráfico Circular
  const topGainers = [...list].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 5);
  const topLosers = [...list].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 5);

  // Datos para el gráfico circular
  const up = list.filter(coin => coin.price_change_percentage_24h > 0).length;
  const down = list.filter(coin => coin.price_change_percentage_24h <= 0).length;

  const pieData = [
    { name: 'Alza', value: up },
    { name: 'Baja', value: down }
  ];
  const COLORS = ['#00ff88', '#ff4d4d'];

  const filteredCoins = list.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') return <p style={{textAlign: 'center', color: 'white'}}>Cargando criptos...</p>;

  const scrollToTop = (e) => {
  e.preventDefault(); 
  window.scrollTo({
    top: 0,
    behavior: 'smooth' 
  });
};

  return (
    <MainWrapper>

       {list.length > 0 && (
      <TickerWrapper>
        <TickerContent>
          {list.slice(0, 15).map(coin => (
            <TickerItem key={coin.id} $isUp={coin.price_change_percentage_24h > 0}>
              <span className="symbol">{coin.symbol.toUpperCase()}:</span>
              <span className="price">${coin.current_price.toLocaleString()}</span>
              <span className="change">
                {coin.price_change_percentage_24h > 0 ? '▲' : '▼'} 
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </span>
            </TickerItem>
          ))}
        </TickerContent>
      </TickerWrapper>
    )}

      {!searchTerm && list.length > 0 && (
        <DashboardGrid>
          <InfoCard>
            <h5>🚀 Top Ganadoras 24h</h5>
             <ViewMoreButton onClick={() => navigate('/top-ranking/gainers')}>
                VER TODOS LOS GANADORES +
             </ViewMoreButton>
            {topGainers.map(coin => (
              <MiniItem key={coin.id} to={`/coin/${coin.id}`}>
                <div className="info">
                  <img src={coin.image} width="18" alt="" />
                  {coin.name}
                </div>
                <div className="stats">
                  <div style={{color: '#00ff88'}}>▲ {coin.price_change_percentage_24h.toFixed(2)}%</div>
                </div>
              </MiniItem>
            ))}
          </InfoCard>

          <InfoCard>
            <h5>📉 Top Perdedoras 24h</h5>
            <ViewMoreButton onClick={() => navigate('/top-ranking/losers')}>
              VER TODOS LOS PERDEDORES +
            </ViewMoreButton>
            {topLosers.map(coin => (
              <MiniItem key={coin.id} to={`/coin/${coin.id}`}>
                <div className="info">
                  <img src={coin.image} width="18" alt="" />
                  {coin.name}
                </div>
                <div className="stats">
                  <div style={{color: '#ff4d4d'}}>▼ {coin.price_change_percentage_24h.toFixed(2)}%</div>
                </div>
              </MiniItem>
            ))}
          </InfoCard>

          {/* 3. Tarjeta con Gráfico Circular */}
          <InfoCard>
            <h5>📊 Sentimiento del Mercado</h5>
            <div style={{ width: '100%', height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                    
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#484848', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          <div style={{ textAlign: 'center', marginTop: '5px' }}>
            <strong style={{ color: up >= down ? '#00ff88' : '#ff4d4d' }}>
                {up >= down ? 'MERCADO AL ALZA' : 'MERCADO A LA BAJA'}
            </strong>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#aaa' }}> 
                {up} Subiendo | {down} Bajando
            </p>
          </div>
          </InfoCard>
        </DashboardGrid>
      )}

      <SearchInput 
        type="text" 
        placeholder="Buscar criptomoneda..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Container>
        {filteredCoins.map((coin) => (
          <Card key={coin.id}>
            <img src={coin.image} alt={coin.name} width="50" />
            <h3>{coin.name}</h3>
            <p>${coin.current_price?.toLocaleString()}</p>

            <span className="percentage" style={{ color: coin.price_change_percentage_24h >= 0 ? '#00ff88' : '#ff4d4d' }}>
                {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>

            <Link to={`/coin/${coin.id}`}>Ver detalles</Link>


            {portfolio.find((item) => item.id === coin.id) ? (
              <span style={{color: 'red'}} className="already-added">¡Añadido!</span>
            ) : (
              <button onClick={() => dispatch(addToPortfolio(coin))}>
                Añadir al Portafolio
              </button>
            )}

          </Card>
        ))}
      </Container>

      <Pagination>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&lt;</button>
        {[1, 2, 3, 4, 5].map(num => (
          <button key={num} className={page === num ? 'active' : ''} onClick={() => setPage(num)}>{num}</button>
        ))}
        <span style={{color: 'white'}}>...</span>
        <button onClick={() => setPage(300)}>300</button>
        <button onClick={() => setPage(p => p + 1)}>&gt;</button>
      </Pagination>


       {globalData && (
        <GlobalStatsBar>
          <div className="stat">
            <span>Dominancia BTC</span>
            <strong>{globalData?.market_cap_percentage?.btc?.toFixed(1)|| "0.0"}%</strong>
          </div>
          <div className="stat">
            <span>Market Cap Global</span>
            <strong>${(globalData?.total_market_cap.usd / 1e12).toFixed(2)}T</strong>
          </div>
          <div className="stat">
            <span>Volumen 24h</span>
            <strong>${(globalData?.total_volume.usd / 1e9).toFixed(2)}B</strong>
          </div>
          <div className="stat">
            <span>Criptos Activas</span>
            <strong>{globalData?.active_cryptocurrencies.toLocaleString()}</strong>
          </div>
        </GlobalStatsBar>
      )}

          {/* --- LIVE PULSE --- */}
          <LivePulseWrapper>
            <PulseDot />
            <span>SISTEMA: EN LÍNEA // FEED DE DATOS ACTIVO</span>
          </LivePulseWrapper>


    <ScannerWrapper>
      <ScannerText>Escaneando Bloques de Red... [OK]</ScannerText>
      <BlockGrid>
        
        {[...Array(15)].map((_, i) => (
          <Block key={i} delay={i * 0.2} />
        ))}
      </BlockGrid>
    </ScannerWrapper>


      {list.length > 0 && (
      <TickerWrapper>
        <TickerContent>
          {list.slice(0, 15).map(coin => (
            <TickerItem key={coin.id} $isUp={coin.price_change_percentage_24h > 0}>
              <span className="symbol">{coin.symbol.toUpperCase()}:</span>
              <span className="price">${coin.current_price.toLocaleString()}</span>
              <span className="change">
                {coin.price_change_percentage_24h > 0 ? '▲' : '▼'} 
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </span>
            </TickerItem>
          ))}
        </TickerContent>
      </TickerWrapper>
    )}

        <Footer>
      <div className="footer-content">
        <div className="footer-links">
            <button className="scroll-btn" onClick={scrollToTop}>
                Inicio
            </button>
          <Link to="/portfolio">Mi Portafolio</Link>
          <a href="https://coingecko.com" target="_blank" rel="noreferrer">
            API de CoinGecko
          </a>
        </div>
        
        <p>
          <span className="status-dot"></span>
          Sistema Operativo: <strong>CriptoTracker v1.0</strong> | Datos en tiempo real
        </p>
        
        <p style={{ opacity: 0.6, fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} Desarrollado con React & Redux. No es consejo financiero.
        </p>
      </div>
    </Footer>
    </MainWrapper>
  );
};

export default Home;
