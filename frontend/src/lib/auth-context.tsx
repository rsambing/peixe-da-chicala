"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  activeProfile: "user" | "org";
  login: () => void;
  logout: () => void;
  switchProfile: (type: "user" | "org") => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  activeProfile: "user",
  login: () => {},
  logout: () => {},
  switchProfile: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeProfile, setActiveProfile] = useState<"user" | "org">("user");
  const router = useRouter();

  const login = useCallback(() => {
    setIsLoggedIn(true);
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setActiveProfile("user");
    router.push("/");
  }, [router]);

  const switchProfile = useCallback((type: "user" | "org") => {
    setActiveProfile(type);
    // Optional: Redirect to specific dashboard view
    router.push(type === "org" ? "/dashboard/organizacoes" : "/dashboard");
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, activeProfile, login, logout, switchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
