import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductCard = ({product,showActions=false})=>{

    const navigate = useNavigate();
    return(
        
        <div  onClick={()=> !showActions && navigate(`/products/${product._id}`)} 
        className = "border rounded-lg p-3 shadow-xl hover:shadow-md transition flex flex-col h-full"
        >
            <div className = "h-40 w-full overflow-hidden rounded bg-gary-100">
                <img
                    src ={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                />
            </div>
        <div className="flex-1 mt-2">
            <h3 className="mt-2 font-semibold text-sm line-clamp-2">
                {product.name}
            </h3>

            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {product.description}
            </p>
            <p className="text-xs text-gray-500">
                {product.category}
            </p>
            <p className="mt-1 font-bold text-lg text-indigo-600">
                ₹ {product.price}
            </p>
            <p className="text-xs text-gray-500">
               Stock {product.stock}
            </p>
            <p className="text-lg text-yellow-500 mt-1">
          ★★★★☆ (4.2)
            </p>
            </div>
            {/*Show actions only on detail page ie single product page*/}

            {showActions && (
                <div onClick={(e)=>e.stopPropagation()} className="mt-3">

                    <div className="flex gap-2 mb-2">
                        <button className="flex-1 border border-indigo-600 text-indigo-600 text-base py-1.5 rounded hover:bg-indigo-50 flex items-center justify-center gap-1">
                            Add to cart
                        </button>

                        <button className="flex-1 bg-indigo-600 font-bold text-white text-base py-1.5 rounded hover:bg-indigo-700">
                            Buy Now
                        </button>
                    </div>
                        <button className="w-full flex justify-center items-center gap-2 text-sm text-gray-600 border rounded py-1.5 hover:bg-gray-50">
                            <FaHeart className="text-red-500"/>
                            Add to Wishlist
                        </button>
                    </div>
            )}
            {/* <div className="mt-auto pt-3 flex gap-2">
                <button className="flex-1 border border-indigo-600 text-indigo-600 text-base py-1.5 rounded hover:bg-indigo-50 flex items-center justify-center gap-1">
                     Add to cart
                </button>
                <button className="flex-1 bg-indigo-600 font-bold text-white text-base py-1.5 rounded hover:bg-indigo-700">
                    Buy Now
                </button>
            </div> */}
        </div>
    );
};

export default ProductCard;