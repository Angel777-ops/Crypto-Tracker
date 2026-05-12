import styled from "styled-components";


// --- Estilos ---
const Container = styled.div`
  padding: 15px;
  min-height: 100vh;
  width: 100%;      
  margin: 0;        
  background: #0e020d; 
  box-sizing: border-box;
  h1 { color: #ffffff; text-align: start; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; } 

   @media (min-width: 768px) {
    padding: 30px;
  }
`;

const ChartContainer = styled.div`
  background: #3d3d3d;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  height: 300px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  h3 { margin: 0 0 15px 0; font-size: 1rem; color: #a29bfe; text-align: center; }
`;

const StatsWrapper = styled.div`
 display: grid; 
 grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
 gap: 20px;
  margin-bottom: 30px; 
 `;

const StatBox = styled.div`
  background: #3d3d3d;
  padding: 15px;
  border-radius: 8px;
  max-width: 200px;
  border-top: 3px solid #00d1b2;
  text-align: center;
  p { color: #ccc; margin: 0; font-size: 0.8rem; }
  h2 { color: #fff; margin: 5px 0 0 0; }
`;

const CryptoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #3d3d3d; 
  margin-bottom: 10px;
  border-radius: 8px;
  transition: 0.3s;
  cursor: pointer; /* Indicar que es clickeable */
  border: ${props => props.active ? '1px solid #81ecec;' : '1px solid transparent'};
  
  &:hover { transform: scale(1.01); box-shadow: 0 0 10px rgb(167, 255, 154); }
  .coin-link { color: #00d1b2; text-decoration: none; font-weight: bold; &:hover { text-decoration: underline; } }
  span { color: #ffffff; }
`;

const RemoveButton = styled.button`
  background: #ff4d4d;
  color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;
  &:hover { background: #cc0000; }
`;

const Pagination = styled.div`
  display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 40px;
  button { padding: 8px 15px; cursor: pointer; border: 1px solid #ddd; background: white; border-radius: 4px; &.active { background: #e1ffcc; } }
`;

const PerformanceWrapper = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const PerformanceCard = styled.div`
  background: #3d3d3d;
  padding: 10px 15px;
  border-radius: 8px;
  border-left: 4px solid ${props => props.$type === 'best' ? '#00ff88' : '#ff4d4d'};
  display: flex;
  flex-direction: column;
  min-width: 150px;
  box-shadow: 0 0 10px ${props => props.$type === 'best' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 77, 77, 0.1)'};

  span.label { color: #aaa; font-size: 0.7rem; text-transform: uppercase; }
  span.name { color: #fff; font-weight: bold; margin: 3px 0; }
  span.value { 
    color: ${props => props.$type === 'best' ? '#00ff88' : '#ff4d4d'}; 
    font-size: 0.9rem; 
    font-weight: bold;
  }
`;

const DashboardLayout = styled.div`
  display: flex;
  display: grid;
   grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 30px;
  width: 100%;
   @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr; // 2/3 para gráfico, 1/3 para sidebar
  }
`;

const PredictionsSidebar = styled.div`
  background: #3d3d3d;
  padding: 20px;
  border-radius: 12px;
  flex: 1;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  
  h3 { color: #a29bfe; font-size: 1rem; margin: 0 0 15px 0; text-align: center; border-bottom: 1px solid #444; padding-bottom: 8px; }

  /* Personalización del scroll */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #555; border-radius: 10px; }
`;

const PredictionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 8px;
  border-bottom: 1px solid #444;
  cursor: pointer;
  transition: 0.2s;
  background: ${props => props.$active ? '#4a4a4a' : 'transparent'};
  border-left: 3px solid ${props => props.$active ? '#a29bfe' : 'transparent'};

  &:hover { background: #444; }
  &:last-child { border: none; }

  .coin-name-tag {
    display: flex;
    flex-direction: column;
    flex: 1;
    .name { color: #fff; font-weight: bold; font-size: 0.85rem; }
    .symbol { color: #aaa; font-size: 0.7rem; text-transform: uppercase; }
  }

  .comparison-box {
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 2px;
    .actual { color: #ccc; font-size: 0.75rem; text-decoration: line-through; opacity: 0.7; }
    .pred { 
      color: #00ff88; 
      font-size: 0.9rem; 
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
    }
  }
`;
const ClearButton = styled.button`
  background: transparent;
  color: #ff4d4d;
  border: 1px solid #ff4d4d;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
  margin-left: auto; /* Lo empuja a la derecha */

  &:hover {
    background: #ff4d4d;
    color: white;
  }
`;

const HeaderFlex = styled.div`
  display: flex;
    flex-direction: column;
    gap: 50px;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  padding-bottom: 10px;

  h1 { border: none;
   margin: 0;
   font-size: 1.5rem; }

    @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    h1 { font-size: 2rem; }
  }
`;

export { Container, ChartContainer, StatsWrapper, StatBox, CryptoItem, RemoveButton, Pagination, PerformanceWrapper, PerformanceCard, DashboardLayout, PredictionsSidebar, PredictionRow, ClearButton, HeaderFlex };