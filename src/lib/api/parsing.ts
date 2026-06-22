import { api } from '@/lib/api/client';

export interface ParseResult {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export const parsingApi = {
  async parseRabota(category?: string): Promise<ParseResult> {
    try {
      const data = await api.post('/api/parse/rabota', { category });
      return data as ParseResult;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  async parseUniversity(universityUrl: string, universityName?: string): Promise<ParseResult> {
    try {
      const data = await api.post('/api/parse/university', { universityUrl, universityName });
      return data as ParseResult;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
};
