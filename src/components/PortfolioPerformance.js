import React from 'react';
import { PerformanceWrapper, PerformanceCard } from '../pages/Portfolio/styles';

const PortfolioPerformance = ({ topPerformer, worstPerformer }) => {
  return (
    <PerformanceWrapper>
      <p style={{ color: '#c4c4c4', width: '100%' }}>Rendimiento en las últimas 24 horas de tu portafolio</p>
      
      <PerformanceCard $type="best">
        <span className="label">🚀 Mejor Rendimiento</span>
        <span className="name">{topPerformer?.name || 'N/A'}</span>
        <span className="value">
          {topPerformer ? `+${topPerformer.price_change_percentage_24h.toFixed(2)}%` : '0.00%'}
        </span>
      </PerformanceCard>

      <PerformanceCard $type="worst">
        <span className="label">📉 Peor Rendimiento</span>
        <span className="name">{worstPerformer?.name || 'N/A'}</span>
        <span className="value">
          {worstPerformer ? `${worstPerformer.price_change_percentage_24h.toFixed(2)}%` : '0.00%'}
        </span>
      </PerformanceCard>
    </PerformanceWrapper>
  );
};

export default PortfolioPerformance;
