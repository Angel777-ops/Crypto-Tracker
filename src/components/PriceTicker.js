import React from 'react';
import { TickerWrapper, TickerContent, TickerItem } from '../pages/Home/styles';

const PriceTicker = ({ list }) => {
  if (!list || list.length === 0) return null;

  return (
    <TickerWrapper>
      <TickerContent>
        {list.slice(0, 15).map(coin => (
          <TickerItem key={coin.id} $isUp={coin.price_change_percentage_24h > 0}>
            <span className="symbol">{coin.symbol.toUpperCase()}:</span>
            <span className="price">${coin.current_price?.toLocaleString()}</span>
            <span className="change">
              {coin.price_change_percentage_24h > 0 ? '▲' : '▼'} 
              {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
            </span>
          </TickerItem>
        ))}
      </TickerContent>
    </TickerWrapper>
  );
};

export default PriceTicker;
