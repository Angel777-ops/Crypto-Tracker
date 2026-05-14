import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../pages/Home/styles';

const BaseFooter = ({ scrollToTop }) => {
  return (
    <Footer>
      <div className="footer-content">
        <div className="footer-links">
          <button className="scroll-btn" onClick={scrollToTop}>
            Inicio
          </button>
          <Link to="/portfolio">Mi Portafolio</Link>
          <a href="https://coingecko.com" target="_blank" rel="noreferrer">
            API de CoinGecko
          </a>
        </div>
        
        <p>
          <span className="status-dot"></span>
          Sistema Operativo: <strong>CriptoTracker v1.0</strong> | Datos en tiempo real
        </p>
        
        <p style={{ opacity: 0.6, fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} Desarrollado con React & Redux. No es consejo financiero.
        </p>
      </div>
    </Footer>
  );
};

export default BaseFooter;
