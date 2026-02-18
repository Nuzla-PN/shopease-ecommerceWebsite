import express from 'express';
import {approveSellerRequest, getAllOrdersForAdmin} from '../controllers/adminController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import { getAllProductsForAdmin,getAllUsers,getAllSellers } from '../controllers/adminController.js';
import {roleMiddleware} from '../middleware/roleMiddleware.js';
import { blockUnblockUserAccount,blockUnblockSellerAccount,approveProduct,rejectProduct } from '../controllers/adminController.js';

const router = express.Router();

router.put("/approve-seller/:userId",authMiddleware,roleMiddleware("admin"),approveSellerRequest);
router.get("/getallproducts",authMiddleware,roleMiddleware("admin"),getAllProductsForAdmin);
router.put("/product/approve/:id",authMiddleware,roleMiddleware("admin"),approveProduct);
router.put("/product/reject/:id",authMiddleware,roleMiddleware("admin"),rejectProduct);
router.get("/getallusers",authMiddleware,roleMiddleware("admin"),getAllUsers);
router.put("/user/block-unblock/:id",authMiddleware,roleMiddleware("admin"),blockUnblockUserAccount);
router.get("/getallsellers",authMiddleware,roleMiddleware("admin"),getAllSellers);
router.put("/seller/block-unblock/:id",authMiddleware,roleMiddleware("admin"),blockUnblockSellerAccount);
router.get("/allorders",authMiddleware,roleMiddleware("admin"),getAllOrdersForAdmin);
export default router;