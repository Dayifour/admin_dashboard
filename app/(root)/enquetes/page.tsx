"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { db } from "../../api/firebase";

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSurveyId, setCurrentSurveyId] = useState<string | null>(null);

  interface Survey {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: "Pending" | "Active" | "Completed"; // Statuts définis
  }

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Fetch data in real-time from Firestore
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

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
    setIsEditing(false);
    setCurrentSurveyId(null);
    resetForm();
  };

  const resetForm = () => {
    if (titleRef.current) titleRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    if (startDateRef.current) startDateRef.current.value = "";
    if (endDateRef.current) endDateRef.current.value = "";
  };

  // Add or update a survey
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

  const handleEdit = (survey: Survey) => {
    setIsOpen(true);
    setIsEditing(true);
    setCurrentSurveyId(survey.id);

    // Pre-fill the form fields
    if (titleRef.current) titleRef.current.value = survey.title;
    if (descriptionRef.current)
      descriptionRef.current.value = survey.description;
    if (startDateRef.current) startDateRef.current.value = survey.startDate;
    if (endDateRef.current) endDateRef.current.value = survey.endDate;
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "surveys", id));
    } catch (error) {
      console.error("Error deleting survey:", error);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "Pending" | "Active" | "Completed"
  ) => {
    try {
      // Récupérer l'enquête pour obtenir les enquêteurs liés
      const surveyRef = doc(db, "surveys", id);
      const surveyDoc = await getDoc(surveyRef);

      if (!surveyDoc.exists()) {
        console.error("Enquête introuvable !");
        return;
      }

      const surveyData = surveyDoc.data();
      const linkedInvestigators = surveyData.investigators || []; // Liste des enquêteurs liés

      // Mettre à jour le statut de l'enquête
      await updateDoc(surveyRef, { status: newStatus });

      // Modifier les clés "completed" et "active" pour les enquêteurs
      for (const investigatorId of linkedInvestigators) {
        const investigatorRef = doc(db, "investigators", investigatorId);
        const investigatorDoc = await getDoc(investigatorRef);

        if (investigatorDoc.exists()) {
          const currentData = investigatorDoc.data();
          const currentCompleted = currentData.completed || 0;
          const currentActive = currentData.active || 0;

          if (newStatus === "Completed") {
            // Incrémenter "completed" et décrémenter "active"
            await updateDoc(investigatorRef, {
              completed: currentCompleted + 1,
              active: Math.max(0, currentActive - 1), // Évite des valeurs négatives
            });
          } else if (newStatus === "Active") {
            // Décrémenter "completed" et incrémenter "active"
            await updateDoc(investigatorRef, {
              completed: Math.max(0, currentCompleted - 1), // Évite des valeurs négatives
              active: currentActive + 1,
            });
          }
        }
      }

      alert("Le statut et les enquêteurs ont été mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

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
                "Changer le Statut",
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
                <td className="py-3 px-4 text-gray-800 text-sm">
                  <button
                    onClick={() => handleStatusChange(survey.id, "Active")}
                    className="text-green-500 hover:underline"
                  >
                    Activer
                  </button>
                  <button
                    onClick={() => handleStatusChange(survey.id, "Completed")}
                    className="text-blue-500 hover:underline"
                  >
                    Compléter
                  </button>
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
    </div>
  );
};

export default Page;
