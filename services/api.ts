import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { ActivationRequest, ActivationResponse, TranslationRequest, TranslationResponse } from '../types';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || 'https://api.example.com';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`Response received from ${response.config.url}:`, response.status);
        return response;
      },
      (error) => {
        console.error('API request failed:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });

        // Handle different error types
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const message = error.response.data?.message || `Server error: ${status}`;
          throw new Error(message);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
        } else {
          // Something else happened
          throw new Error('Une erreur inattendue s\'est produite.');
        }
      }
    );
  }

  private async makeRequest<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      // Error is already handled by the response interceptor
      throw error;
    }
  }

  async activate(request: ActivationRequest): Promise<ActivationResponse> {
    return this.makeRequest<ActivationResponse>({
      method: 'POST',
      url: '/api/activate',
      data: request,
    });
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    return this.makeRequest<TranslationResponse>({
      method: 'POST',
      url: '/api/translate',
      data: request,
    });
  }

  // Additional utility methods
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest<{ status: string; timestamp: string }>({
      method: 'GET',
      url: '/api/health',
    });
  }

  // Method to update base URL if needed
  updateBaseURL(newBaseURL: string): void {
    this.client.defaults.baseURL = newBaseURL;
  }

  // Method to set authorization header
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Method to remove authorization header
  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

export const apiService = new ApiService();