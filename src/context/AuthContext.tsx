
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type User = {
  name: string;
  email: string;
  image?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (name: string, email: string, image?: string) => void;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // আগের Login করা user-এর তথ্য load করা
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("bazar-dor-user");

      if (savedUser) {
        setUser(JSON.parse(savedUser) as User);
      }
    } catch {
      localStorage.removeItem("bazar-dor-user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login
  const login = (name: string, email: string, image?: string) => {
    const newUser: User = {
      name,
      email,
      image,
    };

    setUser(newUser);
    localStorage.setItem("bazar-dor-user", JSON.stringify(newUser));
  };

  // Profile Update
  const updateUser = (updatedUser: User) => {
    const newUser: User = {
      ...updatedUser,
      name: updatedUser.name.trim(),
      email: updatedUser.email.trim(),
    };

    // Context update: Profile ও Navbar-এ নতুন তথ্য দেখাবে
    setUser(newUser);

    // Browser storage update: Refresh করলেও তথ্য থাকবে
    localStorage.setItem("bazar-dor-user", JSON.stringify(newUser));
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("bazar-dor-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

