import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';


const Badge = styled.span`
  background-color: #4da0ff; /* Rojo neón */
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.7rem;
  margin-left: 5px;
  vertical-align: middle;
  font-weight: bold;
  box-shadow: 0 0 5px #ffffff;
`;

const Nav = styled.nav`
  background-color: #000000;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const Logo = styled(Link)`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  text-shadow: 0 2px 2px #0022ff;
`;

const NavLinks = styled.div`
  a {
    color: white;
    margin-left: 20px;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

const Navbar = () => {
  // Obtener la longitud del portafolio
  const portfolioCount = useSelector((state) => state.crypto.portfolio.length);

  return (
    <Nav>
      <Logo to="/">CryptoTracker</Logo>
      <NavLinks>
        <Link to="/">Inicio</Link>
        <Link to="/portfolio">
          Portafolio
          {/* El badge ahora vive dentro del Link de navegación */}
          {portfolioCount > 0 && <Badge>{portfolioCount}</Badge>}
        </Link>
      </NavLinks>
    </Nav>
  );
};


export default Navbar;
