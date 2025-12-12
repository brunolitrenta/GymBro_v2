import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastError, toastSuccess } from "@/utils/toast";

let globalLoadingHandler: ((loading: boolean) => void) | null = null;

export const setLoadingHandler = (handler: (loading: boolean) => void) => {
  globalLoadingHandler = handler;
};

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (globalLoadingHandler) {
      globalLoadingHandler(true);
    }

    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (globalLoadingHandler) {
      globalLoadingHandler(false);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (globalLoadingHandler) {
      globalLoadingHandler(false);
    }

    const method = response.config.method?.toUpperCase();
    console.log(
      `✅ ${method} ${response.config.url} - Status: ${response.status}`
    );

    const silentSuccess = response.config?.headers?.["X-Silent"] === "true";

    if (
      method &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
      !silentSuccess
    ) {
      const msg =
        (response.data?.message as string) || "Operação realizada com sucesso";
      toastSuccess(msg);
    }
    return response;
  },
  async (error) => {
    if (globalLoadingHandler) {
      globalLoadingHandler(false);
    }

    console.log("🔍 INTERCEPTOR - Detalhes do erro:");

    const silentError = error.config?.headers?.["X-Silent"] === "true";

    let extractedMessage = "Erro na requisição";
    if (error.response) {
      const method = error.config?.method?.toUpperCase();
      console.log(
        `❌ ${method} ${error.config?.url} - Status: ${error.response.status}`
      );
      console.log("📄 Response data:", error.response.data);
      extractedMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Erro ${error.response.status}`;
    } else if (error.request) {
      console.log(
        `🔗 ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        } - Sem resposta do servidor`
      );
      extractedMessage = "Sem resposta do servidor";
    } else {
      extractedMessage = error.message || extractedMessage;
    }

    if (error.response?.status === 401) {
      console.log("🚪 Sessão expirada");
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userName");
      if (!silentError) {
        toastError("Sessão expirada, faça login novamente");
      }
    } else if (!silentError) {
      toastError(extractedMessage);
    }
    return Promise.reject(error);
  }
);

export default api;
