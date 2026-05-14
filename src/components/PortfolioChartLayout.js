import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardLayout, ChartContainer, PredictionsSidebar, PredictionRow } from '../pages/Portfolio/styles';

const PortfolioChartLayout = ({ portfolio, selectedCoin, setSelectedCoin, predictionData }) => {
  return (
    <DashboardLayout>
      {/* Gráfico principal */}
     
        <ChartContainer style={{ flex: 2, marginBottom: 0 }}>
        <h3>📈 Predicción de {selectedCoin?.name || 'Mercado'} (24h)</h3>
        
        {/* Removido el <div> en línea ruidoso y configurado un minHeight físico */}
        <ResponsiveContainer width="100%" height={250} minHeight={250}>
            <BarChart data={predictionData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
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
  );
};

export default PortfolioChartLayout;
