import axios from 'axios';
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
      return axios
         .get<getReviewsResponse>(`/api/products/${productId}/reviews`)
         .then((res) => res.data);
   },
   SummarizeReviews(productId: number) {
      return axios
         .post(`/api/products/${productId}/reviews/summarize`)
         .then((res) => res.data);
   },
};
