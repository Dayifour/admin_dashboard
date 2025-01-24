"use client";

import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../api/firebase";

const InvestigatorApplication = () => {
  const [surveyId, setSurveyId] = useState("");
  const [investigatorId, setInvestigatorId] = useState("");
  const [motivation, setMotivation] = useState("");

  const applyToSurvey = async () => {
    if (!surveyId || !investigatorId || !motivation) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const applicationData = {
        surveyId,
        investigatorId,
        motivation, // Ajout de la motivation
        status: "Pending", // Par défaut
        timestamp: new Date(),
      };

      await addDoc(collection(db, "applications"), applicationData);
      alert("Votre candidature a été envoyée !");
      setSurveyId(""); // Réinitialiser le champ surveyId
      setInvestigatorId(""); // Réinitialiser le champ investigatorId
      setMotivation(""); // Réinitialiser le champ motivation
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Postuler pour une enquête</h2>

      {/* Champ pour Survey ID */}
      <input
        type="text"
        value={surveyId}
        onChange={(e) => setSurveyId(e.target.value)}
        placeholder="Entrez l'ID de l'enquête"
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Champ pour Investigator ID */}
      <input
        type="text"
        value={investigatorId}
        onChange={(e) => setInvestigatorId(e.target.value)}
        placeholder="Entrez votre ID d'enquêteur"
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Champ pour la motivation */}
      <textarea
        value={motivation}
        onChange={(e) => setMotivation(e.target.value)}
        placeholder="Entrez votre motivation pour cette enquête"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
      />

      <button
        onClick={applyToSurvey}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
      >
        Postuler
      </button>
    </div>
  );
};

export default InvestigatorApplication;
