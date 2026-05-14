import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Header/Header';
import Home from './pages/Home/Home';
import Details from './pages/Details/Details';
import Portfolio from './pages/Portfolio/Portfolio';
import Ranking from './pages/Ranking/Ranking';
import './app.css';

const App = () => {
  return (
    <Router>

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coin/:id" element={<Details />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/top-ranking/:type" element={<Ranking />} />
      </Routes>
    </Router>
  );
}

export default App;
