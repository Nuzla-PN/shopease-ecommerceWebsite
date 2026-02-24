import express from 'express';
import { addproduct,fetchSellerOrders,getMyProducts, getMySingleProduct, getSellerSingleOrder, sellerDashboard, shipOrder } from '../controllers/sellerController.js';
import { updateMyProduct,deleteMyProduct } from '../controllers/sellerController.js';
import {authMiddleware} from "../middleware/authMiddleware.js";
import {roleMiddleware} from "../middleware/roleMiddleware.js";
import upload from "../middleware/upload.js";
import sellerAccess from '../middleware/sellerAccess.middleware.js';


const router = express.Router();

router.get("/dashboard", authMiddleware, sellerAccess, sellerDashboard);
router.post("/addproduct",authMiddleware,sellerAccess,upload.array("images",5),addproduct);
router.put("/product/:id",authMiddleware,roleMiddleware("seller"),sellerAccess,upload.array("images",5),updateMyProduct)
router.delete("/product/:id",authMiddleware,roleMiddleware("seller"),sellerAccess,deleteMyProduct);
router.get("/getproducts",authMiddleware,roleMiddleware("seller"),sellerAccess,getMyProducts);
router.get("/product/:id",authMiddleware,roleMiddleware("seller"),sellerAccess,getMySingleProduct);

router.get("/orders",authMiddleware,sellerAccess,fetchSellerOrders);
router.get("/orders/:id",authMiddleware,sellerAccess,getSellerSingleOrder)
router.put("/orders/:id/ship",authMiddleware,sellerAccess,shipOrder);
export default router;
