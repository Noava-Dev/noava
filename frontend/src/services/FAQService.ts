import type { FAQ } from "../models/FAQ";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const faqService = {
  async getAll(): Promise<FAQ[]> {
    const response = await fetch(`${API_URL}/faq`);
    if (!response.ok) {
      throw new Error('Failed to fetch FAQs');
    }
    return response.json();
  },
};