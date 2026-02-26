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
import {SellerRoute,AdminRoute } from "./ProtectedRoute.jsx";
import { SellerLayout } from "../pages/seller/sellerLayout.jsx";
import SellerViewProduct from "../pages/seller/SellerViewProduct.jsx";
import SellerOrderDetailsPage from "../pages/seller/sellerOrderdetailsPage.jsx";
import AdminLayout from "../pages/admin/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminUsers from "../pages/admin/AllUsers.jsx";
import AdminSellers from "../pages/admin/AllSellers.jsx";
import SellerRequests from "../pages/admin/SellerRequestList.jsx";
import AdminProductsApproval from "../pages/admin/ApproveProducts.jsx";
import AdminOrders from "../pages/admin/AllOrders.jsx";


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

      {/*Admin Routes*/}
      <Route path="/admin" element={<AdminRoute><AdminLayout/></AdminRoute>}>
        <Route path="/admin" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
        <Route path = "/admin/users" element={<AdminRoute><AdminUsers/></AdminRoute>}/>
        <Route path = "/admin/sellers" element ={<AdminRoute><AdminSellers/></AdminRoute>}/>
        <Route path = "/admin/seller-requests" element ={<AdminRoute><SellerRequests/></AdminRoute>}/>
        <Route path = "/admin/products" element = {<AdminRoute><AdminProductsApproval/></AdminRoute>}/>
        <Route path = "/admin/orders" element = {<AdminRoute><AdminOrders/></AdminRoute>}/>
        
        </Route>
</Routes>
  );
};

export default AppRoutes;