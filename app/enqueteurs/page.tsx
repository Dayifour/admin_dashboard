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
import { db } from "../api/firebase"; // Remplacez par le chemin de votre configuration Firebase

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Pour différencier ajout/édition
  const [currentInvestigatorId, setCurrentInvestigatorId] = useState<
    string | null
  >(null);

  interface Investigator {
    id: string;
    name: string;
    email: string;
    location: string;
    phone: number | null;
    completed: number;
    active: number;
  }

  const [investigators, setInvestigators] = useState<Investigator[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Références pour les champs du formulaire
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Récupérer les enquêteurs en temps réel depuis Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "investigators"),
      (snapshot) => {
        const fetchedInvestigators = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            email: data.email,
            location: data.location,
            phone: data.phone,
            completed: data.completed,
            active: data.active,
          };
        });
        setInvestigators(fetchedInvestigators);
      }
    );

    return () => unsubscribe(); // Nettoyage de la souscription
  }, []);

  // Ouvrir/fermer le modal
  const toggleModal = () => {
    setIsOpen(!isOpen);
    setIsEditing(false); // Réinitialiser l'état d'édition lors de la fermeture
  };

  // Soumettre un enquêteur (ajout ou modification)
  const handleSubmitInvestigator = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();

    const investigatorData = {
      name: nameRef.current?.value || "",
      email: emailRef.current?.value || "",
      location: locationRef.current?.value || "",
      phone: parseInt(phoneRef.current?.value || "0"),
      completed: 0, // Par défaut
      active: 0, // Par défaut
    };

    if (isEditing && currentInvestigatorId) {
      // Modifier un enquêteur existant
      await updateDoc(
        doc(db, "investigators", currentInvestigatorId),
        investigatorData
      );
    } else {
      // Ajouter un nouvel enquêteur
      await addDoc(collection(db, "investigators"), investigatorData);
    }

    toggleModal();
  };

  // Préparer le formulaire pour l'édition
  const handleEdit = (investigator: Investigator) => {
    setIsOpen(true);
    setIsEditing(true);
    setCurrentInvestigatorId(investigator.id);

    // Remplir les champs du formulaire
    if (nameRef.current) nameRef.current.value = investigator.name;
    if (emailRef.current) emailRef.current.value = investigator.email;
    if (locationRef.current) locationRef.current.value = investigator.location;
    if (phoneRef.current)
      phoneRef.current.value = investigator.phone ? investigator.phone.toString() : "";
  };

  // Supprimer un enquêteur
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "investigators", id));
  };

  // Filtrer les enquêteurs en fonction du terme de recherche
  const filteredInvestigators = investigators.filter(
    (investigator: any) =>
      investigator.name &&
      investigator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-8 h-full flex justify-center flex-col">
      <h1 className="text-2xl font-semibold mb-6">Gestion des Enquêteurs</h1>
      <div className="flex items-center justify-between mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          onClick={toggleModal}
        >
          + Ajouter un enquêteur
        </button>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
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
                Nom
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Localisation
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Tel
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Completed
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Active
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInvestigators.map((investigator) => (
              <tr
                key={investigator.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {investigator.name}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {investigator.email}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {investigator.location}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {investigator.phone}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {investigator.completed}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {investigator.active}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <Image
                    src="/pencil.png"
                    alt="Edit"
                    width={20}
                    height={20}
                    onClick={() => handleEdit(investigator)}
                    className="cursor-pointer"
                  />
                  <Image
                    src="/delete.png"
                    alt="Delete"
                    width={20}
                    height={20}
                    onClick={() => handleDelete(investigator.id)}
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
              {isEditing ? "Modifier un Enquêteur" : "Ajouter un Enquêteur"}
            </h2>
            <form onSubmit={handleSubmitInvestigator}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nom :</label>
                <input
                  type="text"
                  placeholder="Entrez un nom"
                  ref={nameRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email :</label>
                <input
                  type="email"
                  placeholder="Entrez un email"
                  ref={emailRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Localisation :
                </label>
                <input
                  type="text"
                  placeholder="Entrez une localisation"
                  ref={locationRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone :</label>
                <input
                  type="number"
                  placeholder="Entrez une localisation"
                  ref={phoneRef}
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
