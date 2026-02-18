import {Routes,Route} from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import Home from "../components/home/Home.jsx";
import SingleProductDetails from "../pages/public/SingleProductDetailsPage.jsx";
import Login from "../pages/auth/Login.jsx";
import Signup from "../pages/auth/Register.jsx";
import MyCart from "../pages/user/MyCart.jsx";
import OrderSummary from "../pages/user/OrderSummary.jsx";
import MyWishlist from "../pages/user/MyWishlist.jsx";
import Order from "../pages/user/MyOrders.jsx";

const AppRoutes = ()=>{
  return (
    <Routes>
      <Route path = "/login" element = {<Login/>}/>
      <Route path = "/signup" element ={<Signup/>}/>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<SingleProductDetails/>}/>
        <Route path="/cart" element={<MyCart/>}/>
        <Route path="/order-summary" element={<OrderSummary/>}/>
        <Route path="/wishlist" element={<MyWishlist/>}/>
        <Route path="/orders" element={<Order/>}/>
      </Route>
    </Routes>
  );
};

export default AppRoutes;