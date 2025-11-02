import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h1>Contact</h1>
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default Contact;
