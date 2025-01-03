import { useState } from "react";

const ModalForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Bouton pour ouvrir le formulaire */}
      <button
        onClick={toggleModal}
        className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-500"
      >
        Ouvrir le formulaire
      </button>

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
            <h2 className="text-2xl font-bold text-center mb-4">Formulaire</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nom :</label>
                <input
                  type="text"
                  placeholder="Entrez votre nom"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email :</label>
                <input
                  type="email"
                  placeholder="Entrez votre email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Message :</label>
                <textarea
                  placeholder="Votre message"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={4}
                ></textarea>
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

export default ModalForm;
