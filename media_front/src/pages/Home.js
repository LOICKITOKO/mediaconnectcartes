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

      {/* Cartes pro visuelles (cliquables) */}
      <section className="home-procards">
        
        <Link to="/demande-carte" className="home-cardbox">
          <img src="/img/demandecarte.png" alt="carte" />
          <div>
            <div className="home-card-title">Demande de carte</div>
            <div className="home-card-sub">Nouvelle demande sécurisée</div>
          </div>
        </Link>

        <Link to="/carte-perdue" className="home-cardbox">
          <img src="/img/perdue.png" alt="carte" />
          <div>
            <div className="home-card-title">Carte perdue</div>
            <div className="home-card-sub">Déclaration officielle rapide</div>
          </div>
        </Link>

        <Link to="/verifier-carte" className="home-cardbox">
          <img src="/img/verify.png" alt="carte" />
          <div>
            <div className="home-card-title">Vérifier une carte</div>
            <div className="home-card-sub">Authentification instantanée</div>
          </div>
        </Link>

        <Link to="/contact" className="home-cardbox">
          <img src="/img/support.png" alt="carte" />
          <div>
            <div className="home-card-title">Service & Assistance</div>
            <div className="home-card-sub">Support client dédié</div>
          </div>
        </Link>

      </section>

      {/* Section Explicative et FAQ */}
      <section className="home-info">
        <h3>Comment ça fonctionne ?</h3>
        <p>
          Chez <strong>CartesConnect ID</strong>, nous facilitons toutes vos démarches liées aux cartes d'identité et aux services associés. Voici comment procéder :
        </p>
        <ol>
          <li><strong>Créez votre compte :</strong> Inscrivez-vous rapidement et sécurisez vos informations.</li>
          <li><strong>Déposez votre demande :</strong> Choisissez le type de service souhaité (nouvelle carte, carte perdue, vérification).</li>
          <li><strong>Suivi en ligne :</strong> Consultez l’avancement de votre demande directement depuis votre compte.</li>
          <li><strong>Recevez vos notifications :</strong> SMS ou email pour vous informer de la disponibilité ou des mises à jour.</li>
          <li><strong>Récupérez votre carte :</strong> Téléchargez votre version numérique ou retirez-la en mairie selon votre choix.</li>
        </ol>

        <h3>Foire aux questions (FAQ)</h3>
        <ul>
          <li><strong>Comment récupérer ma carte ?</strong> Vous pouvez la télécharger directement depuis votre compte ou la retirer en mairie.</li>
          <li><strong>Quels sont les délais ?</strong> Généralement entre 2 et 3 semaines selon le type de demande.</li>
          <li><strong>Que faire en cas de perte ?</strong> Déclarez la perte depuis votre compte et suivez les instructions pour obtenir une nouvelle carte.</li>
          <li><strong>Puis-je vérifier l’authenticité d’une carte ?</strong> Oui, utilisez notre service de vérification en ligne.</li>
        </ul>

        <h3>Guides et documents téléchargeables</h3>
        <ul>
          <li><a href="/documents/liste_documents.pdf" target="_blank" rel="noopener noreferrer">Liste des documents nécessaires pour chaque type de demande</a></li>
          <li><a href="/documents/guide_utilisateur.pdf" target="_blank" rel="noopener noreferrer">Guide pratique de l’utilisateur pour la plateforme</a></li>
          <li><a href="/documents/timbre_fiscal.pdf" target="_blank" rel="noopener noreferrer">Informations sur le timbre fiscal et coûts éventuels</a></li>
        </ul>

        <h3>Alternatives et conseils</h3>
        <ul>
          <li>Si vous êtes pressé, certaines demandes peuvent être traitées en priorité avec justificatif.</li>
          <li>Pour les jeunes artistes ou utilisateurs, nous proposons des tutoriels vidéo pour bien comprendre le processus.</li>
          <li>En cas de problème, contactez notre support via le formulaire ou directement par téléphone pour une assistance rapide.</li>
        </ul>
      </section>

    </div>
  );
}
