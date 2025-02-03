"use client";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../api/firebase";

interface Question {
  id: string;
  surveyId: string;
  text: string;
  type: "text" | "multiple-choice" | "boolean";
  options?: string[];
}

interface Survey {
  id: string;
  title: string;
  status: "Pending" | "Active" | "Completed";
}

const QuestionsPage = () => {
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [currentSurveyId, setCurrentSurveyId] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<
    "text" | "multiple-choice" | "boolean"
  >("text");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const textRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLInputElement>(null);

  // Récupérer les enquêtes actives en temps réel depuis Firestore
  useEffect(() => {
    const q = query(collection(db, "surveys"), where("status", "==", "Active"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSurveys = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Survey[];
      setSurveys(fetchedSurveys);
    });
    return () => unsubscribe();
  }, []);

  // Récupérer les questions liées à une enquête en temps réel depuis Firestore
  useEffect(() => {
    if (!currentSurveyId) return;

    const unsubscribe = onSnapshot(
      query(collection(db, "questions"), where("surveyId", "==", currentSurveyId)),
      (snapshot) => {
        const fetchedQuestions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Question[];
        setQuestions(fetchedQuestions);
      }
    );

    return () => unsubscribe();
  }, [currentSurveyId]);

  // Ouvrir/fermer le modal des questions
  const toggleQuestionModal = () => {
    setIsQuestionModalOpen((prev) => !prev);
    setIsEditingQuestion(false);
    setCurrentQuestionId(null);
    resetQuestionForm();
  };

  // Réinitialiser le formulaire des questions
  const resetQuestionForm = () => {
    if (textRef.current) textRef.current.value = "";
    if (optionsRef.current) optionsRef.current.value = "";
    setQuestionType("text");
  };

  // Ajouter ou modifier une question
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSurveyId) {
      alert("Veuillez sélectionner une enquête avant d'ajouter une question.");
      return;
    }

    const questionData: Partial<Question> = {
      surveyId: currentSurveyId,
      text: textRef.current?.value || "",
      type: questionType,
    };

    if (questionType === "multiple-choice") {
      questionData.options =
        optionsRef.current?.value.split(",").map((o) => o.trim()) || [];
    }

    try {
      if (isEditingQuestion && currentQuestionId) {
        await updateDoc(doc(db, "questions", currentQuestionId), questionData);
      } else {
        await addDoc(collection(db, "questions"), questionData);
      }

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000); // Masquer après 3 secondes
      toggleQuestionModal();
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Erreur lors de l'enregistrement de la question.");
    }
  };

  // Pré-remplir le formulaire pour l'édition d'une question
  const handleEditQuestion = (question: Question) => {
    setIsQuestionModalOpen(true);
    setIsEditingQuestion(true);
    setCurrentQuestionId(question.id);
    setQuestionType(question.type);
    if (textRef.current) textRef.current.value = question.text;
    if (optionsRef.current && question.type === "multiple-choice") {
      optionsRef.current.value = question.options?.join(", ") || "";
    }
  };

  // Supprimer une question
  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteDoc(doc(db, "questions", id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  // Sélectionner une enquête active
  const handleSelectSurvey = (surveyId: string) => {
    setCurrentSurveyId(surveyId);
  };

  return (
    <div className="mx-8 h-full flex flex-col justify-center">
      <h1 className="text-2xl font-semibold mb-6">Gestion des Questions</h1>

      {/* Message de succès */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
          Question enregistrée avec succès !
        </div>
      )}

      {/* Liste des enquêtes actives */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Enquêtes Actives</h2>
        <ul>
          {surveys.map((survey) => (
            <li
              key={survey.id}
              className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
                currentSurveyId === survey.id ? "bg-gray-200" : ""
              }`}
              onClick={() => handleSelectSurvey(survey.id)}
            >
              {survey.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Bouton pour ajouter une question si une enquête est sélectionnée */}
      {currentSurveyId && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mb-6"
          onClick={toggleQuestionModal}
        >
          + Ajouter une question
        </button>
      )}

      {/* Tableau des questions */}
      {currentSurveyId && (
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
              {questions.map((question) => (
                <tr
                  key={question.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-800 text-sm">
                    {question.text}
                  </td>
                  <td className="py-3 px-4 text-gray-800 text-sm capitalize">
                    {question.type}
                  </td>
                  <td className="py-3 px-4 text-gray-800 text-sm">
                    {question.options?.join(", ") || "-"}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg"
                      onClick={() => handleEditQuestion(question)}
                    >
                      Modifier
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-lg"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal pour ajouter/modifier une question */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-center mb-4">
              {isEditingQuestion
                ? "Modifier la Question"
                : "Ajouter une Question"}
            </h2>
            <form onSubmit={handleSubmitQuestion}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Texte :</label>
                <input
                  type="text"
                  ref={textRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Type :</label>
                <select
                  value={questionType}
                  onChange={(e) =>
                    setQuestionType(e.target.value as any)
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="text">Texte</option>
                  <option value="multiple-choice">Choix multiple</option>
                  <option value="boolean">Oui/Non</option>
                </select>
              </div>
              {questionType === "multiple-choice" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Options (séparées par des virgules) :
                  </label>
                  <input
                    type="text"
                    ref={optionsRef}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              )}
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  {isEditingQuestion ? "Modifier" : "Soumettre"}
                </button>
                <button
                  type="button"
                  onClick={toggleQuestionModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                >
                  Fermer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;