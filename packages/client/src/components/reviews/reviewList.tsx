import StarRating from './starRating';
import SkeletonReview from './SkeletonReview';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi';
import { reviewsApi, type getReviewsResponse } from './reviewsApi';

type Props = { productId: number };

const reviewList = ({ productId }: Props) => {
   const summaryMutation = useMutation({
      mutationFn: () => reviewsApi.SummarizeReviews(productId),
   });

   const reviewQuery = useQuery<getReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => reviewsApi.fetchReviews(productId),
   });

   if (reviewQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <div key={i}>
                  <SkeletonReview key={i} />
               </div>
            ))}
         </div>
      );
   }
   if (reviewQuery.isError) {
      return (
         <p className="text-red-500">Could not fetch reviews. Try again!</p>
      );
   }

   if (!reviewQuery?.data?.reviews.length) {
      return null;
   }

   const currentSummary = reviewQuery.data.summary || summaryMutation.data;
   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <HiSparkles /> Summarize
                  </Button>{' '}
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <SkeletonReview />
                     </div>
                  )}
                  {summaryMutation.isError && (
                     <p className="text-red-500">
                        Could not summraize reviews. Try again!
                     </p>
                  )}
               </div>
            )}
         </div>
         <div>
            {reviewQuery?.data.reviews.map((review) => (
               <div key={review.id} className="flex flex-col gap-3">
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <div className="py-2">{review.content}</div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default reviewList;
