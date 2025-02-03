import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/app/api/firebase"; // Assurez-vous d'importer correctement votre configuration Firebase

const SurveyTable = () => {
  interface Survey {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
  }

  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      const querySnapshot = await getDocs(collection(db, "surveys"));
      const surveyList = querySnapshot.docs.map((doc) => {
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
      setSurveys(surveyList);
    };

    fetchSurveys();
  }, []);

  const getStatusClasses = (status: string): string => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full";
      case "Closed":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl mt-5">
      <h2 className="text-lg font-bold mb-4">Recent Surveys</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 font-medium text-gray-700">
                Title
              </th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">
                Description
              </th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">
                Start Date
              </th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">
                End Date
              </th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr
                key={survey.id}
                className="border-b hover:bg-gray-300 transition-colors"
              >
                <td className="py-2 px-4 text-gray-800">{survey.title}</td>
                <td className="py-2 px-4 text-gray-800">
                  {survey.description}
                </td>
                <td className="py-2 px-4 text-gray-800">{survey.startDate}</td>
                <td className="py-2 px-4 text-gray-800">{survey.endDate}</td>
                <td className="py-2 px-4">
                  <span className={getStatusClasses(survey.status)}>
                    {survey.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurveyTable;
