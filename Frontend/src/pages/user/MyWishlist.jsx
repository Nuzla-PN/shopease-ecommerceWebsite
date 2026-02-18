import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { fetchWishlist } from "../../features/wishlist/wishlistSlice.js";
import { addToWishlist,addingToCart,buyNowAddToCart } from "../../APIs/productAPI.js";
import { addToCart } from "../../features/cart/cartSlice.js";

const MyWishlist = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const {items,loading} = useSelector(state=>state.wishlist);
    const cartItems = useSelector(state=>state.cart.items);
    

    useEffect(()=>{
        dispatch(fetchWishlist());
    },[dispatch]);

    const removefromWishlist = async(productId)=>{
        await addToWishlist(productId);
        dispatch(fetchWishlist());
    };

    const clearAllWishlist = async()=>{
      try{
        for(const item of items) {
          await addToWishlist(item.product._id);
        }
        dispatch(fetchWishlist());
      }
      catch(err){
        alert("Unable to clear wishlist");
      }
    };

      const handleAddToCart = async (product) => {
    try {
      const res = await addingToCart(product._id,1);
      
      dispatch(addToCart(res.cartItem));
      // await addToWishlist(product._id); // remove from wishlist
      // dispatch(fetchWishlist());
    } catch (err) {
      alert(err?.response?.data?.message);
    }
  };

  

    const handleBuyNow = async (product) => {
    try {
      const data= await buyNowAddToCart(product._id,1);
      dispatch(addToCart(data.cartItem));
      
      // await addToWishlist(product._id); // remove from wishlist
      // dispatch(fetchWishlist());
      navigate(`/order-summary?items=${product._id}:1`);
    } catch (err) {
      alert(err?.response?.data?.message || "Please login first");
    }
  };


    


    if (loading) return <p>Loading...</p>;

  if (items.length === 0) {
    return <h2 className="text-center mt-10">No item is wishlisted</h2>;
  }

  return (
    
    <div className="pt-10 max-w-7xl mx-auto px-4">
      <Link to="/" className="text-blue-600 text-sm mb-2 inline-block">
        ← Continue Shopping
      </Link> 
      <h1 className="text-4xl font-bold mb-6">My Wishlist (<span>{items.length}</span>)</h1>
    <div className="flex justify-end mb-4">
      
      <button onClick={clearAllWishlist} className="px-4 py-2 bg-red-600 text-white rounded">
        Clear All
      </button>
    </div>

    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
      {items.map((item) => {

        const product = item.product;
        const isInCart = cartItems?.some(
            (c) => c.product?._id === product?._id
        );

        return (
          <div
            key={item._id}
            className="border p-4 rounded"
          >
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              className="h-420 object-contain"
            />

            <h3 className="font-semibold mt-2 text-lg">{product?.name}</h3>

            <div className="mt-1 text-xl font-bold text-indigo-600">
              ₹ {product?.price}
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Sold by :
              <span className="ml-1 font-medium text-gray-700">
                {product?.seller?.usernamebox || "Verified seller"}
              </span>
            </p>

            <p
              className={`mt-1 text-sm ${
                product?.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product?.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {product?.description}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                  onClick={() => handleBuyNow(product)}
                  className="flex-1 px-3 py-1 border border-indigo-600 text-indigo-600 rounded"
                >
                  Buy now
                </button>

               <button
              onClick={() => {
                if (isInCart) {
                  navigate("/cart");
                } else {
                  handleAddToCart(product);
                }
              }}
              className={`flex-1 border rounded-md py-2 text-sm font-medium transition
                ${
                  isInCart
                    ? "bg-white text-indigo-600 border-indigo-600"
                    : "bg-indigo-600 text-white border-indigo-600"
                }`}
            >
              {isInCart ? "Go to cart" : "Add to cart"}
            </button>

              <button
                onClick={() => removefromWishlist(product._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default MyWishlist;

