import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DemandeCarte = () => {
  const navigate = useNavigate(); // Pour la navigation vers AdminDemandes

  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    phone: '',
    email: '',
    doc_type: 'CNI',
    document_file: null,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'document_file') {
      setFormData({ ...formData, document_file: files && files[0] ? files[0] : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Vérification rapide côté front
    for (let key in formData) {
      if (!formData[key]) {
        setError('Tous les champs sont obligatoires.');
        return;
      }
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/cartes/request/new/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success || res.status === 200) {
        setMessage('✅ Votre demande a été envoyée avec succès !');
        setFormData({
          full_name: '',
          birth_date: '',
          phone: '',
          email: '',
          doc_type: 'CNI',
          document_file: null,
        });
      } else {
        setError(res.data.error || '❌ Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Impossible de contacter le serveur.');
    }
  };

  // Fonction pour naviguer vers l'espace admin front
  const goToAdmin = () => {
    navigate('/admin-demandes'); // tu devras créer cette route
  };

  return (
    <div>
      <h1>Demande de carte</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom complet :</label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
        </div>

        <div>
          <label>Date de naissance :</label>
          <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
        </div>

        <div>
          <label>Téléphone :</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <div>
          <label>Email :</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Type de document :</label>
          <select name="doc_type" value={formData.doc_type} onChange={handleChange} required>
            <option value="CNI">Carte nationale</option>
            <option value="PASS">Passeport</option>
            <option value="ACTE">Acte de naissance</option>
          </select>
        </div>

        <div>
          <label>Joindre un document :</label>
          <input type="file" name="document_file" onChange={handleChange} required />
        </div>

        <button type="submit">Envoyer la demande</button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      {/* Bouton pour accéder à l'espace admin front */}
      <button
        onClick={goToAdmin}
        style={{ backgroundColor: 'darkblue', color: 'white', padding: '10px 20px', cursor: 'pointer' }}
      >
        Espace Admin Front
      </button>
    </div>
  );
};

export default DemandeCarte;
