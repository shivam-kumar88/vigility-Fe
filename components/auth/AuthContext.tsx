"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, UserCredentials } from "@/lib/dashboardApi";

interface User {
  id: number;
  username: string;
  age: number;
  gender: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      if (pathname !== "/auth") {
        router.push("/auth");
      }
    }
    setIsLoading(false);
  }, [pathname, router]);

  const login = async (credentials: UserCredentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    router.push("/");
  };

  const register = async (credentials: UserCredentials) => {
    const data = await authApi.register(credentials);
    localStorage.setItem("token", data.token);

    const newUser = {
      id: data.userId,
      username: credentials.username,
      age: credentials.age || 0,
      gender: credentials.gender || "Other",
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
