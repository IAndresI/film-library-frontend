import type { AxiosRequestConfig } from 'axios';

import axios, { CanceledError } from 'axios';

import { API_BASE_URL } from '@/shared/config';

import { CustomApiError } from '../model/api-error.model';

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error) && error.response?.data) {
    throw new CustomApiError({
      code: error.response.status,
      message: error.response.data.message,
    });
  }
  if (error instanceof CustomApiError) {
    throw new CustomApiError(error);
  }

  if (error instanceof CanceledError) {
    throw new CustomApiError({
      code: 408,
      message: 'Запрос отменен',
    });
  }

  throw new CustomApiError({
    message: 'Неизвестная ошибка',
    code: 500,
  });
};

export const $axios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

$axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

$axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }

    return handleError(error);
  }
);

export const apiInstance = {
  get:
    <T>(url: string, init?: AxiosRequestConfig) =>
    async (meta: { signal: AbortSignal }) => {
      try {
        const response = await $axios.get<T>(url, {
          ...init,
          signal: meta.signal,
        });
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

  post: async <T>(url: string, data?: unknown, init?: AxiosRequestConfig) => {
    try {
      const response = await $axios.post<T>(url, data, { ...init });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  put: async <T>(url: string, data?: unknown, init?: AxiosRequestConfig) => {
    try {
      const response = await $axios.put<T>(url, data, { ...init });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  patch: async <T>(url: string, data?: unknown, init?: AxiosRequestConfig) => {
    try {
      const response = await $axios.patch<T>(url, data, { ...init });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async <T>(url: string, init?: AxiosRequestConfig) => {
    try {
      const response = await $axios.delete<T>(url, { ...init });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};
