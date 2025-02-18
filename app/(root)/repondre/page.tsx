"use client";

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../api/firebase";

interface Question {
  id: string;
  surveyId: string;
  text: string;
  type: "text" | "multiple-choice" | "boolean";
  options?: string[];
}

interface Answer {
  id: string;
  questionId: string;
  investigatorId: string;
  response: string | string[] | boolean;
}

interface Survey {
  id: string;
  title: string;
  investigators: string[];
}

const InvestigatorPage = () => {
  const [investigatorId, setInvestigatorId] = useState("");
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [responseInput, setResponseInput] = useState("");

  // Récupérer les enquêtes assignées
  useEffect(() => {
    if (!investigatorId) return;

    setLoading(true);
    const q = query(
      collection(db, "surveys"),
      where("investigators", "array-contains", investigatorId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const surveysData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Survey[];
      setSurveys(surveysData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [investigatorId]);

  // Récupérer les questions de l'enquête sélectionnée
  useEffect(() => {
    if (!selectedSurvey) return;

    setLoading(true);
    const q = query(
      collection(db, "questions"),
      where("surveyId", "==", selectedSurvey)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const questionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Question[];
      setQuestions(questionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedSurvey]);

  // Récupérer toutes les réponses
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "answers"), (snapshot) => {
      const answersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Answer[];
      setAnswers(answersData);
    });

    return () => unsubscribe();
  }, []);

  const hasAnswered = (questionId: string) => {
    return answers.some(
      (answer) =>
        answer.questionId === questionId &&
        answer.investigatorId === investigatorId
    );
  };

  const handleAnswerClick = (question: Question) => {
    setSelectedQuestion(question);
    setShowResponseModal(true);
    setResponseInput("");
  };

  const submitAnswer = async () => {
    if (!selectedQuestion || !investigatorId || !selectedSurvey) return;

    let response: string = responseInput; // Modification du type

    // Validation des réponses
    if (selectedQuestion.type === "boolean") {
      if (!["Oui", "Non"].includes(responseInput)) {
        alert("Veuillez sélectionner une réponse valide");
        return;
      }
    } else if (
      selectedQuestion.type === "multiple-choice" &&
      selectedQuestion.options
    ) {
      if (!selectedQuestion.options.includes(responseInput)) {
        alert("Veuillez sélectionner une option valide");
        return;
      }
    } else if (selectedQuestion.type === "text" && !responseInput.trim()) {
      alert("Veuillez entrer une réponse");
      return;
    }

    try {
      await addDoc(collection(db, "answers"), {
        surveyId: selectedSurvey,
        questionId: selectedQuestion.id,
        investigatorId,
        response, // Enregistrement direct de la chaîne
      });
      setShowResponseModal(false);
    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const renderResponseInput = () => {
    if (!selectedQuestion) return null;

    switch (selectedQuestion.type) {
      case "boolean":
        return (
          <div className="flex gap-4">
            <button
              onClick={() => setResponseInput("Oui")}
              className={`px-4 py-2 rounded-lg ${
                responseInput === "Oui"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Oui
            </button>
            <button
              onClick={() => setResponseInput("Non")}
              className={`px-4 py-2 rounded-lg ${
                responseInput === "Non"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Non
            </button>
          </div>
        );

      case "multiple-choice":
        return (
          <select
            value={responseInput}
            onChange={(e) => setResponseInput(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Sélectionnez une option</option>
            {selectedQuestion.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            value={responseInput}
            onChange={(e) => setResponseInput(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Entrez votre réponse..."
          />
        );
    }
  };

  return (
    <div className="mx-8 h-full flex flex-col justify-center">
      <h1 className="text-2xl font-semibold mb-6">Espace Enquêteur</h1>

      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Entrez votre ID enquêteur"
          className="border p-2 rounded-lg w-64"
          value={investigatorId}
          onChange={(e) => {
            setInvestigatorId(e.target.value);
            setSelectedSurvey(null);
          }}
        />

        {loading && <p className="text-gray-500">Chargement...</p>}

        {surveys.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Enquêtes assignées :</h2>
            <div className="flex flex-wrap gap-2">
              {surveys.map((survey) => (
                <button
                  key={survey.id}
                  onClick={() => setSelectedSurvey(survey.id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedSurvey === survey.id
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 hover:bg-blue-200"
                  }`}
                >
                  {survey.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedSurvey && (
        <div className="overflow-x-auto bg-gray-100 shadow-xl rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Question
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Options
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Statut
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800 text-sm">
                    {question.text}
                  </td>
                  <td className="py-3 px-4 text-gray-800 text-sm capitalize">
                    {question.type}
                  </td>
                  <td className="py-3 px-4 text-gray-800 text-sm">
                    {question.options?.join(", ") || "-"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {hasAnswered(question.id) ? (
                      <span className="text-green-600">Répondu ✓</span>
                    ) : (
                      <span className="text-red-600">En attente</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleAnswerClick(question)}
                      disabled={hasAnswered(question.id)}
                      className={`px-3 py-1 rounded-lg ${
                        hasAnswered(question.id)
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      Répondre
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showResponseModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {selectedQuestion.text}
            </h2>

            <div className="mb-4">{renderResponseInput()}</div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={submitAnswer}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={!responseInput && selectedQuestion.type !== "boolean"}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestigatorPage;
