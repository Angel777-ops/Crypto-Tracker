import React from 'react';
import { GlobalStatsBar } from '../pages/Home/styles';

const GlobalStats = ({ globalData }) => {
  if (!globalData) return null;

  return (
    <GlobalStatsBar>
      <div className="stat">
        <span>Dominancia BTC</span>
        <strong>{globalData.market_cap_percentage?.btc?.toFixed(1) || "0.0"}%</strong>
      </div>
      <div className="stat">
        <span>Market Cap Global</span>
        <strong>${(globalData.total_market_cap?.usd / 1e12).toFixed(2)}T</strong>
      </div>
      <div className="stat">
        <span>Volumen 24h</span>
        <strong>${(globalData.total_volume?.usd / 1e9).toFixed(2)}B</strong>
      </div>
      <div className="stat">
        <span>Criptos Activas</span>
        <strong>{globalData.active_cryptocurrencies?.toLocaleString()}</strong>
      </div>
    </GlobalStatsBar>
  );
};

export default GlobalStats;
