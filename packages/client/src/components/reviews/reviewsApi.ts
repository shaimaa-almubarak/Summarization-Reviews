import axios from 'axios';

export type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

export type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

export type SummarizeResponse = {
   summary: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const reviewsApi = {
   fetchReviews(productId: number) {
      const url = `${API_BASE_URL}/api/products/${productId}/reviews`;
      return axios.get<GetReviewsResponse>(url).then((res) => res.data);
   },

   summarizeReviews(productId: number) {
      const url = `${API_BASE_URL}/api/products/${productId}/reviews/summarize`;
      return axios.post<SummarizeResponse>(url).then((res) => res.data);
   },
};
