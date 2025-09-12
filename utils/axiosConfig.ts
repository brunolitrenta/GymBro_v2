import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.15.43:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    console.log('🔍 INTERCEPTOR - Detalhes do erro:');
    
    if (error.response) {
      console.log(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${error.response.status}`);
      console.log('📄 Response data:', error.response.data);
    } else if (error.request) {
      console.log(`🔗 ${error.config?.method?.toUpperCase()} ${error.config?.url} - Sem resposta do servidor`);
    }
    
    if (error.response?.status === 401) {
      console.log('🚪 Sessão expirada');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userName');
    }
    return Promise.reject(error);
  }
);

export default api;
