//public route so No need auth,No need role
import express from 'express';
import { getAllCategories, getApprovedProducts, getSingleProduct, searchProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/products",getApprovedProducts);
router.get("/search",searchProduct);
router.get("/categories",getAllCategories);
router.get("/product/:id",getSingleProduct);
export default router;