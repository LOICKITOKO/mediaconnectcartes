import React, { useState } from "react";
import DisplayCardInfo from "./DisplayCardInfo";

function VerifyCard() {
  const [cardId, setCardId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [cardData, setCardData] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setCardData(null);

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
        setError(data.error || "Erreur inconnue.");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Vérifier une carte</h2>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="ID de la carte"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="password"
          placeholder="Code secret"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          required
        />
        <button type="submit" style={{ marginLeft: "10px" }}>Vérifier</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {cardData && <DisplayCardInfo card={cardData} />}
    </div>
  );
}

export default VerifyCard;
