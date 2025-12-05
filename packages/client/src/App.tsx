import './App.css';
import ReviewList from './components/reviews/reviewList';
function App() {
   return (
      <div className="px-[2%] flex flex-col h-screen py-6 ">
         <ReviewList productId={2} />
      </div>
   );
}
export default App;
