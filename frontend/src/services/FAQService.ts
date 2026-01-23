import type { FAQ } from "../models/FAQ";
import { useApi } from "../hooks/useApi";

export const faqService = () => {
  const api = useApi();

  const getAll = async (): Promise<FAQ[]> => {
    try {
      const response = await api.get<FAQ[]>("/faq");
      return response.data;
    } catch (err) {
      console.error("Failed to fetch FAQs:", err);
      throw new Error("Failed to fetch FAQs");
    }
  };

  return { getAll };
};