"use client";

import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../api/firebase";

// Interface pour les questions
interface Question {
  id: string;
  surveyId: string; // L'ID de l'enquête à laquelle la question est liée
  text: string;
  type: "text" | "multiple-choice" | "boolean";
  options?: string[]; // Options pour les questions à choix multiples
}

// Interface pour les réponses
interface Answer {
  id: string;
  surveyId: string; // ID de l'enquête
  questionId: string; // ID de la question
  investigatorId: string; // ID de l'enquêteur
  response: string | string[] | boolean; // Réponse (texte, choix multiple, ou booléen)
}

const AnswerPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentSurveyId, setCurrentSurveyId] = useState<string | null>(null);
  const [currentInvestigatorId, setCurrentInvestigatorId] = useState<
    string | null
  >(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Récupérer les questions en temps réel depuis Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "questions"), (snapshot) => {
      const fetchedQuestions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Question[];
      setQuestions(fetchedQuestions);
    });

    return () => unsubscribe();
  }, []);

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

  // Vérifier si un enquêteur peut répondre à une question
  const canAnswerQuestion = (investigatorId: string, questionId: string) => {
    const hasAnswered = answers.some(
      (answer) =>
        answer.questionId === questionId &&
        answer.investigatorId === investigatorId
    );
    return !hasAnswered;
  };

  // Soumettre une réponse
  const handleSubmitAnswer = async (
    questionId: string,
    response: string | string[] | boolean
  ) => {
    if (!currentInvestigatorId || !currentSurveyId) {
      alert("Vous devez être connecté pour répondre à une question.");
      return;
    }

    if (!canAnswerQuestion(currentInvestigatorId, questionId)) {
      alert("Vous avez déjà répondu à cette question.");
      return;
    }

    const answerData = {
      surveyId: currentSurveyId,
      questionId,
      investigatorId: currentInvestigatorId,
      response,
    };

    try {
      await addDoc(collection(db, "answers"), answerData);
      alert("Réponse soumise avec succès !");
    } catch (error) {
      console.error("Erreur lors de la soumission de la réponse :", error);
    }
  };

  return (
    <div className="mx-8 h-full flex flex-col justify-center">
      <h1 className="text-2xl font-semibold mb-6">Répondre aux Questions</h1>

      {/* Liste des questions */}
      <div className="overflow-x-auto bg-gray-100 shadow-xl">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Texte
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Options
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {questions
              .filter((question) => question.surveyId === currentSurveyId)
              .map((question) => (
                <tr
                  key={question.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-800 text-sm">
                    {question.text}
                  </td>
                  <td className="py-3 px-4 text-gray-800 text-sm">
                    {question.type}
                  </td>
                  <td className="py-3 px-4 text-gray-800 text-sm">
                    {question.options?.join(", ")}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-lg"
                      onClick={() => {
                        const response = prompt("Entrez votre réponse :");
                        if (response) {
                          handleSubmitAnswer(question.id, response);
                        }
                      }}
                    >
                      Répondre
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnswerPage;
