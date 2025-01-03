"use client";
import Image from "next/image";
import { useState } from "react";

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  // Données locales
  const initialSurveys = [
    {
      id: 1,
      title: "Satisfaction client",
      description: "Enquête annuelle auprès des clients",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "Active",
    },
    {
      id: 2,
      title: "Employee Engagement",
      description: "Monthly employee feedback survey",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      status: "Pending",
    },
    {
      id: 3,
      title: "Product Feedback",
      description: "Quarterly product feedback survey",
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      status: "Closed",
    },
  ];

  const [surveys, setSurveys] = useState(initialSurveys);
  const [searchTerm, setSearchTerm] = useState("");

  // Classes dynamiques pour les statuts
  const getStatusClasses = (status: string): string => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-lg";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg";
      case "Closed":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-lg";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-lg";
    }
  };

  // Gestion de la suppression
  const handleDelete = (id: number) => {
    const updatedSurveys = surveys.filter((survey) => survey.id !== id);
    setSurveys(updatedSurveys);
  };

  // Filtrage basé sur la recherche
  const filteredSurveys = surveys.filter((survey) =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-8 h-full flex justify-center flex-col">
      <h1 className="text-2xl font-semibold mb-6">Gestionnaires d'Enquêtes</h1>
      <div className="flex items-center justify-between mb-6">
        {/* Bouton Ajouter */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          onClick={toggleModal}
        >
          + Ajouter une enquête
        </button>

        {/* Barre de Recherche */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Chercher une enquête..."
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

      {/* Table */}
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
                Status
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
                <td className="py-3 px-4">
                  <span className={getStatusClasses(survey.status)}>
                    {survey.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <Image src="/pencil.png" alt="Edit" width={20} height={20} />
                  <Image
                    src="/delete.png"
                    alt="Edit"
                    width={20}
                    height={20}
                    onClick={() => handleDelete(survey.id)}
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
                <label className="block text-gray-700 mb-2">
                  Description :
                </label>
                <input
                  type="text"
                  placeholder="Entrez une description"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Date de Debut :
                </label>
                <input
                  type="date"
                  placeholder="Entrez une date de début"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Date de Fin :
                </label>
                <input
                  type="date"
                  placeholder="Entrez une date de fin"
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
