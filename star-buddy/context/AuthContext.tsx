import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  token: string | null;
  email: string | null;
  isLoading: boolean;
  login: (token: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on app startup
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("auth_token");
      const storedEmail = await AsyncStorage.getItem("user_email");
      if (storedToken) {
        setToken(storedToken);
        if (storedEmail) {
          setEmail(storedEmail);
        }
      }
    } catch (e) {
      console.error("Failed to restore token:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string, userEmail: string) => {
    try {
      await AsyncStorage.setItem("auth_token", newToken);
      await AsyncStorage.setItem("user_email", userEmail);
      setToken(newToken);
      setEmail(userEmail);
    } catch (e) {
      console.error("Failed to save token:", e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("user_email");
      setToken(null);
      setEmail(null);
    } catch (e) {
      console.error("Failed to remove token:", e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        email,
        isLoading,
        login,
        logout,
        isSignedIn: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
