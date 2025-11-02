import React from "react";

function DisplayCardInfo({ card }) {
  return (
    <div style={{ marginTop: "20px", textAlign: "left", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
      <h3>Informations de la carte</h3>
      <p><strong>Nom :</strong> {card.name}</p>
      <p><strong>Genre :</strong> {card.genre || "Non renseigné"}</p>
      <p><strong>Rôle :</strong> {card.role || "Non renseigné"}</p>
      <p><strong>Email :</strong> {card.email || "Non renseigné"}</p>
      <p><strong>Numéro personnel :</strong> {card.personal_phone || "Non renseigné"}</p>
      <p><strong>Numéro d'urgence :</strong> {card.emergency_phone || "Non renseigné"}</p>
      <p><strong>Date de naissance :</strong> {card.birth_date || "Non renseigné"}</p>
      <p><strong>Lieu de naissance :</strong> {card.birth_place || "Non renseigné"}</p>
      <p><strong>Adresse :</strong> {card.owner_address || "Non renseigné"}</p>
      <p><strong>Émise le :</strong> {card.issued_at}</p>
      <p><strong>Valide jusqu’au :</strong> {card.expiration_date}</p>
      <p><strong>Statut :</strong> {card.valid ? "Valide" : "Expirée"}</p>
    </div>
  );
}

export default DisplayCardInfo;
