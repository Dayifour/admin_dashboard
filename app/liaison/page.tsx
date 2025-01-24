"use client";

import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../api/firebase";

const LinkSurveyToInvestigators = () => {
  interface Survey {
    id: string;
    title: string;
    // Add other properties if needed
  }
  
  const [surveys, setSurveys] = useState<Survey[]>([]);
  interface Investigator {
    id: string;
    name: string;
    // Add other properties if needed
  }
  
  const [investigators, setInvestigators] = useState<Investigator[]>([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [selectedInvestigators, setSelectedInvestigators] = useState<string[]>(
    []
  );

  useEffect(() => {
    // Fetch surveys
    const unsubscribeSurveys = onSnapshot(
      collection(db, "surveys"),
      (snapshot) => {
        const fetchedSurveys = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSurveys(fetchedSurveys);
      }
    );

    // Fetch investigators
    const unsubscribeInvestigators = onSnapshot(
      collection(db, "investigators"),
      (snapshot) => {
        const fetchedInvestigators = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            // Add other properties if needed
          };
        });
        setInvestigators(fetchedInvestigators);
      }
    );

    return () => {
      unsubscribeSurveys();
      unsubscribeInvestigators();
    };
  }, []);

  const handleSurveySelect = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    const survey = surveys.find((survey) => survey.id === surveyId);
    setSelectedInvestigators(survey?.investigators || []);
  };

  const handleInvestigatorToggle = (investigatorId: string) => {
    setSelectedInvestigators((prev) =>
      prev.includes(investigatorId)
        ? prev.filter((id) => id !== investigatorId)
        : [...prev, investigatorId]
    );
  };

  const handleSave = async () => {
    if (!selectedSurveyId) return;

    try {
      await updateDoc(doc(db, "surveys", selectedSurveyId), {
        investigators: selectedInvestigators,
      });
      alert("Associations mises à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <div className="mx-8 h-full flex flex-col justify-center">
      <h1 className="text-2xl font-semibold mb-6">
        Lier Enquêtes et Enquêteurs
      </h1>

      {/* Selection de l'enquête */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Sélectionnez une enquête :
        </label>
        <select
          className="w-full px-4 py-2 border rounded-lg"
          value={selectedSurveyId || ""}
          onChange={(e) => handleSurveySelect(e.target.value)}
        >
          <option value="" disabled>
            -- Choisissez une enquête --
          </option>
          {surveys.map((survey) => (
            <option key={survey.id} value={survey.id}>
              {survey.title}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des enquêteurs */}
      {selectedSurveyId && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Enquêteurs disponibles :
          </h2>
          <ul className="space-y-2">
            {investigators.map((investigator) => (
              <li key={investigator.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedInvestigators.includes(investigator.id)}
                  onChange={() => handleInvestigatorToggle(investigator.id)}
                />
                <span>{investigator.name}</span>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSave}
          >
            Enregistrer
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkSurveyToInvestigators;
