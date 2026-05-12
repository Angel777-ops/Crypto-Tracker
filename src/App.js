import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './header/navbar';
import Home from './pages/Home/home';
import Details from './pages/Details/details';
import Portfolio from './pages/Portfolio/portfolio';
import Ranking from './pages/Ranking/ranking';
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
