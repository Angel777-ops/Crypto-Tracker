import styled from "styled-components";


const DetailContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  background: #150d20; /* Fondo de la tarjeta oscuro */
  border: 1px solid #332a44;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 0 20px rgba(108, 92, 231, 0.2); /* Resplandor suave morado */
  text-align: center;
  color: white;
`;

const Background = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0d0221; /* Azul casi negro muy elegante */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;




const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 40px;
  background: white;
  padding: 20px;
  border-radius: 8px;
`;

const BackButton = styled.button`
  background: transparent;
  color: #a29bfe;
  border: 1px solid #a29bfe;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  transition: 0.3s;
  &:hover {
    background: #a29bfe;
    color: #0d0221;
    box-shadow: 0 0 15px #a29bfe;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin: 40px 0;
  
  .stat-box {
    background: #1e1b29;
    padding: 20px;
    border-radius: 15px;
    border-bottom: 3px solid #6c5ce7; /* Línea neón morada */
    
    p { color: #a29bfe; font-size: 0.9rem; margin-bottom: 10px; }
    h3 { font-size: 1.5rem; margin: 0; color: #fff; }
  }
`;

const Capitalization = styled.p`
 font-size: 1.5rem;
`
const PredictionModule = styled.div`
  margin-top: 40px;
  padding: 25px;
  background: #1e1b29;
  border-radius: 15px;
  border: 1px solid ${props => props.$isBullish ? '#00ff88' : '#ff4d4d'};
  box-shadow: 0 0 15px ${props => props.$isBullish ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 77, 77, 0.2)'};
  text-align: center;

  h4 { color: #a29bfe; margin-bottom: 20px; font-size: 1.1rem; }
  
  .prediction-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: ${props => props.$isBullish ? '#00ff88' : '#ff4d4d'};
    text-shadow: 0 0 10px ${props => props.$isBullish ? '#00ff88' : '#ff4d4d'};
  }
`;

export { DetailContainer, Background, ChartWrapper, BackButton, InfoGrid, Capitalization, PredictionModule };