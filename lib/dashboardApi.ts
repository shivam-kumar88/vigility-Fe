import { isAxiosError } from 'axios';
import axiosClient from './axiosClient';


export interface UserCredentials {
  username: string;
  password?: string;
  age?: number;
  gender?: string;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  age?: string;
  gender?: string;
}

const handleApiError = (error: unknown): never => {
  if (isAxiosError(error)) {
    if (error.response) {
      const serverMessage = error.response.data?.error || error.response.data?.message;
      throw new Error(serverMessage || `Server Error: ${error.response.status}`);
    } 
    else if (error.request) {
      throw new Error('Network error. Cannot connect to the server.');
    }
  }
  
  throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
};


//  api Calls 

export const authApi = {
  register: async (userData: UserCredentials) => {
    try {
      const response = await axiosClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  login: async (credentials: UserCredentials) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const analyticsApi = {
  trackClick: async (featureName: string) => {
    try {
      const response = await axiosClient.post('/track', { 
        feature_name: featureName,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  fetchData: async (filters: AnalyticsFilters = {}) => {
    try {
      const response = await axiosClient.get('/analytics', { 
        params: filters,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};