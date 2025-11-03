import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    for (let key in formData) {
      if (!formData[key]) {
        setErrorMsg('Tous les champs sont obligatoires.');
        return;
      }
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/contact/', formData);

      if (res.data.success) {
        setSuccessMsg('✅ Votre message a été envoyé avec succès !');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        setErrorMsg(res.data.error || '❌ Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('❌ Impossible de contacter le serveur.');
    }
  };

  return (
    <div className="contact-container">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h1>Contact</h1>

        {successMsg && <p className="contact-message success">{successMsg}</p>}
        {errorMsg && <p className="contact-message error">{errorMsg}</p>}

        <div>
          <label>Nom :</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Email :</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Sujet :</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
        </div>

        <div>
          <label>Message :</label>
          <textarea name="message" value={formData.message} onChange={handleChange} required />
        </div>

        <button type="submit">Envoyer</button>
      </form>

      <div className="contact-faq">
        <h2>Pourquoi nous contacter ?</h2>
        <div className="contact-faq-item">
          <h3>Obtenir une réponse rapide</h3>
          <p>Nous nous engageons à répondre à toutes les demandes sous 24 heures ouvrables.</p>
        </div>
        <div className="contact-faq-item">
          <h3>Support personnalisé</h3>
          <p>Notre équipe vous aide à résoudre tout problème lié à vos cartes ou services.</p>
        </div>
        <div className="contact-faq-item">
          <h3>Signaler un problème</h3>
          <p>Vous pouvez signaler toute erreur ou incident pour que nous puissions agir rapidement.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
