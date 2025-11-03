import React, { useState } from "react";
import DisplayCardInfo from "./DisplayCardInfo";

function VerifyCard() {
  const [cardId, setCardId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [cardData, setCardData] = useState(null);
  const [cardPreview, setCardPreview] = useState(null); // pour afficher photo et nom avant code
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fonction pour juste récupérer la preview (photo, nom, urgence)
  const handlePreview = async (e) => {
    e.preventDefault();
    setError("");
    setCardPreview(null);

    if (!cardId) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/cartes/verify/?card=${cardId}`);
      const data = await response.json();

      if (data.success) {
        setCardPreview(data.card);
      } else {
        setError(data.error || "Carte introuvable.");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur pour la preview.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/cartes/verify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_id: cardId, access_code: accessCode }),
      });

      const data = await response.json();

      if (data.success) {
        setCardData(data.card);
      } else {
        setCardData(null);
        setError(data.error || "Code incorrect ou erreur inconnue.");
      }
    } catch (err) {
      setCardData(null);
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 820, margin: "20px auto", padding: 20 }}>
      <h2>Vérification de carte</h2>

      <form onSubmit={handlePreview} style={{ marginBottom: 18, display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="text"
          placeholder="ID de la carte (ex: MC-2025-0001)"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          required
          style={{ padding: 8, width: 260 }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>Prévisualiser</button>
      </form>

      <form onSubmit={handleVerify} style={{ marginBottom: 18, display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="password"
          placeholder="Code secret"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          required
          style={{ padding: 8, width: 200 }}
        />
        <button type="submit" style={{ padding: "8px 12px" }} disabled={loading}>
          {loading ? "Vérification..." : "Vérifier"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      {/* Carte preview box */}
      {(cardPreview || cardData) && (
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            border: "1px solid #e0e0e0",
            padding: 18,
            borderRadius: 10,
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            minHeight: 220,
          }}
        >
          {/* Left column: photo + name + emergency */}
          <div style={{ width: 180, textAlign: "center" }}>
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: 8,
                overflow: "hidden",
                background: "#f4f4f4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={(cardPreview || cardData)?.photo || ""}
                alt="Photo"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
              />
              {!((cardPreview || cardData)?.photo) && <div style={{ color: "#888" }}>Photo</div>}
            </div>

            {/* Nom / Prénoms */}
            <div style={{ marginTop: 10, fontWeight: 700, fontSize: 16 }}>
              {(cardPreview || cardData)?.name || "Nom Prénom"}
            </div>

            {/* Numéro d'urgence */}
            <div style={{ marginTop: 8, fontSize: 13, color: "#444" }}>
              <strong>Urgence:</strong> {(cardPreview || cardData)?.emergency_phone || "—"}
            </div>
          </div>

          {/* Right column: explanatory text + private info */}
          <div style={{ flex: 1 }}>
            <p style={{ marginTop: 0, marginBottom: 8 }}>
              <strong>Carte d’accréditation virtuelle</strong>
            </p>
            <p style={{ marginTop: 0, color: "#555" }}>
              Ceci est une carte de vérification virtuelle en relation avec l'État
              et Cartes Connect ID. Veuillez saisir le code secret pour accéder
              aux données personnelles.
            </p>
            <div style={{ marginTop: 12 }}>
              {cardData ? (
                <DisplayCardInfo card={cardData} />
              ) : (
                <div style={{ color: "#888", padding: 12, borderRadius: 8, border: "1px dashed #eee" }}>
                  Les informations personnelles seront affichées ici après saisie du code.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyCard;
