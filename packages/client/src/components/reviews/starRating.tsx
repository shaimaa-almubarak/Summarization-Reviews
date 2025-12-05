import { FaRegStar } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa6';

type Props = {
   value: number; //rating from 0 to 5
};
const starRating = ({ value }: Props) => {
   const placeholder = [1, 2, 3, 4, 5];
   return (
      <div className="flex gap-1 text-yellow-500">
         {placeholder.map((p) =>
            p <= value ? <FaStar key={p} /> : <FaRegStar key={p} />
         )}
      </div>
   );
};

export default starRating;
