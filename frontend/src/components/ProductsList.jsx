import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { Loader2 } from "lucide-react";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products, loading } =
    useProductStore();

  console.log("products", products);

  return (
    <>
      {loading && (
        <div className=" absolute top-1/2 left-2/3 p-3 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-full">
          <Loader2 className="h-10 w-10 animate-spin" color="green" />
        </div>
      )}

      <motion.div
        className="bg-gray-800 shadow-lg rounded-lg overflow-scroll md:overflow-hidden max-h-[60vh] max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <table className="w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th
                scope="col"
                className="md:px-6 px-2 py-3 text-left text-xs md:font-semibold text-gray-300 md:uppercase md:tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                className="md:px-6 px-2 py-3 text-left text-xs md:font-semibold text-gray-300 md:uppercase md:tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="md:px-6 px-2 py-3 text-left text-xs md:font-semibold text-gray-300 md:uppercase md:tracking-wider"
              >
                Category
              </th>

              <th
                scope="col"
                className=" md:px-6 px-2 py-3 text-left text-xs md:font-semibold text-gray-300 md:uppercase md:tracking-wider"
              >
                Featured
              </th>
              <th
                scope="col"
                className="md:px-6 px-2 py-3 text-left text-xs md:font-semibold text-gray-300 md:uppercase md:tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {products?.map((product) => (
              <tr key={product._id} className="hover:bg-gray-700">
                <td className="md:px-6 px-2 py-4 whitespace-nowrap">
                  <div className="flex  shrink-1 md:flex-row flex-col items-left">
                    <div className="flex-shrink-1 md:h-10 md:w-10 h-6 w-6">
                      <img
                        className="md:h-10 md:w-10 h-6 w-6 rounded-full object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="md:ml-4">
                      <div className="text-xs md:text-sm md:font-semibold text-white">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="md:px-6 px-2 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    ${product.price.toFixed(2)}
                  </div>
                </td>
                <td className="md:px-6 px-2 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {product.category}
                  </div>
                </td>
                <td className="md:px-6 px-2 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleFeaturedProduct(product._id)}
                    className={`p-1 rounded-full ${
                      product.isFeatured
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-600 text-gray-300"
                    } hover:bg-yellow-500 transition-colors duration-200`}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                </td>
                <td className="md:px-6 px-2 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      if (confirm("Are you sure to delete this product")) {
                        deleteProduct(product._id);
                      }
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </>
  );
};
export default ProductsList;
