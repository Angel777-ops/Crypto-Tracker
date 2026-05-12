
import { useParams, useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import React, { useState } from 'react'; 
import { 
  Background, 
  RankingContainer, 
  Title, 
  ListWrapper, 
  CoinRow, 
  CoinInfo, 
  Percentage,
  BackButton,
  PageButton,
  PaginationContainer
} from './styles';

const Ranking = () => {
  const { type } = useParams();
  const navigate = useNavigate(); // 2. Inicializa navigate
  const { list } = useSelector((state) => state.crypto);


    // LÓGICA DE PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Cuántas criptos mostrar por página


  const isGainMode = type === 'gainers';

  const filteredList = list
    .filter((coin) => {
      const change = coin.price_change_percentage_24h || 0;
      return isGainMode ? change > 0 : change < 0;
    })
    .sort((a, b) => {
      const valA = a.price_change_percentage_24h || 0;
      const valB = b.price_change_percentage_24h || 0;
      return isGainMode ? valB - valA : valA - valB;
    });



  // 2. Calcular los índices de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);


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
            /* 3. Agrega el onClick aquí */
            <CoinRow 
              key={coin.id} 
              $isGain={coin.price_change_percentage_24h > 0}
              // Cambia 'details' por 'coin'
             onClick={() => navigate(`/coin/${coin.id}`)}

              style={{ cursor: 'pointer' }} 
            >
              <CoinInfo>
                <span style={{ color: '#6c5ce7', width: '25px' }}>{index + 1}.</span>
                <img src={coin.image} alt={coin.name} />
                <span>{coin.name} <small style={{ color: '#a29bfe' }}>({coin.symbol.toUpperCase()})</small></span>
              </CoinInfo>
              
              <Percentage $isGain={(coin.price_change_percentage_24h || 0) > 0}>
                {(coin.price_change_percentage_24h || 0) > 0 ? '+' : ''}
                {(coin.price_change_percentage_24h || 0).toFixed(2)}%
              </Percentage>
            </CoinRow>
          ))}
        </ListWrapper>

          <PaginationContainer>
          <PageButton 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          > {'<'} </PageButton>

          {[...Array(totalPages)].map((_, i) => (
            <PageButton 
              key={i} 
              $active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PageButton>
          )).slice(Math.max(0, currentPage - 3), currentPage + 2)} {/* Limitamos botones visibles */}

          <PageButton 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          > {'>'} </PageButton>
        </PaginationContainer>
      </RankingContainer>
    </Background>
  );
};

export default Ranking;
