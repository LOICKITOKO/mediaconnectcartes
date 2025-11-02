import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDemandes = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [demandes, setDemandes] = useState([]);
  const [pertes, setPertes] = useState([]);

  // Mot de passe simple côté front (à modifier si nécessaire)
  const ADMIN_PASSWORD = 'Kano';

  // Fonction de login
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setLoggedIn(true);
      fetchAll();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  // Récupération des demandes et des cartes perdues
  const fetchAll = async () => {
    setError('');
    try {
      // Demandes de cartes
      const resDemandes = await axios.get('http://127.0.0.1:8000/cartes/requests/all/');
      if (resDemandes.data.success && Array.isArray(resDemandes.data.demandes)) {
        setDemandes(resDemandes.data.demandes);
      } else {
        setDemandes([]);
      }

      // Déclarations de cartes perdues
      const resPertes = await axios.get('http://127.0.0.1:8000/cartes/request/lost/all/');
      if (resPertes.data.success && Array.isArray(resPertes.data.lost_cards)) {
        setPertes(resPertes.data.lost_cards);
      } else {
        setPertes([]);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données", err);
      setError('Impossible de récupérer les données du serveur');
    }
  };

  if (!loggedIn) {
    return (
      <div>
        <h2>Admin Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="password"
          placeholder="Mot de passe admin"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button onClick={handleLogin}>Se connecter</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={fetchAll} style={{ marginBottom: '20px' }}>Rafraîchir</button>

      {/* Tableau des demandes de cartes */}
      <h3>Demandes de cartes</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Nom complet</th>
            <th>Date de naissance</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Type de document</th>
            <th>Statut</th>
            <th>Date de création</th>
          </tr>
        </thead>
        <tbody>
          {demandes.length === 0 ? (
            <tr>
              <td colSpan="7">Aucune demande pour le moment</td>
            </tr>
          ) : (
            demandes.map(d => (
              <tr key={d.id}>
                <td>{d.full_name}</td>
                <td>{d.birth_date}</td>
                <td>{d.phone}</td>
                <td>{d.email}</td>
                <td>{d.doc_type}</td>
                <td>{d.status}</td>
                <td>{d.created_at}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Tableau des cartes perdues */}
      <h3 style={{ marginTop: '40px' }}>Déclarations de cartes perdues</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Nom complet</th>
            <th>Numéro de carte perdue (ID)</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Commentaire</th>
            <th>Date de création</th>
          </tr>
        </thead>
        <tbody>
          {pertes.length === 0 ? (
            <tr>
              <td colSpan="6">Aucune déclaration pour le moment</td>
            </tr>
          ) : (
            pertes.map(p => (
              <tr key={p.id}>
                <td>{p.full_name}</td>
                <td>{p.card_id}</td>
                <td>{p.phone}</td>
                <td>{p.email}</td>
                <td>{p.message}</td>
                <td>{p.created_at}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDemandes;
