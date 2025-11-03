import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VerifyCard from './components/VerifyCard';
import RequestForm from './components/RequestForm';
import CartePerdue from './pages/CartePerdue';
import Contact from './pages/Contact';
import Home from './pages/Home';
import DemandeCarte from './pages/DemandeCarte';
import AdminDemandes from './pages/AdminDemandes';
import DisplayCardInfo from './components/DisplayCardInfo';
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        {/* Header global et fixe */}
        <header
          className="home-header"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: "0 0 0 20px", color: "#fff" }}>CartesConnect ID</h1>
          <Link
            to="/"
            className="home-header-btn"
            style={{
              marginRight: "20px",
              padding: "20px 70px",
              backgroundColor: "#007BFF",
              color: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Accueil
          </Link>
        </header>

        {/* Contenu principal avec padding pour ne pas cacher le header */}
        <div style={{ paddingTop: "80px", maxWidth: "800px", margin: "0 auto" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demande-carte" element={<DemandeCarte />} />
            <Route path="/carte-perdue" element={<CartePerdue />} />
            <Route path="/verifier-carte" element={<VerifyCard />} />
            <Route path="/admin-demandes" element={<AdminDemandes />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/request-form" element={<RequestForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
