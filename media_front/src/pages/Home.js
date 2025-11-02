import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Bienvenue sur MediaConnect Congo</h1>
          <p>Votre portail officiel pour la gestion des cartes et documents en toute sécurité.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} MediaConnect Congo. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;
