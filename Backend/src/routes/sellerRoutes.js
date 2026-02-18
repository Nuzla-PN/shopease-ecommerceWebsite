import express from 'express';
import { addproduct,getMyProducts } from '../controllers/sellerController.js';
import { updateMyProduct,deleteMyProduct } from '../controllers/sellerController.js';
import {authMiddleware} from "../middleware/authMiddleware.js";
import {roleMiddleware} from "../middleware/roleMiddleware.js";
import upload from "../middleware/upload.js";
import sellerAccess from '../middleware/sellerAccess.middleware.js';


const router = express.Router();

router.post("/addproduct",authMiddleware,sellerAccess,upload.array("images",5),addproduct);
router.put("/product/:id",authMiddleware,roleMiddleware("seller"),sellerAccess,upload.array("images",5),updateMyProduct)
router.delete("/product/:id",authMiddleware,roleMiddleware("seller"),sellerAccess,deleteMyProduct);
router.get("/getproducts",authMiddleware,roleMiddleware("seller"),sellerAccess,getMyProducts);
export default router;
