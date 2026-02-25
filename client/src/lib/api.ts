import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const res = await axios.post("/api/v1/auth/refresh-token", {
            refreshToken,
          });
          const { accessToken } = res.data;
          useAuthStore.getState().setAccessToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch {
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      } else {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export async function apiGet<T = any>(url: string): Promise<T> {
  const res = await api.get<T>(url);
  return res.data;
}

export async function apiPost<T = any>(url: string, data?: any): Promise<T> {
  const res = await api.post<T>(url, data);
  return res.data;
}

export async function apiPut<T = any>(url: string, data?: any): Promise<T> {
  const res = await api.put<T>(url, data);
  return res.data;
}

export async function apiPatch<T = any>(url: string, data?: any): Promise<T> {
  const res = await api.patch<T>(url, data);
  return res.data;
}

export async function apiDelete<T = any>(url: string): Promise<T> {
  const res = await api.delete<T>(url);
  return res.data;
}
