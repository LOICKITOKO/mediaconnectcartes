import React, { useState } from "react";
import axios from "axios";

function RequestForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    birth_date: "",
    email: "",
    phone: "",
    document_type: "",
    document: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/cartes/request/new/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMessage(response.data.message);
        setFormData({
          full_name: "",
          birth_date: "",
          email: "",
          phone: "",
          document_type: "",
          document: null,
        });
      } else {
        setError(response.data.error || "Erreur inconnue.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur.");
    }
  };

  return (
    <div>
      <h2>Demande de carte / document</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="full_name"
          placeholder="Nom complet"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Téléphone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <select
          name="document_type"
          value={formData.document_type}
          onChange={handleChange}
          required
        >
          <option value="">Type de document</option>
          <option value="livre">Carte livrée</option>
          <option value="passeport">Passeport</option>
          <option value="acte_naissance">Acte de naissance</option>
        </select>
        <input
          type="file"
          name="document"
          onChange={handleChange}
          required
        />
        <button type="submit">Envoyer la demande</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default RequestForm;
