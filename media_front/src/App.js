import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VerifyCard from './components/VerifyCard';
import RequestForm from './components/RequestForm';
import CartePerdue from './pages/CartePerdue';
import Contact from './pages/Contact';
import Home from './pages/Home';
import DemandeCarte from './pages/DemandeCarte';
import VerifierCarte from './pages/VerifierCarte';
import DisplayCardInfo from './components/DisplayCardInfo'; // note le chemin correct, il est dans components

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '10px', background: '#007BFF', color: 'white' }}>
          <Link to="/" style={{ margin: '0 10px', color: 'white' }}>Accueil</Link>
          <Link to="/demande-carte" style={{ margin: '0 10px', color: 'white' }}>Demande Carte</Link>
          <Link to="/carte-perdue" style={{ margin: '0 10px', color: 'white' }}>Carte Perdue</Link>
          <Link to="/contact" style={{ margin: '0 10px', color: 'white' }}>Contact</Link>
          <Link to="/verifier-carte" style={{ margin: '0 10px', color: 'white' }}>Vérifier Carte</Link>
        </nav>

        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demande-carte" element={<DemandeCarte />} />
            <Route path="/carte-perdue" element={<CartePerdue />} />
            <Route path="/verifier-carte" element={<VerifyCard />} />
            <Route path="/verifier-carte/:cardId" element={<VerifierCarte />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/request-form" element={<RequestForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
