// middleware.ts (à la racine de votre projet)
import { getAuth } from "firebase/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Autoriser uniquement la route /login si non authentifié
  if (path === "/login") {
    return NextResponse.next();
  }

  // 2. Vérifier si l'utilisateur est connecté via Firebase Auth
  try {
    await new Promise((resolve, reject) => {
      const unsubscribe = getAuth().onAuthStateChanged((user) => {
        unsubscribe();
        user ? resolve(user) : reject("Not authenticated");
      });
    });
    return NextResponse.next();
  } catch {
    // 3. Rediriger vers /login si échec
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Appliquer à toutes les routes sauf /login
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
