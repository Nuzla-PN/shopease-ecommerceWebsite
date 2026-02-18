import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaHeart, FaTruck, FaUndo, FaLock } from "react-icons/fa";
import { addingToCart, addToWishlist, buyNowAddToCart, getSingleProduct, getWishlist } from "../../APIs/productAPI.js";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { fetchWishlist } from "../../features/wishlist/wishlistSlice.js";

const SingleProductDetailsPage = () => {

  const { id } = useParams();

  const cartItems = useSelector((state)=>state.cart.items||[]);
  const wishlistItems = useSelector((state)=>state.wishlist.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const isInCart = product? cartItems.some ((item)=>item.product?._id===product._id):false;//To check if item is already in cart
  const { items } = useSelector(state => state.wishlist);
  const isWishlisted = product ?wishlistItems.some((w)=> (w.product?._id || w.product) === product._id):false;
  console.log("Itemssssssssssss", wishlistItems)
  useEffect(() => {

    const fetchProduct = async () => {
          const data = await getSingleProduct(id);
          setProduct(data.product);
        };

          fetchProduct();
          dispatch(fetchWishlist());

        }, [id,dispatch]);

            if (!product) return <div className="pt-24 text-center">Loading...</div>;


  const increaseQty = () => {
          if (qty < product.stock) setQty(qty + 1);
        };

  const decreaseQty = () => {
          if (qty > 1) setQty(qty - 1);
        };

    

  const handleAddToCart = async () => {
          try {
            const data = await addingToCart(product._id,qty);

            dispatch(addToCart(data.cartItem));
            // alert(data.message);to show backend success message

          } catch (err) {
            alert(err?.response?.data?.message||"Something wents wrong");
          }
        };

  const handleWishlist = async()=>{
    try{
      await addToWishlist(product._id)
      dispatch(fetchWishlist());
    }catch(err){
      console.log(err);
    }
  };


  const handleBuyNow = async () => {
    try{
          const data = await buyNowAddToCart(product._id,qty);
          dispatch(addToCart(data.cartItem));
          navigate(`/order-summary?items=${product._id}:${qty}`);
        } catch (err) {
          alert(err?.response?.data?.message || "please login first");
  }
};

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 ">

      <div className="grid  md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="border rounded-lg overflow-hidden ">
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            className="w-full h-[420px] object-contain"
          />
        </div>

        {/* DETAILS */}
        <div>

          {/* name */}
          <h1 className="text-2xl font-bold">
            {product.name}
          </h1>

          {/* rating + reviews */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-yellow-500">
              <FaStar /><FaStar /><FaStar /><FaStar />
              <FaStar className="text-gray-300" />
            </div>
            <span className="text-sm text-gray-500">(42 reviews)</span>
          </div>

          {/* seller */}
          <p className="text-sm text-gray-500 mt-1">
            Sold by :
            <span className="font-medium text-gray-700 ml-1">
              {product.seller?.usernamebox || "Verified seller"}
            </span>
          </p>

          {/* price */}
          <div className="mt-4 text-3xl font-bold text-indigo-600">
            ₹ {product.price}
          </div>

          {/* stock */}
          <p
            className={`mt-1 text-sm ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {/* qty */}
          <div className="flex items-center gap-4 mt-6">

            <span className="font-medium">Quantity</span>

            <div className="flex items-center border rounded">

              <button onClick={decreaseQty}
                className="px-3 py-1 text-lg"
              >−</button>

              <span className="px-4">{qty}</span>

              <button onClick={increaseQty}
                className="px-3 py-1 text-lg"
              >+</button>

            </div>

          </div>

          {/* buttons */}
          <div className="flex flex-wrap gap-4 mt-6">

            {/* Add / Go to cart */}
            <button
              onClick={() => {
                if (isInCart) {
                  navigate("/cart");
                } else {
                  handleAddToCart();
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

            {/* Buy now */}
            <button onClick={handleBuyNow}
              className={`flex-1 border rounded-md py-2 text-sm font-medium transition
                ${
                  isInCart
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-indigo-600 border-indigo-600"
                }`}
            >
              Buy now
            </button>

            <button onClick={handleWishlist}
              className="border px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50"
            >
              <FaHeart className={`${isWishlisted ? "text-red-500" : "text-gray-400"}`}
              />
              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </button>

          </div>

          {/* features */}
          <div className="mt-8 border rounded-lg p-4">

            <h3 className="font-semibold mb-3">Key Features</h3>

            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>{product.keyFeatures}</li>
             
            </ul>

          </div>

          {/* trust badges */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-sm">

            <div className="flex flex-col items-center border rounded p-3">
              <FaTruck className="text-xl text-indigo-600" />
              <span className="mt-1">Free Delivery</span>
            </div>

            <div className="flex flex-col items-center border rounded p-3">
              <FaUndo className="text-xl text-indigo-600" />
              <span className="mt-1">Easy Returns</span>
            </div>

            <div className="flex flex-col items-center border rounded p-3">
              <FaLock className="text-xl text-indigo-600" />
              <span className="mt-1">Secure Payment</span>
            </div>

          </div>

        </div>
      </div>

      {/* TABS */}
      <div className="mt-14">

        <div className="flex gap-6 border-b">

          <button
            onClick={() => setActiveTab("description")}
            className={`pb-2 font-medium ${
              activeTab === "description" && "border-b-2 border-indigo-600"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-2 font-medium ${
              activeTab === "specs" && "border-b-2 border-indigo-600"
            }`}
          >
            Specifications
          </button>

          {/* <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-2 font-medium ${
              activeTab === "reviews" && "border-b-2 border-indigo-600"
            }`}
          >
            Customer Reviews
          </button> */}

        </div>

        {/* TAB CONTENT */}
        <div className="mt-6">

          {activeTab === "description" && (
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          )}

          {activeTab === "specs" && (
            <div className="text-sm text-gray-700 space-y-2">
              <p><b>Category :</b> {product.category}</p>
              <p><b>Stock :</b> {product.stock}</p>
              <p><b>Seller ID :</b> {product.seller?._id}</p>
            </div>
          )}

          {/* {activeTab === "reviews" && (

            <div className="space-y-5">

              <div className="border rounded p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Anu</p>
                  <div className="flex text-yellow-500 text-sm">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Product quality is excellent.
                </p>
              </div>

              <div className="border rounded p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Rahul</p>
                  <div className="flex text-yellow-500 text-sm">
                    <FaStar /><FaStar /><FaStar /><FaStar />
                    <FaStar className="text-gray-300" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Fast delivery and good packaging.
                </p>
              </div>

            </div>
          )} */}

        </div>

      </div>

      {/* REVIEW SECTION (frontend only) */}
      <div className="mt-12">

        <h2 className="text-xl font-semibold mb-4">
          Customer Reviews
        </h2>

        <div className="space-y-4">

          <div className="border p-4 rounded">
            <p className="font-medium">Akhil</p>
            <div className="flex text-yellow-500 text-sm">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Very good quality product.
            </p>
          </div>

          <div className="border p-4 rounded">
            <p className="font-medium">Neha</p>
            <div className="flex text-yellow-500 text-sm">
              <FaStar /><FaStar /><FaStar /><FaStar />
              <FaStar className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Worth the price.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SingleProductDetailsPage;


