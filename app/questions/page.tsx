"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { db } from "../api/firebase";

// Interface pour les enquêtes
interface Survey {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Active" | "Completed";
}

// Interface pour les questions
interface Question {
  id: string;
  surveyId: string; // L'ID de l'enquête à laquelle la question est liée
  text: string;
  type: "text" | "multiple-choice" | "boolean";
  options?: string[]; // Options pour les questions à choix multiples
}

const Page = () => {
  // États pour les enquêtes
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSurveyId, setCurrentSurveyId] = useState<string | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // États pour les questions
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Références pour les champs du formulaire des enquêtes
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Références pour les champs du formulaire des questions
  const textRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const optionsRef = useRef<HTMLInputElement>(null);

  // Récupérer les enquêtes en temps réel depuis Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "surveys"), (snapshot) => {
      const fetchedSurveys = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Survey[];
      setSurveys(fetchedSurveys);
    });

    return () => unsubscribe();
  }, []);

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

  // Ouvrir/fermer le modal des enquêtes
  const toggleModal = () => {
    setIsOpen((prev) => !prev);
    setIsEditing(false);
    setCurrentSurveyId(null);
    resetForm();
  };

  // Ouvrir/fermer le modal des questions
  const toggleQuestionModal = () => {
    setIsQuestionModalOpen((prev) => !prev);
    setIsEditingQuestion(false);
    setCurrentQuestionId(null);
    resetQuestionForm();
  };

  // Réinitialiser le formulaire des enquêtes
  const resetForm = () => {
    if (titleRef.current) titleRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    if (startDateRef.current) startDateRef.current.value = "";
    if (endDateRef.current) endDateRef.current.value = "";
  };

  // Réinitialiser le formulaire des questions
  const resetQuestionForm = () => {
    if (textRef.current) textRef.current.value = "";
    if (typeRef.current) typeRef.current.value = "text";
    if (optionsRef.current) optionsRef.current.value = "";
  };

  // Ajouter ou modifier une enquête
  const handleSubmitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();

    const surveyData = {
      title: titleRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      startDate: startDateRef.current?.value || "",
      endDate: endDateRef.current?.value || "",
      status: "Pending",
    };

    try {
      if (isEditing && currentSurveyId) {
        await updateDoc(doc(db, "surveys", currentSurveyId), surveyData);
      } else {
        await addDoc(collection(db, "surveys"), surveyData);
      }
      toggleModal();
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  // Ajouter ou modifier une question
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    const questionData = {
      surveyId: currentSurveyId, // L'ID de l'enquête à laquelle la question est liée
      text: textRef.current?.value || "",
      type: typeRef.current?.value || "text",
      options: optionsRef.current?.value.split(",") || [],
    };

    try {
      if (isEditingQuestion && currentQuestionId) {
        await updateDoc(doc(db, "questions", currentQuestionId), questionData);
      } else {
        await addDoc(collection(db, "questions"), questionData);
      }
      toggleQuestionModal();
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  // Pré-remplir le formulaire pour l'édition d'une enquête
  const handleEdit = (survey: Survey) => {
    setIsOpen(true);
    setIsEditing(true);
    setCurrentSurveyId(survey.id);

    if (titleRef.current) titleRef.current.value = survey.title;
    if (descriptionRef.current)
      descriptionRef.current.value = survey.description;
    if (startDateRef.current) startDateRef.current.value = survey.startDate;
    if (endDateRef.current) endDateRef.current.value = survey.endDate;
  };

  // Pré-remplir le formulaire pour l'édition d'une question
  const handleEditQuestion = (question: Question) => {
    setIsQuestionModalOpen(true);
    setIsEditingQuestion(true);
    setCurrentQuestionId(question.id);

    if (textRef.current) textRef.current.value = question.text;
    if (typeRef.current) typeRef.current.value = question.type;
    if (optionsRef.current)
      optionsRef.current.value = question.options?.join(",") || "";
  };

  // Supprimer une enquête
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "surveys", id));
    } catch (error) {
      console.error("Error deleting survey:", error);
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

  // Filtrer les enquêtes en fonction du terme de recherche
  const filteredSurveys = surveys.filter((survey) =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-8 h-full flex flex-col justify-center">
      <h1 className="text-2xl font-semibold mb-6">Gestionnaires d'Enquêtes</h1>
      <div className="flex items-center justify-between mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          onClick={toggleModal}
        >
          + Ajouter une enquête
        </button>
        <input
          type="text"
          placeholder="Chercher une enquête..."
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tableau des enquêtes */}
      <div className="overflow-x-auto bg-gray-100 shadow-xl">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b">
            <tr>
              {[
                "Titre",
                "Description",
                "Date de Début",
                "Date de Fin",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left py-3 px-4 text-sm font-medium text-gray-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSurveys.map((survey) => (
              <tr
                key={survey.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {survey.title}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {survey.description}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {survey.startDate}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {survey.endDate}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {survey.status}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <Image
                    src="/pencil.png"
                    alt="Edit"
                    width={20}
                    height={20}
                    onClick={() => handleEdit(survey)}
                    className="cursor-pointer"
                  />
                  <Image
                    src="/delete.png"
                    alt="Delete"
                    width={20}
                    height={20}
                    onClick={() => handleDelete(survey.id)}
                    className="cursor-pointer"
                  />
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-lg"
                    onClick={() => setCurrentSurveyId(survey.id)}
                  >
                    Voir les questions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal pour ajouter/modifier une enquête */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-center mb-4">
              {isEditing ? "Modifier l'Enquête" : "Ajouter une Enquête"}
            </h2>
            <form onSubmit={handleSubmitSurvey}>
              {[
                { label: "Titre", ref: titleRef, type: "text" },
                { label: "Description", ref: descriptionRef, type: "text" },
                { label: "Date de Début", ref: startDateRef, type: "date" },
                { label: "Date de Fin", ref: endDateRef, type: "date" },
              ].map(({ label, ref, type }) => (
                <div className="mb-4" key={label}>
                  <label className="block text-gray-700 mb-2">{label} :</label>
                  <input
                    type={type}
                    ref={ref}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  {isEditing ? "Modifier" : "Soumettre"}
                </button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                >
                  Fermer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section des questions */}
      {currentSurveyId && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Questions de l'enquête</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mb-4"
            onClick={toggleQuestionModal}
          >
            + Ajouter une question
          </button>

          {/* Tableau des questions */}
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
                        <Image
                          src="/pencil.png"
                          alt="Edit"
                          width={20}
                          height={20}
                          onClick={() => handleEditQuestion(question)}
                          className="cursor-pointer"
                        />
                        <Image
                          src="/delete.png"
                          alt="Delete"
                          width={20}
                          height={20}
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Modal pour ajouter/modifier une question */}
          {isQuestionModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={toggleQuestionModal}
            >
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
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Type :</label>
                    <select
                      ref={typeRef}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="text">Texte</option>
                      <option value="multiple-choice">Choix multiple</option>
                      <option value="boolean">Oui/Non</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Options (séparées par des virgules) :
                    </label>
                    <input
                      type="text"
                      ref={optionsRef}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
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
      )}
    </div>
  );
};

export default Page;
