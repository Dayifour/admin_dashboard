"use client";

import { collection, doc, onSnapshot, updateDoc, runTransaction } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../api/firebase";

const LinkSurveyToInvestigators = () => {
  interface Survey {
    id: string;
    title: string;
    investigators?: string[];
    // Add other properties if needed
  }

  const [surveys, setSurveys] = useState<Survey[]>([]);
  interface Investigator {
    id: string;
    name: string;
    email: string;
    location: string;
    completed: number;
    active: number;
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
        const fetchedSurveys = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            investigators: data.investigators || [],
          };
        });
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
            email: data.email,
            location: data.location,
            completed: data.completed,
            active: data.active,
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
      await runTransaction(db, async (transaction) => {
        // Update the survey
        const surveyRef = doc(db, "surveys", selectedSurveyId);
        transaction.update(surveyRef, {
          investigators: selectedInvestigators,
        });

        // Increment the "active" key for the selected investigators
        const incrementedIds = new Set(selectedInvestigators); // To avoid duplicate increments
        for (const investigatorId of selectedInvestigators) {
          const investigatorRef = doc(db, "investigators", investigatorId);
          const investigatorDoc = await transaction.get(investigatorRef);

          if (investigatorDoc.exists()) {
            const currentActive = investigatorDoc.data().active || 0;
            if (!incrementedIds.has(investigatorId)) {
              incrementedIds.add(investigatorId);
              transaction.update(investigatorRef, { active: currentActive + 1 });
            }
          }
        }
      });

      alert("Associations mises à jour avec succès et clés actives incrémentées !");
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
