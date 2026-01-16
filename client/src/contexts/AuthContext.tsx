import * as React from "react";
import { useLocation } from "wouter";
import {
  User,
  UserRole,
  getUserByEmail,
  verifyPassword,
  createUser,
  getUserById,
  getStudentByUserId,
  getTutorByUserId,
  Student,
  Tutor,
  getDB,
} from "@/lib/datastore";

interface AuthState {
  user: User | null;
  student: Student | null;
  tutor: Tutor | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    mobile: string;
    role: UserRole;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;
  refreshAuth: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "edubridge_auth_user_id";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    student: null,
    tutor: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const [, setLocation] = useLocation();

  const loadUserData = React.useCallback((userId: string) => {
    const user = getUserById(userId);
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setState({
        user: null,
        student: null,
        tutor: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    let student: Student | null = null;
    let tutor: Tutor | null = null;

    if (user.role === "student") {
      student = getStudentByUserId(userId) || null;
    } else if (user.role === "tutor") {
      tutor = getTutorByUserId(userId) || null;
    }

    setState({
      user,
      student,
      tutor,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  React.useEffect(() => {
    getDB();
    const storedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUserId) {
      loadUserData(storedUserId);
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [loadUserData]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const user = getUserByEmail(email);
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return { success: false, error: "Invalid email or password" };
    }

    if (!user.isActive) {
      return { success: false, error: "Account is inactive. Please contact support." };
    }

    localStorage.setItem(AUTH_STORAGE_KEY, user.id);
    loadUserData(user.id);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({
      user: null,
      student: null,
      tutor: null,
      isLoading: false,
      isAuthenticated: false,
    });
    setLocation("/");
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    mobile: string;
    role: UserRole;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    const existing = getUserByEmail(userData.email);
    if (existing) {
      return { success: false, error: "Email already registered" };
    }

    const user = createUser({
      ...userData,
      isActive: true,
    });

    localStorage.setItem(AUTH_STORAGE_KEY, user.id);
    loadUserData(user.id);
    return { success: true, user };
  };

  const refreshAuth = () => {
    const storedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUserId) {
      loadUserData(storedUserId);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "tutor":
      return "/tutor";
    case "parent":
      return "/parent";
    case "student":
    default:
      return "/dashboard";
  }
}
