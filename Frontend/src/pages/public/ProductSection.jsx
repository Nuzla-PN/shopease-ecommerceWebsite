import { useEffect, useState} from "react";
import { getApprovedProducts } from "../../APIs/productAPI.js";

const ProductSection = ({selectedCategory})=>{
    const [products,setProducts] = useState([]);

    useEffect(()=>{
        const loadProducts = async ()=>{
            try{
                const data =await getApprovedProducts();
                
                    let list = Array.isArray(data.products)
                    ? data.products
                    : Array.isArray(data)
                    ? data
                    : [];

                if(selectedCategory && selectedCategory !== "All"){
                    list = list.filter(
                        (p) => p.category ===selectedCategory
                    );

                }

                setProducts(list);
            }
            catch(err){
                console.log(err);
            }
        };
        loadProducts();

    },[selectedCategory]);

  //    return (
  //   <div className="mt-10">
  //     <h2 className="text-xl font-semibold mb-5">
  //       Products
  //     </h2>

  //     {products.length === 0 ? (
  //       <p className="text-gray-500">
  //         No products found
  //       </p>
  //     ) : (
  //       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
  //         {products.map((product) => (
  //           <div
  //             key={product._id}
  //             className="border rounded-lg p-3 hover:shadow-md transition"
  //           >
  //             <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-sm text-gray-400">
  //               Image
  //             </div>

  //             <h3 className="font-medium text-sm">
  //               {product.name}
  //             </h3>

  //             <p className="text-xs text-gray-500">
  //               {product.category}
  //             </p>

  //             <p className="text-indigo-600 font-semibold text-sm mt-1">
  //               ₹ {product.price}
  //             </p>
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );
};

export default ProductSection;
