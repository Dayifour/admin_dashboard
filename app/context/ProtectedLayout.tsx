"use client";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login"); // Redirige dès que l'auth est chargée
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-bold text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Ne rend rien tant que l'utilisateur est redirigé
  }

  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
