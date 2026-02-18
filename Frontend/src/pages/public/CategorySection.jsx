import { useEffect, useState } from "react";
import { getAllCategories, getApprovedProducts } from "../../APIs/productAPI.js";
import ProductCard from "./ProductCard.jsx";

const CategorySection = () => {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const catRes = await getAllCategories();
      const prodRes = await getApprovedProducts();

      setCategories(catRes.categories);      // ["Food","business"]
      setProducts(prodRes.product || []);         // approved products
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

        if(loading){
          return <div className="py-10 text-center">Loading...</div>
        }
  return (
     
    <div  className="mt-1">
    <div id = "products" className="mt-1 -translate-y-10 flex flex-col items-center">
        <h2  className="text-5xl font-bold mb-5 text-center">
        Shop by Category
        </h2>
        <div className="flex flex-wrap gap-3 mb-6 mt-5">

        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full border text-sm
          ${
            selectedCategory === "All"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-700 hover:bg-indigo-50"
          }`}> All </button>

{/* Category buttons */}
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border text-sm
            ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 hover:bg-indigo-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
      
      {/* Product area */}

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">Products not found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}

        </div>
      )}
    </div>
  );
};

export default CategorySection;
