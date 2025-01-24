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
import { db } from "../api/firebase"; // Remplacez par votre configuration Firebase

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrganizationId, setCurrentOrganizationId] = useState<
    string | null
  >(null);

  // Interface Organization
  interface Organization {
    id: string;
    name: string;
    type: string;
    location: string;
    registrationDate: string;
  }

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Références pour les champs du formulaire
  const nameRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  // Récupérer les organisations en temps réel depuis Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "organizations"),
      (snapshot) => {
        const fetchedOrganizations = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            type: data.type,
            location: data.location,
            registrationDate: data.registrationDate,
          } as Organization;
        });
        setOrganizations(fetchedOrganizations);
      }
    );

    return () => unsubscribe(); // Nettoyage de la souscription
  }, []);

  // Ouvrir/fermer le modal
  const toggleModal = () => {
    setIsOpen(!isOpen);
    setIsEditing(false); // Réinitialiser l'état d'édition lors de la fermeture
  };

  // Soumettre une organisation (ajout ou modification)
  const handleSubmitOrganization = async (e: React.FormEvent) => {
    e.preventDefault();

    const organizationData = {
      name: nameRef.current?.value || "",
      type: typeRef.current?.value || "",
      location: locationRef.current?.value || "",
      registrationDate: dateRef.current?.value || "",
    };

    if (isEditing && currentOrganizationId) {
      // Modifier une organisation existante
      await updateDoc(
        doc(db, "organizations", currentOrganizationId),
        organizationData
      );
    } else {
      // Ajouter une nouvelle organisation
      await addDoc(collection(db, "organizations"), organizationData);
    }

    toggleModal();
  };

  // Préparer le formulaire pour l'édition
  const handleEdit = (organization: Organization) => {
    setIsOpen(true);
    setIsEditing(true);
    setCurrentOrganizationId(organization.id);

    // Remplir les champs du formulaire
    if (nameRef.current) nameRef.current.value = organization.name;
    if (typeRef.current) typeRef.current.value = organization.type;
    if (locationRef.current) locationRef.current.value = organization.location;
    if (dateRef.current) dateRef.current.value = organization.registrationDate;
  };

  // Supprimer une organisation
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "organizations", id));
  };

  // Filtrer les organisations en fonction du terme de recherche
  const filteredOrganizations = organizations.filter(
    (organization) =>
      organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organization.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organization.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-8 h-full flex justify-center flex-col">
      <h1 className="text-2xl font-semibold mb-6">Gestion des Organisations</h1>
      <div className="flex items-center justify-between mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          onClick={toggleModal}
        >
          + Ajouter
        </button>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Rechercher par nom, type ou localisation..."
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
                Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Localisation
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Date d'inscription
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrganizations.map((organization) => (
              <tr
                key={organization.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {organization.name}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {organization.type}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {organization.location}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {organization.registrationDate}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <Image
                    src="/pencil.png"
                    alt="Edit"
                    width={20}
                    height={20}
                    onClick={() => handleEdit(organization)}
                    className="cursor-pointer"
                  />
                  <Image
                    src="/delete.png"
                    alt="Delete"
                    width={20}
                    height={20}
                    onClick={() => handleDelete(organization.id)}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overlay et formulaire modal */}
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
              {isEditing
                ? "Modifier une Organisation"
                : "Ajouter une Organisation"}
            </h2>
            <form onSubmit={handleSubmitOrganization}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nom :</label>
                <input
                  type="text"
                  ref={nameRef}
                  placeholder="Entrez un nom"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Type :</label>
                <input
                  type="text"
                  ref={typeRef}
                  placeholder="Type (ONG, Entreprise, ...)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Localisation :
                </label>
                <input
                  type="text"
                  ref={locationRef}
                  placeholder="Entrez la localisation"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Date d'inscription :
                </label>
                <input
                  type="date"
                  ref={dateRef}
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
