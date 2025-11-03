import React from "react";

function DisplayCardInfo({ card }) {
  return (
    <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
      <h3>{card.name}</h3>
      <p><strong>Carte d’accréditation virtuelle</strong></p>
      <p>Bienvenue ! Ceci est la carte d'identité virtuelle permettant d'identifier le propriétaire. Toutes les informations personnelles sont protégées et visibles uniquement après saisie du code secret.</p>
      <p><strong>Nom complet:</strong> {card.name}</p>
      <p><strong>Genre:</strong> {card.genre}</p>
      <p><strong>Rôle:</strong> {card.role || "Non renseigné"}</p>
      <p><strong>Email:</strong> {card.email}</p>
      <p><strong>Numéro personnel:</strong> {card.personal_phone}</p>
      <p><strong>Numéro d'urgence:</strong> {card.emergency_phone}</p>
      <p><strong>Date / lieu de naissance:</strong> {card.birth_date} / {card.birth_place}</p>
      <p><strong>Adresse:</strong> {card.owner_address}</p>
      <p><strong>Émise le:</strong> {card.issued_at}</p>
      <p><strong>Valide jusqu’au:</strong> {card.expiration_date}</p>
      <p><strong>Statut:</strong> {card.valid ? "Valide" : "Non valide"}</p>
    </div>
  );
}

export default DisplayCardInfo;
