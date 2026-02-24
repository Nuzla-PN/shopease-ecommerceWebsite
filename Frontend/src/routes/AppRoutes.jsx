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
import SellerDashboard from "../pages/seller/SellerDashboard.jsx";
import SellerAddProduct from "../pages/seller/sellerAddProduct.jsx";
import SellerProducts from "../pages/seller/sellerProduct.jsx";
import SellerOrders from "../pages/seller/sellerorders.jsx";
import SellerRoute from "./ProtectedRoute.jsx";
import { SellerLayout } from "../pages/seller/sellerLayout.jsx";
import SellerViewProduct from "../pages/seller/SellerViewProduct.jsx";
import SellerOrderDetailsPage from "../pages/seller/sellerOrderdetailsPage.jsx";


const AppRoutes = ()=>{
  return (
    <Routes>
      <Route path = "/login" element = {<Login/>}/>
      <Route path = "/signup" element ={<Signup/>}/>

       {/* seller Routes */}
        <Route path ="/seller" element = {<SellerLayout/>}>
        <Route path="/seller/dashboard" element={<SellerRoute> <SellerDashboard /> </SellerRoute>} />
        <Route path = "/seller/products" element = {<SellerRoute> <SellerProducts/> </SellerRoute>}/>
        <Route path = "/seller/view-product/:id" element={<SellerRoute><SellerViewProduct/></SellerRoute>}/>
        <Route path="/seller/add-product" element={<SellerRoute> <SellerAddProduct /> </SellerRoute>} />
        <Route path="/seller/orders" element={<SellerRoute> <SellerOrders /> </SellerRoute>} />
        <Route path="/seller/orders/:id" element={<SellerRoute> <SellerOrderDetailsPage /> </SellerRoute>} />
        <Route path="/seller/products/edit/:id" element={<SellerRoute> <SellerAddProduct /> </SellerRoute>} />
        </Route>

      <Route element={<MainLayout />}>
      {/* user Routes */}
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