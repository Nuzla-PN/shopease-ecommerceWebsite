import express from 'express';
import {applyasseller, getMyAddress, saveAddress} from '../controllers/userController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import { addToCart, getApprovedProducts, getCart, getSingleProduct, getWishlist, removeCart, searchProduct, toggleCartSelection, toggleWishlist, updateCartQuantity } from '../controllers/productController.js';
// import { placeOrder } from '../controllers/orderController.js';
import userAccess from '../middleware/userAccess.middleware.js';

const  router = express.Router();

router.post("/apply-seller",authMiddleware,userAccess,applyasseller);//because if user is bocked he cant be seller unless he is unblocked
router.get("/products",authMiddleware,userAccess,getApprovedProducts);//both home page users is public and users
router.get("/product/:id",authMiddleware,userAccess,getSingleProduct);
router.get("/products/search",authMiddleware,searchProduct);

router.post("/wishlist/:id" ,authMiddleware,toggleWishlist);
router.get("/wishlist",authMiddleware,getWishlist);

router.post("/cart",authMiddleware,userAccess,addToCart);
router.get("/cart",authMiddleware,userAccess,getCart);
router.delete("/cart/delete/:id",authMiddleware,userAccess,removeCart);
router.put("/cart/:id",authMiddleware,userAccess,updateCartQuantity);
router.put("/cart/select/:id",authMiddleware,userAccess,toggleCartSelection);
router.put("/address",authMiddleware,userAccess,saveAddress);
router.get("/address",authMiddleware,userAccess,getMyAddress);
// router.post("/order",authMiddleware,placeOrder);

export default router;
