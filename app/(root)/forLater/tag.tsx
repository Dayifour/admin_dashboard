"use client";

import Card from "@/components/card/Card";
import SurveyTable from "@/components/surveyTable/SurveyTable";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../api/firebase"; // Remplacez par votre configuration Firebase

const Page = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeSurveys, setActiveSurveys] = useState(0);
  const [completedSurveys, setCompletedSurveys] = useState(0);

  useEffect(() => {
    // Récupérer le nombre total d'utilisateurs
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      setTotalUsers(usersSnapshot.size);
    };

    // Récupérer les enquêtes actives
    const fetchActiveSurveys = async () => {
      const activeSurveysQuery = query(
        collection(db, "surveys"),
        where("status", "==", "active")
      );
      const activeSurveysSnapshot = await getDocs(activeSurveysQuery);
      setActiveSurveys(activeSurveysSnapshot.size);
    };

    // Récupérer les enquêtes terminées
    const fetchCompletedSurveys = async () => {
      const completedSurveysQuery = query(
        collection(db, "surveys"),
        where("status", "==", "completed")
      );
      const completedSurveysSnapshot = await getDocs(completedSurveysQuery);
      setCompletedSurveys(completedSurveysSnapshot.size);
    };

    // Appeler les fonctions pour charger les données
    fetchUsers();
    fetchActiveSurveys();
    fetchCompletedSurveys();
  }, []);

  return (
    <div className="flex flex-col gap-10 mx-10 mt-10">
      <h1 className="text-3xl text-black font-semibold">Dashboard</h1>
      <div className="flex gap-5">
        <Card
          img="/usercolor.png"
          text="Total Users"
          number={totalUsers.toString()}
          color="text-blue-500"
        />
        <Card
          img="/research.png"
          text="Enquêtes actives"
          number={activeSurveys.toString()}
          color="text-green-500"
        />
        <Card
          img="/checked.png"
          text="Enquêtes terminées"
          number={completedSurveys.toString()}
          color="text-orange-400"
        />
      </div>
      <SurveyTable />
    </div>
  );
};

export default Page;
