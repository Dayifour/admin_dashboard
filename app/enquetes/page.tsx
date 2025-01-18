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

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Nouveau état pour gérer l'édition
  const [currentSurveyId, setCurrentSurveyId] = useState<string | null>(null);

  interface Survey {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
  }

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Récupération des données Firestore en temps réel
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "surveys"), (snapshot) => {
      const fetchedSurveys = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
        };
      });
      setSurveys(fetchedSurveys);
    });

    return () => unsubscribe();
  }, []);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setIsEditing(false); // Réinitialiser l'état d'édition à chaque fermeture
  };

  // Ajout ou modification d'une enquête
  const handleSubmitSurvey = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const surveyData = {
      title: titleRef.current ? titleRef.current.value : "",
      description: descriptionRef.current ? descriptionRef.current.value : "",
      startDate: startDateRef.current ? startDateRef.current.value : "",
      endDate: endDateRef.current ? endDateRef.current.value : "",
      status: "Pending",
    };

    if (isEditing && currentSurveyId) {
      // Modifier une enquête existante
      await updateDoc(doc(db, "surveys", currentSurveyId), surveyData);
    } else {
      // Ajouter une nouvelle enquête
      await addDoc(collection(db, "surveys"), surveyData);
    }

    toggleModal();
  };

  // Préparer le formulaire pour l'édition
  const handleEdit = (survey: Survey) => {
    setIsOpen(true);
    setIsEditing(true);
    setCurrentSurveyId(survey.id);

    // Remplir les champs du formulaire
    if (titleRef.current) titleRef.current.value = survey.title;
    if (descriptionRef.current)
      descriptionRef.current.value = survey.description;
    if (startDateRef.current) startDateRef.current.value = survey.startDate;
    if (endDateRef.current) endDateRef.current.value = survey.endDate;
  };

  // Suppression d'une enquête
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "surveys", id));
  };

  // Filtrage basé sur la recherche
  const filteredSurveys = surveys.filter((survey) =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-8 h-full flex justify-center flex-col">
      <h1 className="text-2xl font-semibold mb-6">Gestionnaires d'Enquêtes</h1>
      <div className="flex items-center justify-between mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          onClick={toggleModal}
        >
          + Ajouter une enquête
        </button>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Chercher une enquête..."
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-gray-100 shadow-xl">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Title
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Description
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Start Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                End Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Actions
              </th>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Titre :</label>
                <input
                  type="text"
                  placeholder="Entrez un titre"
                  ref={titleRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Description :
                </label>
                <input
                  type="text"
                  placeholder="Entrez une description"
                  ref={descriptionRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Date de Début :
                </label>
                <input
                  type="date"
                  ref={startDateRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Date de Fin :
                </label>
                <input
                  type="date"
                  ref={endDateRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
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
    </div>
  );
};

export default Page;
