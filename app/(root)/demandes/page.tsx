"use client";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../api/firebase";

const AdminApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    // Récupérer les demandes en temps réel
    const unsubscribe = onSnapshot(
      collection(db, "applications"),
      (snapshot) => {
        const fetchedApplications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(fetchedApplications);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleApplicationDecision = async (
    applicationId: string,
    decision: "Accepted" | "Rejected"
  ) => {
    try {
      const applicationRef = doc(db, "applications", applicationId);
      await updateDoc(applicationRef, { status: decision });

      if (decision === "Accepted") {
        const application = applications.find(
          (app) => app.id === applicationId
        );
        if (application) {
          const surveyRef = doc(db, "surveys", application.surveyId);
          const surveyDoc = await getDoc(surveyRef);

          if (surveyDoc.exists()) {
            const currentInvestigators = surveyDoc.data().investigators || [];
            await updateDoc(surveyRef, {
              investigators: [
                ...currentInvestigators,
                application.investigatorId,
              ],
            });
          }
        }

        //////////////////
        const investigatorRef = doc(
          db,
          "investigators",
          application.investigatorId
        );
        const investigatorDoc = await getDoc(investigatorRef);

        if (investigatorDoc.exists()) {
          const currentData = investigatorDoc.data();
          const currentActive = currentData.active || 0;

          if (decision === "Accepted") {
            // Décrémenter "completed" et incrémenter "active"
            await updateDoc(investigatorRef, {
              active: currentActive + 1,
            });
          }
        }
      }
      /////////////////

      alert(
        `La demande a été ${
          decision === "Accepted" ? "acceptée" : "rejetée"
        } avec succès !`
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la demande :", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des demandes</h1>
      <div className="overflow-x-auto bg-gray-100 shadow-md rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Enquêteur ID",
                "Enquête ID",
                "Motivation",
                "Statut",
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
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {app.investigatorId}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {app.surveyId}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm italic">
                  {app.motivation}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {app.status}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() =>
                      handleApplicationDecision(app.id, "Accepted")
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() =>
                      handleApplicationDecision(app.id, "Rejected")
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Rejeter
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApplications;
