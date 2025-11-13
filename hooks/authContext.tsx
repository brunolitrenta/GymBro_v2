import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/utils/axiosConfig";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  username?: string;
  sub?: string;
  type?: string;
  id?: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  userType: string;
  userId: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken) {
        try {
          const decodedToken = jwtDecode<JwtPayload>(storedToken);

          if (decodedToken.exp * 1000 > Date.now()) {
            const userName = decodedToken.username || "";
            const userType = decodedToken.type || "";
            const userId = decodedToken.id || "";
            setUserName(userName);
            setUserType(userType);
            setUserId(userId);
            setIsLoggedIn(true);
          } else {
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("userName");
            await AsyncStorage.removeItem("userType");
            await AsyncStorage.removeItem("userId");
          }
        } catch (decodeError) {
          console.error("Erro ao decodificar token:", decodeError);
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("userName");
          await AsyncStorage.removeItem("userType");
          await AsyncStorage.removeItem("userId");
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status de autenticação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token } = response.data?.data;

      const decodedToken = jwtDecode<JwtPayload>(token);
      const userName = decodedToken.username || "";
      const userType = decodedToken.type || "";
      const userId = decodedToken.id || "";

      await AsyncStorage.setItem("userName", userName);
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userType", userType);
      await AsyncStorage.setItem("userId", userId);
      setUserName(userName);
      setUserType(userType);
      setUserId(userId);
      setIsLoggedIn(true);
    } catch (error: any) {
      if (error.response) {
        console.log("📡 Status HTTP:", error.response.status);
        console.log(
          "📦 Dados da resposta:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.log("🔍 Headers da resposta:", error.response.headers);
        console.log("⚙️ Config da requisição:", error.config);
      } else if (error.request) {
        console.log("📡 Request details:", error.request);
        console.log("🌐 URL:", error.config?.url || "URL não disponível");
      }

      console.log("📝 Mensagem de erro:", error.message);

      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userName");
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userType");
      await AsyncStorage.removeItem("userId");
      setUserName("");
      setUserType("");
      setUserId("");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userName, userType, userId, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthContextProvider");
  }
  return context;
};
