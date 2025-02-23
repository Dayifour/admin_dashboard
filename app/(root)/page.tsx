"use client";

import Dashboard from "@/components/dashboard/Dashboard";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../api/firebase";

const Page = () => {
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalSurveys, setTotalSurveys] = useState(0);
  const [totalClosedSurveys, setTotalClosedSurveys] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        router.replace("/login"); // Redirige immédiatement
      } else {
        setUser(authUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Chargement...</p>
      </div>
    );
  }

  return user && <Dashboard />;
};

export default Page;
