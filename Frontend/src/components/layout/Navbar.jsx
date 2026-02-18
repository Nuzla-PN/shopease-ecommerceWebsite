import { useState } from "react";
import { FaShoppingCart, FaUser,FaSearch, FaTimes, FaBars, FaSignOutAlt, FaHeart, FaFirstOrder } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice.js";
import { applyasseller } from "../../APIs/productAPI.js";
import { clearCart } from "../../features/cart/cartSlice.js";


const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {token} = useSelector((state)=>state.auth);
  const cartItems = useSelector((state)=>state.cart.items||[]);
  const wishlistCount = useSelector((state)=>state.wishlist.items.length);
  // const totalQty = cartItems.reduce((sum,i)=>sum+i.quantity,0);
  

  const [open,setOpen] = useState(false);

  const handleLogout = ()=>{
    localStorage.removeItem("token");//remove token
    dispatch(clearCart());//CLEAR REDUX CART AFTER LOGOUT SO THAT NEXT USER WONT SEE HIS CART ITEMS
    dispatch(logout());
    navigate("/login");
  };

  const handleBecomeSeller=async()=>{
        if(!token){
            alert("you must login first");
            navigate("/login");
            return;
        }
        const confirmRequest=window.confirm("Are you sure you want to apply as seller?");
        if(!confirmRequest) return;
        try{
            const res=await applyasseller();
            console.log("response:",res);
            alert(res.message)
        }
        catch(error){
            alert(error)

        }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          ShopKart
        </Link>

        {/* Search */}
        
        <div className="md:flex-1 mx-6 relative max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border rounded-lg px-10 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-6">

          <button onClick={handleBecomeSeller}
            
            className="border border-indigo-600 text-indigo-600 px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-50"
          >
            Apply as Seller
          </button>
          <Link to="/">
          <button className="text-gray-700 hover:text-indigo-600" onClick={()=>{
                        const el= document.getElementById("products");
                        if(el){
                            el.scrollIntoView({behavior:"smooth"});
                        }
                    }}>
            Products
          </button>
          </Link>

          <Link to="/orders">
          <button className="text-gray-700 hover:text-indigo-600" 
            >
            Orders
          </button>
          </Link>
          <Link to= "/wishlist" className="relative text-gray-700 hover:text-indigo-600 text-xl">
          <FaHeart/>
          {wishlistCount>0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                {wishlistCount}
              </span>
          )}
          </Link>
          <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600 text-xl">
           <FaShoppingCart/> 
           {cartItems.length>0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-[4px]">
              {cartItems.length}
            </span>
           )}
          </Link>
          
          <div className="flex items-center gap-3">
          <Link to="/login" className="bg-indigo-600 item-center text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700">
            <div className= "flex items-center gap-2 cursor-pointer">
              <FaUser className="text-lg"/> Login
            </div>  
          </Link>

          {token && (
            <button onClick={handleLogout}
                    title="Logout"
                    className="text-red-600 hover:text-red-700 text-base font-bold"
            ><FaSignOutAlt/></button>    
          )}
          </div>
        </div>

        <Link to="/cart" onClick={()=>setOpen(false)}
         className="md:hidden text-xl text-gray-700 flex relative">
            <FaShoppingCart />
            {cartItems.length > 0 && (
            <span
              className="ml-auto absolute -top-2 -right-2
              bg-red-600 text-white text-[10px]
              min-w-[18px] h-[18px]
              rounded-full
              flex items-center justify-center
              px-[4px]"
            >
              {cartItems.length}
            </span>
            )}
          </Link>

          <Link to= "/wishlist" className="md:hidden text-xl text-gray-700 flex relative">
          <FaHeart/>
          {wishlistCount>0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                {wishlistCount}
              </span>
          )}
          </Link>

          <div className="md:hidden flex items-center gap-3 mr-3">
          <Link to="/login" className="md:hidden text-xl text-gray-700 mr-3">
              <FaUser />
          </Link>

          {token && (
            <button
              onClick={handleLogout}
              className="text-red-600 text-sm font-semibold"
              title="Logout"
            ><FaSignOutAlt/></button>
          )}
        </div>

        <button 
          onClick={()=>setOpen(!open)} className="md:hidden text-xl text-gray-700">
            {open? <FaTimes/> :<FaBars/>}
        </button>

        </div>

        {open&& (
          <div className="md:hidden border-t px-4 py-3 flex flex-col gap-4">
            
            <button onClick={handleBecomeSeller}
            to="/apply-seller"
            className="w-full border border-indigo-600 text-indigo-600 px-20 py-1.5 rounded-lg text-sm text-center hover:bg-indigo-50"
          >
            Apply as Seller
          </button>
            <Link
            to="/products"
            onClick={() => setOpen(false)}
            className="text-gray-700"
          >
            Products
          </Link>

          <Link
            to="/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-gray-700"
          >
            <FaFirstOrder />
            My Orders
          </Link>

          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-gray-700"
          >
            <FaShoppingCart />
            Cart
          </Link>

          <div className="flex items-center gap-4">
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-gray-700"
          >
            <FaUser />
            Login
          </Link>
          {token && (
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="text-red-600 text-sm font-semibold"
              ><FaSignOutAlt/></button>
            )}
          </div>
            </div>
            )}
      
    </nav>
  );
};

export default Navbar;


