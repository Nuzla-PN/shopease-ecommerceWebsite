import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUsercart } from "../../APIs/productAPI.js";
import { setCart } from "../../features/cart/cartSlice.js";

const MainLayout = () => {
  const dispatch = useDispatch();
  const token = useSelector((state)=>state.auth.token);

  useEffect(()=>{
    if(!token) return;

    const fetchCart = async ()=>{
      try{
        const data = await getUsercart();
        dispatch(setCart(data.cartitems));
      }catch(err){
        console.log("Failed to load cart");
      }
    };

    fetchCart();
  }, [token,dispatch]);
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
