import { API_URL } from "@/shared/config";
import axios, { type AxiosRequestConfig } from "axios";

export const $axios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiInstance = {
  get:
    <T>(url: string, init?: AxiosRequestConfig) =>
    async (meta: { signal: AbortSignal }) =>
      await $axios
        .get<T>(url, { ...init, signal: meta.signal })
        .then((data) => data.data),
  post: <T>(url: string, data?: unknown, init?: AxiosRequestConfig) =>
    $axios.post<T>(url, data, { ...init }).then((data) => data.data),
  put: <T>(url: string, data?: unknown, init?: AxiosRequestConfig) =>
    $axios.put<T>(url, data, { ...init }).then((data) => data.data),
  delete: <T>(url: string, init?: AxiosRequestConfig) =>
    $axios.delete<T>(url, { ...init }).then((data) => data.data),
};
