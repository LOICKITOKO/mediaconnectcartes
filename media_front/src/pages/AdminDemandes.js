import React, { useState } from 'react';
import axios from 'axios';
import './AdminDemandes.css';

const AdminDemandes = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [demandes, setDemandes] = useState([]);
  const [pertes, setPertes] = useState([]);

  const ADMIN_PASSWORD = 'Kano';

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setLoggedIn(true);
      fetchAll();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const fetchAll = async () => {
    setError('');
    try {
      const resDemandes = await axios.get('http://127.0.0.1:8000/cartes/requests/all/');
      if (resDemandes.data.success && Array.isArray(resDemandes.data.demandes)) {
        setDemandes(resDemandes.data.demandes);
      } else {
        setDemandes([]);
      }

      const resPertes = await axios.get('http://127.0.0.1:8000/cartes/request/lost/all/');
      if (resPertes.data.success && Array.isArray(resPertes.data.lost_cards)) {
        setPertes(resPertes.data.lost_cards);
      } else {
        setPertes([]);
      }
    } catch (err) {
      console.error(err);
      setError('Impossible de récupérer les données du serveur');
    }
  };

  if (!loggedIn) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        {error && <p className="admin-error">{error}</p>}
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
    <div className="admin-container admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <p className="admin-error">{error}</p>}
      <button className="refresh-btn" onClick={fetchAll}>Rafraîchir</button>

      <h3>Demandes de cartes</h3>
      <table className="admin-table">
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
            <tr><td colSpan="7">Aucune demande pour le moment</td></tr>
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

      <h3>Déclarations de cartes perdues</h3>
      <table className="admin-table">
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
            <tr><td colSpan="6">Aucune déclaration pour le moment</td></tr>
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
