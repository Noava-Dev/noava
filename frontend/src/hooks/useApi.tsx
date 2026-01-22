import { useMemo } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";

export const useApi = () => {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  const axiosWithAuth = useMemo(() => {
    const instance = axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
      headers: { "Content-Type": "application/json" },
    });

    instance.interceptors.request.use(async (config) => {
      try {
        if (isSignedIn) {
          const token = await getToken({ template: "default" });
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (err) {
        console.error("Error getting Clerk token:", err);
      }
      return config;
    });

    return instance;
  }, [isSignedIn, getToken]);

  return axiosWithAuth;
};