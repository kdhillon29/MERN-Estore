import toast from "react-hot-toast";
import { Loader2, ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useEffect, useState } from "react";
import { useRef } from "react";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart, loading } = useCartStore();

  const [loadSpin, setLoadSpin] = useState(false);
  const buttonRef = useRef();
  useEffect(() => {
    !loading && setLoadSpin(false);
  }, [loading]);

  function handleButtonClick(e) {
    if (e.target === buttonRef.current) {
      setLoadSpin(true);
    } else {
      console.log("target not");
    }
  }

  const handleAddToCart = (e) => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    } else {
      handleButtonClick(e);
      // add to cart
      //   new Promise((resolve) => setTimeout(resolve, 2000));
      addToCart(product);
    }
  };

  return (
    <div className="flex w-full max-w-3xs relative flex-col overflow-hidden bg-gray-700/70  rounded-lg border border-gray-700 shadow-lg">
      <div className="relative flex w-full h-28 md:h-38   overflow-hidden rounded-xl">
        <img
          className="object-cover overflow-hidden w-full"
          src={product.image}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black opacity-20" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">
              ${product.price}
            </span>
          </p>
        </div>
        <button
          ref={buttonRef}
          className={`flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 ${
             loading ? "cursor-not-allowed" : ""
           }`}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={22} className="mr-2" />
          {loadSpin ? (
            <>
              <Loader2 className="animate-spin" color="white" />
              <span className="inline">Adding...</span>
            </>
          ) : (
            "Add to cart"
          )}
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
