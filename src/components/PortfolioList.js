import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CryptoItem, RemoveButton, Pagination } from '../pages/Portfolio/styles';

const PortfolioList = ({ portfolio, selectedCoin, setSelectedCoin, onRemove, itemsPerPage = 6 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = portfolio.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(portfolio.length / itemsPerPage);

  return (
    <>
      {currentItems.map((coin) => (
        <CryptoItem 
          key={coin.id} 
          $active={selectedCoin?.id === coin.id}
          onClick={() => setSelectedCoin(coin)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={coin.image} alt={coin.name} width="30" />
            <Link 
              to={`/coin/${coin.id}`} 
              className="coin-link" 
              onClick={(e) => e.stopPropagation()}
            >
              {coin.name}
            </Link>
            <span>${coin.current_price.toLocaleString()}</span>
          </div>
          <RemoveButton onClick={(e) => {
            e.stopPropagation();
            onRemove(coin.id);
          }}>
            Eliminar
          </RemoveButton>
        </CryptoItem>
      ))}

      {totalPages > 1 && (
        <Pagination>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}> &lt; </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button 
              key={num} 
              className={currentPage === num ? 'active' : ''} 
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}> &gt; </button>
        </Pagination>
      )}
    </>
  );
};

export default PortfolioList;
