"use client";
import Image from "next/image";
import { useState } from "react";

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  // Données initiales pour les organisations
  const initialOrganizations = [
    {
      id: 1,
      name: "Red Cross",
      type: "ONG",
      location: "Geneva, Switzerland",
      registrationDate: "2005-06-15",
    },
    {
      id: 2,
      name: "TechCorp",
      type: "Entreprise",
      location: "San Francisco, USA",
      registrationDate: "2018-09-22",
    },
    {
      id: 3,
      name: "Green Future",
      type: "ONG",
      location: "Berlin, Germany",
      registrationDate: "2012-03-10",
    },
  ];

  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id: number) => {
    const updatedOrganizations = organizations.filter(
      (organization) => organization.id !== id
    );
    setOrganizations(updatedOrganizations);
  };

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
                  <Image src="/pencil.png" alt="Edit" width={20} height={20} />
                  <Image
                    src="/delete.png"
                    alt="Delete"
                    width={20}
                    height={20}
                    onClick={() => handleDelete(organization.id)}
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
                <label className="block text-gray-700 mb-2">Nom :</label>
                <input
                  type="text"
                  placeholder="Entrez un nom"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Type :</label>
                <input
                  type="text"
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
                  placeholder="Entrez la localisation"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date d'inscription :</label>
                <input
                  type="date"
                  placeholder="Entrez la date d'inscription"
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
