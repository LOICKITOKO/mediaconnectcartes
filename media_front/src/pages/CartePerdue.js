import React, { useState } from 'react';
import axios from 'axios';
import './CartePerdue.css';

const CartePerdue = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    card_id: '',
    phone: '',
    email: '',
    message: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    try {
      const res = await axios.post('http://127.0.0.1:8000/cartes/request/lost/', {
        request_type: 'lost_card',
        full_name: formData.full_name,
        carte_related: formData.card_id,
        phone: formData.phone,
        email: formData.email,
        message: formData.message
      });

      if (res.data.success || res.status === 200) {
        setMessage('✅ Votre déclaration de carte perdue a bien été envoyée !');
        setFormData({
          full_name: '',
          card_id: '',
          phone: '',
          email: '',
          message: '',
        });
      } else {
        setError(res.data.error || '❌ Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Impossible de contacter le serveur.');
    }
  };

  return (
    <div className="carte-perdue-container">
      <form className="carte-perdue-form" onSubmit={handleSubmit}>
        <h1>Déclaration de carte perdue</h1>
        {message && <p className="carte-perdue-message success">{message}</p>}
        {error && <p className="carte-perdue-message error">{error}</p>}

        <div>
          <label>Nom complet :</label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
        </div>

        <div>
          <label>Numéro de carte perdue (ID) :</label>
          <input type="text" name="card_id" value={formData.card_id} onChange={handleChange} required />
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
          <label>Commentaire :</label>
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Ajoutez un commentaire" />
        </div>

        <button type="submit">Envoyer la déclaration</button>
      </form>

      {/* Section explicative / FAQ */}
      <div className="carte-perdue-faq">
        <h2>Pourquoi déclarer une perte de carte ?</h2>

        <div className="carte-perdue-faq-item">
          <h3>1. Sécurité de vos informations</h3>
          <p>Déclarer rapidement la perte de votre carte permet de sécuriser vos données personnelles et d'éviter toute utilisation frauduleuse.</p>
        </div>

        <div className="carte-perdue-faq-item">
          <h3>2. Rapidité de traitement</h3>
          <p>Votre demande est traitée sous 24 à 48 heures et vous recevez une confirmation par email ou téléphone.</p>
        </div>

        <div className="carte-perdue-faq-item">
          <h3>3. Récupération simplifiée</h3>
          <p>Après traitement, vous pouvez obtenir votre nouvelle carte sans démarches compliquées. Toutes vos informations seront validées rapidement.</p>
        </div>

        <div className="carte-perdue-faq-item">
          <h3>4. Assistance personnalisée</h3>
          <p>Notre équipe reste disponible pour répondre à vos questions et vous guider durant le processus.</p>
        </div>
      </div>
    </div>
  );
};

export default CartePerdue;
