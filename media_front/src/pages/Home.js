import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // ton CSS existant

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero */}
      <section className="home-hero">
        <h2>Gérez vos cartes en toute sécurité</h2>
        <p>
          Avec CartesConnect ID, accédez facilement à vos informations, déclarez une perte, ou vérifiez vos cartes de manière sécurisée.
        </p>

        {/* Boutons principaux */}
        <div className="home-buttons">
          <Link to="/demande-carte" className="home-btn">
            Demande de carte
          </Link>
          <Link to="/carte-perdue" className="home-btn">
            Déclaration de perte
          </Link>
          <Link to="/verifier-carte" className="home-btn">
            Vérification de cartes
          </Link>
          <Link to="/contact" className="home-btn">
            Gestion sécurisée
          </Link>
        </div>
      </section>

      {/* Avantages */}
      <section className="home-advantages">
        <h3>Pourquoi CartesConnect ID ?</h3>
        <ul>
          <li>Sécurité totale de vos données personnelles</li>
          <li>Accès rapide aux informations de votre carte</li>
          <li>Interface simple et intuitive</li>
          <li>Support client et assistance en ligne</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        &copy; 2025 CartesConnect ID - Tous droits réservés
      </footer>
    </div>
  );
}
