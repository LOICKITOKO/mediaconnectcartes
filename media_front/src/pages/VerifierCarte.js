import React from 'react';
import { useParams } from 'react-router-dom';

const VerifierCarte = () => {
  const { cardId } = useParams();

  return (
    <div>
      <h1>Vérification de la carte</h1>
      <p>Card ID : {cardId}</p>
    </div>
  );
};

export default VerifierCarte;
