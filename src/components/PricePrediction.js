import React, { useState, useEffect } from 'react'; // ✅ Añadidos useState y useEffect
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PredictionModule } from '../pages/Details/styles';

const PricePrediction = ({ coin, predictionMetrics }) => {
  const { isBullish, volatilityMultiplier, predictedMin, predictedPrice, predictedMax, predictionData } = predictionMetrics;

  // --- Estado de Control de Ciclo de Vida ---
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
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
        {/* ✅ CORRECCIÓN DEFINITIVA: Solo renderiza si el componente ya se montó en el DOM estable */}
        {isMounted && (
          <ResponsiveContainer width="100%" height={150} minHeight={150}>
            <BarChart data={predictionData}>
              <XAxis dataKey="name" stroke="#a29bfe" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e1b29', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => `$${value.toLocaleString()}`}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                itemStyle={{ color: '#a29bfe' }} 
              />
              <Bar dataKey="valor" radius={[5, 5, 0, 0]} barSize={50}>
                {predictionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#ff4d4d' : index === 1 ? '#a29bfe' : '#00ff88'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </PredictionModule>
  );
};

export default PricePrediction;
