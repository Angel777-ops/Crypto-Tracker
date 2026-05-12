import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  Cell } from 'recharts';
import {  Background, DetailContainer, ChartWrapper, BackButton, InfoGrid, Capitalization, PredictionModule 
} from './styles';



const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]); 

  const coin = useSelector((state) => 
    state.crypto.list.find((item) => item.id === id)
  );

  // Petición a la API para el historial de precios (últimos 7 días)
   
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
           `https://api.coingecko.com/api/v3/coins/${id}/market_chart`, 
          { 
            params: { 
              vs_currency: 'usd', 
              days: '7', 
              interval: 'daily' 
            },
            headers: {
              'x-cg-demo-api-key': 'CG-CVSihdKbZ8xoL7sZbKMaGzoZ' 
            }
          }
        );
        
        // Formateamos los datos para Recharts
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

  if (!coin) return <p>Moneda no encontrada</p>;



  
  
  // Calculamos el valor estimado en 24h
 // --- Lógica de Predicción ---
const change = (coin.price_change_percentage_24h || 0) / 100;
const currentPrice = coin.current_price;
const isBullish = change >= 0;

// Configuración de agresividad
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

// Datos para el BarChart (Mínimo, Actual, Máximo)
const predictionData = [
  { name: 'Mín. Proyectado', valor: predictedMin },
  { name: 'Precio Actual', valor: currentPrice },
  { name: 'Máx. Proyectado', valor: predictedMax },
];

//________________________________________________________________

  return (
    <Background>
    <DetailContainer>
      <BackButton onClick={() => navigate(-1)}>← Volver</BackButton>
      
      <img src={coin.image} alt={coin.name} width="80" />
      <h1>{coin.name} ({coin.symbol.toUpperCase()})</h1>
      
      

    <InfoGrid>
    <div>
        <p><strong>Precio Actual:</strong></p>
        <h3>${coin.current_price.toLocaleString()} USD</h3>
    </div>
    <div>
        <p><strong>Cambio 24h:</strong></p>
        <h3 style={{ color: coin.price_change_percentage_24h > 0 ? 'green' : 'red' }}>
        {coin.price_change_percentage_24h.toFixed(2)}%
        </h3>
    </div>
    <div>
        <p><strong>Máximo 24h:</strong></p>
        <p>${coin.high_24h.toLocaleString()}</p>
    </div>
    <div>
        <p><strong>Mínimo 24h:</strong></p>
        <p>${coin.low_24h.toLocaleString()}</p>
    </div>
    </InfoGrid>





      {/* --- NUEVO: Gráfico --- */}
      <h3>Tendencia últimos 7 días</h3>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide /> 
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip />
            <Line 
                type="monotone" 
                dataKey="price" 
                stroke={coin.price_change_percentage_24h > 0 ? "#4caf50" : "#f44336"} // Verde si sube, rojo si baja
                strokeWidth={3} 
                dot={false} 
            />

          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <Capitalization><strong>Capitalización de Mercado:</strong></Capitalization>
        <Capitalization>${coin.market_cap.toLocaleString()}</Capitalization>
      </div>



    

    
    {/* ---  MÓDULO DE PREDICCIÓN --- */}
<PredictionModule $isBullish={isBullish}>
  <h4>🔮 Análisis de Proyección (Próximas 24h)</h4>
  <p style={{ color: '#ccc', fontSize: '0.8rem', marginBottom: '15px' }}>
    Basado en volatilidad ajustada ({volatilityMultiplier}x)
  </p>

   <div>
        <p><strong>Precio Actual:</strong></p>
        <h3>${coin.current_price.toLocaleString()} USD</h3>
    </div>

  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
    <div>
      <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Mínimo Est.</span>
      <div style={{ fontSize: '1.1rem', color: '#ff4d4d' }}>
        ${predictedMin.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Promedio Esp.</span>
      <div className="prediction-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        ${predictedPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
    </div>

    <div>
      <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Máximo Est.</span>
      <div style={{ fontSize: '1.1rem', color: '#00ff88' }}>
        ${predictedMax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
    </div>
  </div>

  <p style={{ color: isBullish ? '#00ff88' : '#ff4d4d', fontWeight: 'bold', textAlign: 'center' }}>
    {isBullish ? '▲ EXPECTATIVA ALCISTA' : '▼ EXPECTATIVA BAJISTA'}
  </p>

  {/* Gráfico de Barras Proyectado */}
  <div style={{ width: '100%', height: '150px', marginTop: '20px' }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={predictionData}>
        <XAxis dataKey="name" stroke="#a29bfe" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e1b29', border: 'none', borderRadius: '8px', color: '#fff' }}
          formatter={(value) => `$${value.toLocaleString()}`}
          cursor={{fill: 'rgba(255,255,255,0.05)'}}
          itemStyle={{ color: '#a29bfe' }} 
               
        />
        <Bar dataKey="valor" radius={[5, 5, 0, 0]} barSize={50}>
          {predictionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? '#ff4d4d' : index === 1 ? '#a29bfe' : '#00ff88'} />
          ))}
        </Bar>
      </BarChart >
    </ResponsiveContainer>
  </div>
</PredictionModule>



    </DetailContainer>
    </Background>
  );
};

export default Details;
