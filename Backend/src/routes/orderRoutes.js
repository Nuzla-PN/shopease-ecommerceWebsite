import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getOrderSummary,ConfirmOrder, BuyNowAddtoCart, ViewMyOrders, CancelOrder} from '../controllers/orderController.js';
import userAccess from '../middleware/userAccess.middleware.js';


const router = express.Router();

router.post("/buyNow",authMiddleware,userAccess,BuyNowAddtoCart);
router.get("/placeorder",authMiddleware,userAccess,getOrderSummary);//when clicked going to summary page.
router.post("/confirmOrder",authMiddleware,userAccess,ConfirmOrder)//when clicked shows Order placed succesfully
router.get("/myorders",authMiddleware,userAccess,ViewMyOrders);
router.put("/cancelOrder/:id",authMiddleware,userAccess,CancelOrder);




export default router;