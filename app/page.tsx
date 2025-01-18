"use client";

import Card from "@/components/card/Card";
import SurveyTable from "@/components/surveyTable/SurveyTable";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./api/firebase"; // Remplacez par votre configuration Firebase

const Page = () => {
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalSurveys, setTotalSurveys] = useState(0);

  useEffect(() => {
    // Récupérer le nombre total d'administrateurs
    const fetchAdmins = async () => {
      const adminsSnapshot = await getDocs(collection(db, "investigators"));
      setTotalAdmins(adminsSnapshot.size);
    };

    // Récupérer le nombre total d'enquêtes
    const fetchSurveys = async () => {
      const surveysSnapshot = await getDocs(collection(db, "surveys"));
      setTotalSurveys(surveysSnapshot.size);
    };

    // Charger les données
    fetchAdmins();
    fetchSurveys();
  }, []);

  return (
    <div className="flex flex-col gap-10 mx-10 mt-10">
      <h1 className="text-3xl text-black font-semibold">Dashboard</h1>
      <div className="flex gap-5">
        <Card
          img="/usercolor.png"
          text="Total Admins"
          number={totalAdmins.toString()}
          color="text-blue-500"
        />
        <Card
          img="/research.png"
          text="Enquêtes en cours"
          number={totalSurveys.toString()}
          color="text-green-500"
        />
        <Card
          img="/checked.png"
          text="Enquêtes terminées"
          number="0"
          color="text-orange-400"
        />
      </div>
      <SurveyTable />
    </div>
  );
};

export default Page;
