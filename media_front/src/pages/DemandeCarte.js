import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DemandeCarte.css';

const DemandeCarte = () => {
  const navigate = useNavigate();
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

  const goToAdmin = () => {
    navigate('/admin-demandes');
  };

  return (
    <div className="demande-carte-container">
      <form className="demande-carte-form" onSubmit={handleSubmit}>
        <h1>Demande de carte</h1>
        {message && <p className="demande-carte-message success">{message}</p>}
        {error && <p className="demande-carte-message error">{error}</p>}

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

      <div className="demande-carte-faq">
        <h2>Pourquoi soumettre une demande de carte ?</h2>

        <div className="demande-carte-faq-item">
          <h3>1. Sécurité et traçabilité</h3>
          <p>Votre demande est enregistrée dans notre système pour garantir un traitement sécurisé et rapide.</p>
        </div>

        <div className="demande-carte-faq-item">
          <h3>2. Gain de temps</h3>
          <p>Le processus est simplifié pour vous permettre d’obtenir votre carte sans déplacements inutiles.</p>
        </div>

        <div className="demande-carte-faq-item">
          <h3>3. Suivi personnalisé</h3>
          <p>Vous pouvez suivre l’état de votre demande et recevoir des notifications sur chaque étape.</p>
        </div>

        <div className="demande-carte-faq-item">
          <h3>4. Assistance disponible</h3>
          <p>Notre équipe reste à votre disposition pour toute question concernant votre demande.</p>
        </div>
      </div>

      <button className="demande-carte-admin-btn" onClick={goToAdmin}>
        Espace Admin Front
      </button>
    </div>
  );
};

export default DemandeCarte;
