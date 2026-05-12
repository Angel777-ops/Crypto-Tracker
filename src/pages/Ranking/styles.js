import styled from 'styled-components';

export const Background = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0d0221;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
`;

export const RankingContainer = styled.div`
  max-width: 800px;
  width: 100%;
  background: #150d20;
  border: 1px solid #332a44;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 0 20px rgba(108, 92, 231, 0.1);
 /* Tablets y móviles */
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }

  /* Móviles muy pequeños */
  @media (max-width: 480px) {
    padding: 15px;
    border: none; /* Quitamos borde para ganar aire */
  }
`;

export const Title = styled.h1`
  color: #fff;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 1px solid #332a44;
  padding-bottom: 20px;

    @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 20px;
  }
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CoinRow = styled.div`
     display: grid;
  grid-template-columns: 50px 1fr 100px;
   display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(30, 27, 41, 0.5);
  border-radius: 12px;
  border: 1px solid transparent;
  transition: 0.3s all ease;
  cursor: pointer; /* Indica que es clickable */

  &:hover {
    border-color: ${props => props.$isGain ? '#00ff88' : '#ff4d4d'};
    background: rgba(30, 27, 41, 0.8);
    transform: scale(1.02); /* Pequeño efecto de zoom */
  }

   @media (max-width: 480px) {
    padding: 12px 15px;
  }
`;

export const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fff;
  font-weight: 500;

  img {
    width: 30px;
    height: 30px;
  }

    @media (max-width: 480px) {
    gap: 10px;
    font-size: 0.9rem;

    img {
      width: 24px;
      height: 24px;
    }
  }
`;

export const Percentage = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 1.1rem;
  color: ${props => props.$isGain ? '#00ff88' : '#ff4d4d'};
  text-shadow: 0 0 10px ${props => props.$isGain ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 77, 77, 0.3)'};
  transition: color 0.5s ease, text-shadow 0.5s ease;

    @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;


export const BackButton = styled.button`
  background: transparent;
  color: #a29bfe;
  border: 1px solid #a29bfe;
  padding: 10px 20px;
  border-radius: 12px; /* Redondeado suave */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  transition: 0.3s;
  margin-bottom: 20px;
  width: fit-content;

  &:hover {
    background: #a29bfe;
    color: #0d0221;
    box-shadow: 0 0 15px #a29bfe;
  }

    @media (max-width: 480px) {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
   flex-wrap: wrap;
`;

export const PageButton = styled.button`
  background: ${props => props.$active ? '#6c5ce7' : '#1e1b29'};
  color: #fff;
  border: 1px solid #332a44;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  min-width: 40px;

  &:hover {
    border-color: #6c5ce7;
    background: ${props => props.$active ? '#6c5ce7' : 'rgba(108, 92, 231, 0.2)'};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:active {
  transform: translateY(2px);
}
`;
