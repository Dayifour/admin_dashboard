"use client";
import Image from "next/image";
import { useState } from "react";

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  // Données initiales correspondant à celles de l'image
  const initialInvestigators = [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      location: "Paris, France",
      completed: 25,
      active: 3,
      photo: null, // Pas de photo pour le moment
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      location: "Lyon, France",
      completed: 12,
      active: 2,
      photo: null,
    },
    {
      id: 3,
      name: "Charlie",
      email: "charlie@example.com",
      location: "Marseille, France",
      completed: 8,
      active: 1,
      photo: null,
    },
    {
      id: 4,
      name: "Issa",
      email: "issa@gmail.com",
      location: "Segou",
      completed: 0,
      active: 0,
      photo: null,
    },
  ];

  const [investigators, setInvestigators] = useState(initialInvestigators);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id: number) => {
    const updatedInvestigators = investigators.filter(
      (investigator) => investigator.id !== id
    );
    setInvestigators(updatedInvestigators);
  };

  const filteredInvestigators = investigators.filter((investigator) =>
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
          <button className="bg-black text-white px-4 py-2 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-gray-800">
            <Image src="/file.png" alt="Search" width={20} height={20} />
            Exporter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-gray-100 shadow-xl">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Photo
              </th>
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
                Complétés
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                Actifs
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
                {/* Photo ou icône utilisateur */}
                <td className="py-3 px-4">
                  {investigator.photo ? (
                    <Image
                      src={investigator.photo}
                      alt={investigator.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">👤</span>
                    </div>
                  )}
                </td>
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
                  {investigator.completed}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {investigator.active}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <Image src="/pencil.png" alt="Edit" width={20} height={20} />
                  <Image
                    src="/delete.png"
                    alt="Delete"
                    width={20}
                    height={20}
                    onClick={() => handleDelete(investigator.id)}
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
              Ajouter une Enquête
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Titre :</label>
                <input
                  type="text"
                  placeholder="Entrez un titre"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">email :</label>
                <input
                  type="email"
                  placeholder="Entre un email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Localisation :
                </label>
                <input
                  type="text"
                  placeholder="Entrez la localisation"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Soumettre
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
