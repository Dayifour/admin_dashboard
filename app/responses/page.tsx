"use client";

import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../api/firebase";

// Interface pour les réponses
interface Answer {
  id: string;
  surveyId: string; // ID de l'enquête
  questionId: string; // ID de la question
  investigatorId: string; // ID de l'enquêteur
  response: string | string[] | boolean; // Réponse (texte, choix multiple, ou booléen)
}

const AnswersPage = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Récupérer les réponses en temps réel depuis Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "answers"), (snapshot) => {
      const fetchedAnswers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Answer[];
      setAnswers(fetchedAnswers);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mx-8 h-full flex flex-col justify-center">
      <h1 className="text-2xl font-semibold mb-6">Gestion des Réponses</h1>

      {/* Tableau des réponses */}
      <div className="overflow-x-auto bg-gray-100 shadow-xl">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                ID Enquête
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                ID Question
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                ID Enquêteur
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Réponse
              </th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer) => (
              <tr
                key={answer.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {answer.surveyId}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {answer.questionId}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {answer.investigatorId}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {answer.response}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnswersPage;
