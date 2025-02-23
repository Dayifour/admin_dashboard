import { db } from "@/app/api/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Card from "../card/Card";
import SurveyTable from "../surveyTable/SurveyTable";
const Dashboard = () => {
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalSurveys, setTotalSurveys] = useState(0);
  const [totalClosedSurveys, setTotalClosedSurveys] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAdmins = async () => {
      const adminsSnapshot = await getDocs(collection(db, "investigators"));
      setTotalAdmins(adminsSnapshot.size);
    };

    const fetchSurveys = async () => {
      const surveysSnapshot = await getDocs(collection(db, "surveys"));
      const surveys = surveysSnapshot.docs.map((doc) => doc.data());
      setTotalSurveys(surveys.length);
      setTotalClosedSurveys(
        surveys.filter((survey) => survey.status === "Closed").length
      );
    };

    fetchAdmins();
    fetchSurveys();
  }, []);
  return (
    <div className="flex flex-col gap-10 mx-10 mt-10">
      <h1 className="text-3xl text-black font-semibold">Dashboard</h1>
      <div className="flex gap-5">
        <Card
          img="/usercolor.png"
          text="Total Enquêteurs"
          number={totalAdmins.toString()}
          color="text-blue-500"
        />
        <Card
          img="/research.png"
          text="Enquêtes en cours"
          number={(totalSurveys - totalClosedSurveys).toString()}
          color="text-green-500"
        />
        <Card
          img="/checked.png"
          text="Enquêtes terminées"
          number={totalClosedSurveys.toString()}
          color="text-orange-400"
        />
      </div>
      <SurveyTable />
    </div>
  );
};

export default Dashboard;
