import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
   const { getRecommendedProducts } = useProductStore();
  // useEffect(() => {
  //   const fetchRecommendations = async () => {
  //     try {
  //       const res = await axios.get(`${URL}/products/recommendations`);
  //       console.log("recommendations", res.data);
  //       setRecommendations(res.data);
  //     } catch (error) {
  //       toast.error(
  //         error.response.data.message ||
  //           "An error occurred while fetching recommendations"
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchRecommendations();
  // }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-8 w-full">
      <h3 className="text-2xl text-center font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {recommendations.length > 0 && Array.isArray(recommendations) ? (
          recommendations.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </div>
  );
};
export default PeopleAlsoBought;
