import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toastError, toastSuccess } from '@/utils/toast';

// Variável global para controlar o loading
let globalLoadingHandler: ((loading: boolean) => void) | null = null;

// Função para registrar o handler de loading
export const setLoadingHandler = (handler: (loading: boolean) => void) => {
  globalLoadingHandler = handler;
};

const api = axios.create({
  baseURL: 'http://192.168.15.43:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // Ativa o loading ao iniciar a requisição
    if (globalLoadingHandler) {
      globalLoadingHandler(true);
    }
    
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Desativa o loading em caso de erro
    if (globalLoadingHandler) {
      globalLoadingHandler(false);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Desativa o loading ao receber a resposta
    if (globalLoadingHandler) {
      globalLoadingHandler(false);
    }
    
    const method = response.config.method?.toUpperCase();
    console.log(`✅ ${method} ${response.config.url} - Status: ${response.status}`);
    // Exibir toast somente para operações de escrita (POST, PUT, PATCH, DELETE)
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      // Tentar obter mensagem customizada da API
      const msg = (response.data?.message as string) || 'Operação realizada com sucesso';
      toastSuccess(msg);
    }
    return response;
  },
  async (error) => {
    // Desativa o loading em caso de erro
    if (globalLoadingHandler) {
      globalLoadingHandler(false);
    }
    
    console.log('🔍 INTERCEPTOR - Detalhes do erro:');

    let extractedMessage = 'Erro na requisição';
    if (error.response) {
      const method = error.config?.method?.toUpperCase();
      console.log(`❌ ${method} ${error.config?.url} - Status: ${error.response.status}`);
      console.log('📄 Response data:', error.response.data);
      extractedMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Erro ${error.response.status}`;
    } else if (error.request) {
      console.log(`🔗 ${error.config?.method?.toUpperCase()} ${error.config?.url} - Sem resposta do servidor`);
      extractedMessage = 'Sem resposta do servidor';
    } else {
      extractedMessage = error.message || extractedMessage;
    }

    // Sessão expirada
    if (error.response?.status === 401) {
      console.log('🚪 Sessão expirada');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userName');
      toastError('Sessão expirada, faça login novamente');
    } else {
      toastError(extractedMessage);
    }
    return Promise.reject(error);
  }
);

export default api;
