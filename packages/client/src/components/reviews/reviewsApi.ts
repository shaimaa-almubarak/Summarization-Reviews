import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for same-domain deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

export type getReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

export const reviewsApi = {
   fetchReviews(productId: number) {
      const url = `${API_BASE_URL}/api/products/${productId}/reviews`;
      // eslint-disable-next-line no-console
      console.log('Fetching reviews from:', url);
      // eslint-disable-next-line no-console
      console.log('API_BASE_URL:', API_BASE_URL);
      return axios
         .get<getReviewsResponse>(url, {
            validateStatus: (status) => status < 500, // Don't throw on 4xx errors
         })
         .then((res) => {
            if (res.status >= 400) {
               // eslint-disable-next-line no-console
               console.error('API Error Response:', res.status, res.data);
               const errorData = res.data as any;
               throw new Error(
                  errorData?.error || `HTTP ${res.status}: ${res.statusText}`
               );
            }
            return res.data;
         })
         .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Error fetching reviews:', {
               message: error.message,
               response: error.response?.data,
               status: error.response?.status,
               url: error.config?.url,
            });
            throw error;
         });
   },
   SummarizeReviews(productId: number) {
      const url = `${API_BASE_URL}/api/products/${productId}/reviews/summarize`;
      // eslint-disable-next-line no-console
      console.log('Summarizing reviews from:', url);
      return axios
         .post(url)
         .then((res) => res.data)
         .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Error summarizing reviews:', error);
            throw error;
         });
   },
};
