import { useMemo, useRef, useEffect } from "react";
import axios, { type AxiosInstance } from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";

export const useApi = (): AxiosInstance => {
  const { isLoaded } = useUser();
  const { getToken } = useAuth();

  const clerkReadyRef = useRef<{ promise: Promise<void>; resolve: () => void } | null>(null);
  if (!clerkReadyRef.current) {
    let resolveFn!: () => void;
    const promise = new Promise<void>((resolve) => { resolveFn = resolve; });
    clerkReadyRef.current = { promise, resolve: resolveFn };
  }

  useEffect(() => {
    if (isLoaded && clerkReadyRef.current) {
      clerkReadyRef.current.resolve();
    }
  }, [isLoaded]);

  const axiosWithAuth = useMemo<AxiosInstance>(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: { "Content-Type": "application/json" },
    });

    instance.interceptors.request.use(
      async (config) => {
        try {
          await clerkReadyRef.current?.promise;

          const token = await getToken({ template: "default" }).catch(() => null);
          if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch (err) {}

        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [getToken]);

  return axiosWithAuth;
};