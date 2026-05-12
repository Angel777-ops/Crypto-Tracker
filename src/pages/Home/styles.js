import styled from "styled-components";
import { Link } from 'react-router-dom';


// --- Estilos ---
const MainWrapper = styled.div`
  padding: 20px;
  margin: 0 auto;
  background: #150d20e6;
  min-height: 100vh;

  
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;
const InfoCard = styled.div`
  background: #1e1b29; 
  border-radius: 12px;
  padding: 15px;
  border: 1px solid #332a44; /* Borde sutil para separar */
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  color: white; /* Texto blanco para el fondo oscuro */

  h5 { 
    margin: 0 0 15px 0; 
    color: #a29bfe; /* Color lila para el título */
    font-size: 0.9rem; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
  }
`;


const MiniItem = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  text-decoration: none;
  border-bottom: 1px solid #332a44; /* Línea oscura */
  
  .info { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    color: white; /* Nombre de la moneda en blanco */
    font-weight: bold; 
    font-size: 0.85rem; 
  }
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  margin-bottom: 40px;
  border-radius: 8px;
  border: 1px solid #332a44;
  background: #1e1b29;
  color: white;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;


 @media (max-width: 600px) {
  grid-template-columns: repeat(2, minmax(0, 1fr)); /* Fuerza el tamaño */
  gap: 10px;
  width: 100%;
  padding: 0 10px; /* Evita que peguen a los bordes */
  box-sizing: border-box;
}

   
`;

const Card = styled.div`
  
  width: 100%;           
  box-sizing: border-box;

  background: #1e1b29;
  border: 1px solid #332a44;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  transition: 0.3s;
  h3 { color: #ffffff; font-size: 1.2rem; margin: 10px 0; }
  p { color: #00ff88; font-weight: bold; font-size: 1.1rem; }
  a { color: #a29bfe; text-decoration: none; display: block; margin-bottom: 15px; }
   button {
    background: #6c5ce7; /* El color morado actual */
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s; /* Para que el cambio de color sea suave */

    /* --- EFECTO HOVER --- */
    &:hover {
      background: #81ecec; /* Color turquesa claro al pasar el mouse */
      color: #150d20;      /* El texto cambia a oscuro para mejor contraste */
      transform: translateY(-2px); /* Pequeño salto hacia arriba */
      box-shadow: 0 4px 10px rgba(129, 236, 236, 0.4); /* Resplandor neón */
    }

    /* Efecto cuando se hace clic */
    &:active {
      transform: scale(0.95);
    }
  }
  &:hover { transform: scale(1.05); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5); border-color: #6c5ce7; }



  /* Cambia tu actual &:hover por este: */
@media (min-width: 600px) {
  &:hover { 
    transform: scale(1.05); 
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5); 
    border-color: #6c5ce7; 
  }
}

`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
  button { padding: 8px 15px; cursor: pointer; border: 1px solid #332a44; background: #1e1b29; color: white; border-radius: 4px; &.active { background: #6c5ce7; } }
`;


const GlobalStatsBar = styled.div`
  background: #1e1b29;
  border: 1px solid #332a44;
  border-radius: 10px;
  padding: 15px;
  margin-top: 40px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.1);

  .stat {
    text-align: center;
    span { display: block; color: #a29bfe; font-size: 0.75rem; text-transform: uppercase; }
    strong { color: #00ff88; font-size: 1rem; text-shadow: 0 0 5px #00ff88; }
  }
`;

const Footer = styled.footer`
  margin-top: 60px;
  padding: 40px 20px;
  background: #1a1425; /* Un tono ligeramente distinto para separar */
  border-top: 1px solid #332a44;
  text-align: center;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  p {
    color: #a29bfe;
    font-size: 0.9rem;
    margin: 0;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
  }

  
  .footer-links button {
    background: none;      
    border: none;         
    padding: 0;            
    color: #00ff88;        
    font-size: 0.85rem;    
    font-weight: bold;
    font-family: inherit;  
    cursor: pointer;       
    transition: 0.3s;

    &:hover {
      color: #ffffff;
      text-shadow: 0 0 10px #00ff88;
    }
  }

  
  .footer-links a {
    color: #00ff88;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: bold;
    &:hover {
      color: #ffffff;
      text-shadow: 0 0 10px #00ff88;
    }
  }
`;


const TickerWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  background: #0d0221; /* Un tono más oscuro que el fondo */
  border-bottom: 1px solid #332a44;
  padding: 8px 0;
  position: relative;
`;

const TickerContent = styled.div`
  display: flex;
  white-space: nowrap;
  animation: ticker 30s linear infinite;

  @keyframes ticker {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }

  &:hover {
    animation-play-state: paused; /* Se detiene al pasar el mouse */
  }
`;

const TickerItem = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 40px;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;

  span.symbol { color: #a29bfe; margin-right: 5px; }
  span.price { color: #00ff88; }
  span.change { 
    margin-left: 5px; 
    font-size: 0.7rem; 
    color: ${props => props.$isUp ? '#00ff88' : '#ff4d4d'};
  }
`;

const LivePulseWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 30px 0;
  padding: 10px;
  font-family: 'Courier New', Courier, monospace; /* Fuente estilo terminal */
  color: #a29bfe;
  font-size: 0.8rem;
  letter-spacing: 1px;
`;

const PulseDot = styled.div`
  position: relative;
  width: 10px;
  height: 10px;
  background-color: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff88;

  /* El efecto de onda expansiva */
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #00ff88;
    border-radius: 50%;
    z-index: -1;
    animation: ripple 2s infinite;
  }

  @keyframes ripple {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(3.5); opacity: 0; }
  }
`;


const ScannerWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 15px;
  background: rgba(30, 27, 41, 0.5);
  border-radius: 10px;
  border: 1px solid #332a44;
  text-align: center;
`;

const BlockGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const Block = styled.div`
  width: 15px;
  height: 25px;
  background: #150d20;
  border: 1px solid #6c5ce7;
  border-radius: 3px;
  animation: scanBlock 3s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;

  @keyframes scanBlock {
    0%, 100% { background: #150d20; border-color: #332a44; box-shadow: none; }
    50% { background: #00ff88; border-color: #00ff88; box-shadow: 0 0 10px #00ff88; }
  }
`;

const ScannerText = styled.p`
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;
  color: #a29bfe;
  margin: 0;
  text-transform: uppercase;
`;

const ViewMoreButton = styled.button`
  background: transparent;
  border: none;
  color: #a29bfe;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  padding: 10px;
  width: 100%;
  text-align: center;
  transition: 0.3s;
  border-top: 1px solid #332a44;
  margin-top: 10px;

  &:hover {
    color: #00ff88;
    background: rgba(0, 255, 136, 0.05);
  }
`;

export { ViewMoreButton, MainWrapper, DashboardGrid, InfoCard, MiniItem, SearchInput, Container, Card, Pagination, GlobalStatsBar, Footer, TickerWrapper, TickerContent, TickerItem, LivePulseWrapper, PulseDot, ScannerWrapper, BlockGrid, Block, ScannerText };