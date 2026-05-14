import React, { useEffect, useState, useMemo } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// --- 1. Componentes de Estilos ---
import { Background, DetailContainer, BackButton, InfoGrid, Capitalization } from './styles';

// --- 2. Componentes Arquitectónicos Modulares (Rutas con 2 niveles) ---
import CoinTrendChart from '../../components/CoinTrendChart';
import PricePrediction from '../../components/PricePrediction';

const API_HEADERS = {
  headers: { 'x-cg-demo-api-key': 'CG-CVSihdKbZ8xoL7sZbKMaGzoZ' }
};

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]); 

  // --- 3. Sincronización del Estado Global de Redux ---
  const reduxCoin = useSelector((state) => 
    state.crypto.list.find((item) => item.id === id)
  );
  const [coin, setCoin] = useState(reduxCoin || null);
   const [isLoading, setIsLoading] = useState(!reduxCoin); // Si no está en Redux, se activa la carga para F5

  // --- 4. Efecto de Respaldo Técnico (F5 / Recarga Manual) ---
   useEffect(() => {
    const fetchCoinBackup = async () => {
      // Si los datos ya existen en Redux, los asignamos y apagamos la carga inmediatamente
      if (reduxCoin) {
        setCoin(reduxCoin);
        setIsLoading(false);
        return;
      }

      // Si no existen (F5), los descargamos de la API de forma segura
      try {
        setIsLoading(true);
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, API_HEADERS);
        setCoin({
          id: res.data.id,
          name: res.data.name,
          symbol: res.data.symbol,
          image: res.data.image.large,
          current_price: res.data.market_data.current_price.usd,
          price_change_percentage_24h: res.data.market_data.price_change_percentage_24h || 0,
          high_24h: res.data.market_data.high_24h.usd || res.data.market_data.current_price.usd,
          low_24h: res.data.market_data.low_24h.usd || res.data.market_data.current_price.usd,
          market_cap: res.data.market_data.market_cap.usd || 0
        });
      } catch (error) {
        console.error("Error recuperando los datos base tras recargar F5", error);
      } finally {
        setIsLoading(false); // Apaga el estado de carga pase lo que pase
      }
    };

    if (id) {
      fetchCoinBackup();
    }
  }, [id, reduxCoin]); // ✅ Agregada la dependencia que pedía ESLint

  // --- 5. Efecto de Carga de Historial para el Gráfico ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart`, 
          { 
            params: { vs_currency: 'usd', days: '7', interval: 'daily' },


            headers: {
            'x-cg-demo-api-key': 'CG-CVSihdKbZ8xoL7sZbKMaGzoZ'
            }
            
          },
          
        );
        
        const formattedData = response.data.prices.map(price => ({
          date: new Date(price[0]).toLocaleDateString(),
          price: price[1]
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error cargando el gráfico", error);
      }
    };
    if (id) fetchHistory();
  }, [id]);

  // --- 6. Análisis de Datos Financieros Memorizado (useMemo) ---
  const predictionMetrics = useMemo(() => {
    if (!coin) return null;

    const change = (coin.price_change_percentage_24h || 0) / 100;
    const currentPrice = coin.current_price;
    const isBullish = change >= 0;
    const volatilityMultiplier = 1.2;
    const adjustedChange = Math.abs(change) * volatilityMultiplier;

    let predictedMax, predictedMin;

    if (isBullish) {
      predictedMax = currentPrice * (1 + (adjustedChange * 1.1));
      predictedMin = currentPrice * (1 - (adjustedChange * 0.9));
    } else {
      predictedMax = currentPrice * (1 + (adjustedChange * 0.9));
      predictedMin = currentPrice * (1 - (adjustedChange * 1.1));
    }

    const predictedPrice = currentPrice * (1 + change);

    return {
      isBullish,
      volatilityMultiplier,
      predictedMin,
      predictedPrice,
      predictedMax,
      predictionData: [
        { name: 'Mín. Proyectado', valor: predictedMin },
        { name: 'Precio Actual', valor: currentPrice },
        { name: 'Máx. Proyectado', valor: predictedMax }
      ]
    };
  }, [coin]);

  // --- 7. Validación de Renderizado Seguro ---
  if (isLoading) {
    return <p style={{ textAlign: 'center', color: 'white', marginTop: '40px' }}>Sincronizando datos con la red...</p>;
  }
  if (!coin) return <p style={{ textAlign: 'center', color: 'white', marginTop: '40px' }}>Moneda no encontrada</p>;

  return (
    <Background>
      <DetailContainer>
        <BackButton onClick={() => navigate(-1)}>← Volver</BackButton>
        
        <img src={coin.image} alt={coin.name} width="80" />
        <h1>{coin.name} ({coin.symbol.toUpperCase()})</h1>
        
        {/* Rejilla de Información de Mercado */}
        <InfoGrid>
          <div>
            <p><strong>Precio Actual:</strong></p>
            <h3>${coin.current_price.toLocaleString()} USD</h3>
          </div>
          <div>
            <p><strong>Cambio 24h:</strong></p>
            <h3 style={{ color: coin.price_change_percentage_24h > 0 ? '#00ff88' : '#ff4d4d' }}>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </h3>
          </div>
          <div>
            <p><strong>Máximo 24h:</strong></p>
            <p>${(coin.high_24h ?? coin.current_price ?? 0).toLocaleString()}</p>
          </div>
          <div>
            <p><strong>Mínimo 24h:</strong></p>
            <p>${(coin.low_24h ?? coin.current_price ?? 0).toLocaleString()}</p>
          </div>
        </InfoGrid>

        {/* Componente Modular: Gráfico Histórico */}
        <CoinTrendChart chartData={chartData} isUp={coin.price_change_percentage_24h > 0} />

        {/* Capitalización de Mercado */}
        <div style={{ marginTop: '30px', borderTop: '1px solid #444', paddingTop: '20px' }}>
          <Capitalization><strong>Capitalización de Mercado:</strong></Capitalization>
          <Capitalization>${coin.market_cap ? coin.market_cap.toLocaleString() : "No disponible"}</Capitalization>
        </div>

        {/* Componente Modular: Motor de Análisis Predictivo */}
        {predictionMetrics && (
          <PricePrediction coin={coin} predictionMetrics={predictionMetrics} />
        )}
      </DetailContainer>
    </Background>
  );
};

export default Details;
