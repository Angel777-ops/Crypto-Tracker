import React, { useState, useMemo } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';

// Estilos Locales
import { 
  Background, RankingContainer, Title, ListWrapper, CoinRow, 
  CoinInfo, Percentage, BackButton, PageButton, PaginationContainer 
} from './styles';

const ITEMS_PER_PAGE = 10;

const Ranking = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  
  // --- 1. Estado Global ---
  const { list } = useSelector((state) => state.crypto);

  // --- 2. Estado Local ---
  const [currentPage, setCurrentPage] = useState(1);

  const isGainMode = type === 'gainers';

  // --- 3. Filtrado y Ordenamiento Memorizado (useMemo) ---
  const filteredList = useMemo(() => {
    return [...list]
      .filter((coin) => {
        const change = coin.price_change_percentage_24h || 0;
        return isGainMode ? change > 0 : change < 0;
      })
      .sort((a, b) => {
        const valA = a.price_change_percentage_24h || 0;
        const valB = b.price_change_percentage_24h || 0;
        return isGainMode ? valB - valA : valA - valB;
      });
  }, [list, isGainMode]);

  // --- 4. Lógica de Paginación Computada (useMemo) ---
  const { currentItems, totalPages, startingIndex } = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    
    return {
      currentItems: filteredList.slice(indexOfFirstItem, indexOfLastItem),
      totalPages: Math.ceil(filteredList.length / ITEMS_PER_PAGE),
      startingIndex: indexOfFirstItem // Guarda el índice base para corregir la numeración
    };
  }, [filteredList, currentPage]);

  // --- 5. Rango de Botones de Paginación Visibles ---
  const visiblePageButtons = useMemo(() => {
    const buttons = Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(0, currentPage - 3);
    const end = currentPage + 2;
    return buttons.slice(start, end);
  }, [totalPages, currentPage]);

  return (
    <Background>
      <RankingContainer>
        <BackButton onClick={() => navigate(-1)}>
          ← Volver
        </BackButton>
        
        <Title>
          {isGainMode ? '🚀 Top Ganadores 24h' : '📉 Top Perdedores 24h'}
        </Title>
        
        <ListWrapper>
          {currentItems.map((coin, index) => (
            <CoinRow 
              key={coin.id} 
              $isGain={coin.price_change_percentage_24h > 0}
              onClick={() => navigate(`/coin/${coin.id}`)}
              style={{ cursor: 'pointer' }} 
            >
              <CoinInfo>
                {/* ✅ SOLUCIONADO: Numeración continua real (Ej: Página 2 muestra 11, 12, 13...) */}
                <span style={{ color: '#6c5ce7', width: '25px' }}>
                  {startingIndex + index + 1}.
                </span>
                <img src={coin.image} alt={coin.name} />
                <span>
                  {coin.name}{' '}
                  <small style={{ color: '#a29bfe' }}>
                    ({coin.symbol.toUpperCase()})
                  </small>
                </span>
              </CoinInfo>
              
              <Percentage $isGain={(coin.price_change_percentage_24h || 0) > 0}>
                {(coin.price_change_percentage_24h || 0) > 0 ? '+' : ''}
                {(coin.price_change_percentage_24h || 0).toFixed(2)}%
              </Percentage>
            </CoinRow>
          ))}
        </ListWrapper>

        {/* Controles del Paginador */}
        {totalPages > 1 && (
          <PaginationContainer>
            <PageButton 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => prev - 1)}
            > 
              {'<'} 
            </PageButton>

            {visiblePageButtons.map((pageNum) => (
              <PageButton 
                key={pageNum} 
                $active={currentPage === pageNum}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </PageButton>
            ))}

            <PageButton 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => prev + 1)}
            > 
              {'>'} 
            </PageButton>
          </PaginationContainer>
        )}
      </RankingContainer>
    </Background>
  );
};

export default Ranking;
