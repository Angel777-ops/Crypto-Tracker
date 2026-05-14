import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartWrapper } from '../pages/Details/styles';

const CoinTrendChart = ({ chartData, isUp }) => {
  return (
    <>
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
              stroke={isUp ? "#4caf50" : "#f44336"} 
              strokeWidth={3} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </>
  );
};

export default CoinTrendChart;
