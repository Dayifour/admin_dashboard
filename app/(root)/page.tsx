"use client";

import { auth } from "@/app/api/firebase";
import Card from "@/components/card/Card";
import SurveyTable from "@/components/surveyTable/SurveyTable";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../api/firebase"; // Assurez-vous d'importer correctement votre configuration Firebase

const Page = () => {
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalSurveys, setTotalSurveys] = useState(0);
  const [totalClosedSurveys, setTotalClosedSurveys] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/login"); // Redirige vers la page de login si l'utilisateur n'est pas connecté
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Chargement...</p>; // Affiche un message pendant la redirection
  }

  useEffect(() => {
    // Récupérer le nombre total d'administrateurs
    const fetchAdmins = async () => {
      const adminsSnapshot = await getDocs(collection(db, "investigators"));
      setTotalAdmins(adminsSnapshot.size);
    };

    // Récupérer le nombre total d'enquêtes et le nombre d'enquêtes terminées
    const fetchSurveys = async () => {
      const surveysSnapshot = await getDocs(collection(db, "surveys"));
      const surveys = surveysSnapshot.docs.map((doc) => doc.data());
      setTotalSurveys(surveys.length);
      setTotalClosedSurveys(
        surveys.filter((survey) => survey.status === "Closed").length
      );
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

export default Page;
