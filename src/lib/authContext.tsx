"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, findUser } from "./mockUsers";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const foundUser = findUser(email, password);
        if (foundUser) {
          setUser(foundUser);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      router.push(`/${locale}/login`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
