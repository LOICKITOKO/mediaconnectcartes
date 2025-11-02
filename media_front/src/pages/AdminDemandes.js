import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDemandes = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [demandes, setDemandes] = useState([]);

  // Mot de passe simple côté front (à modifier)
  const ADMIN_PASSWORD = 'Kano';

  // Fonction de login
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setLoggedIn(true);
      fetchDemandes();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  // Récupération des demandes depuis Django
  const fetchDemandes = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/cartes/requests/all/');
      if (res.data.success) {
        setDemandes(res.data.demandes);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des demandes", err);
      setError('Impossible de récupérer les demandes');
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
      <h2>Liste des demandes</h2>
      <button onClick={fetchDemandes} style={{ marginBottom: '10px' }}>
        Rafraîchir
      </button>
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
          {demandes.length === 0 && (
            <tr>
              <td colSpan="7">Aucune demande pour le moment</td>
            </tr>
          )}
          {demandes.map(d => (
            <tr key={d.id}>
              <td>{d.full_name}</td>
              <td>{d.birth_date}</td>
              <td>{d.phone}</td>
              <td>{d.email}</td>
              <td>{d.doc_type}</td>
              <td>{d.status}</td>
              <td>{d.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDemandes;
