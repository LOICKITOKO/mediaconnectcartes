import React, { useState } from 'react';
import axios from 'axios';

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

    // Vérification rapide
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
    <div>
      <h1>Déclaration de carte perdue</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default CartePerdue;
