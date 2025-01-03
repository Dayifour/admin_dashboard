const SurveyTable = () => {
  // Données locales pour la table
  const surveys = [
    {
      title: "Customer Satisfaction",
      description: "Annual customer feedback survey",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "Active",
    },
    {
      title: "Employee Engagement",
      description: "Quarterly employee feedback survey",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      status: "Pending",
    },
    {
      title: "Market Trends",
      description: "Research on current market trends",
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      status: "Closed",
    },
  ];

  // Fonction pour obtenir les classes CSS en fonction du status
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
            {surveys.map((survey, index) => (
              <tr
                key={index}
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
