import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:3000`;
console.log("API_URL", API_URL);

if (!API_URL) {
  throw new Error("API_URL environment variable is not defined.");
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = {
  async get<T>(url: string, params?: object): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(url, params);
    return response.data;
  },

  async post<T>(url: string, data?: object): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data);
    return response.data;
  },

  async patch<T>(url: string, data?: object): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.patch(url, data);
    return response.data;
  },

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.delete(url);
    return response.data;
  },
};
