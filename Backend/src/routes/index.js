//2

import { Router } from 'express';
import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import orderRoutes from "./orderRoutes.js";
 import productRoutes from "./productRoutes.js";
 import sellerRoutes from "./sellerRoutes.js";
 import userRoutes from "./userRoutes.js";

const router = Router(); 

router.use('/api/admin',adminRoutes);
 router.use('/api/auth',authRoutes);
router.use('/api/orders',orderRoutes);
router.use('/api',productRoutes);
router.use('/api/seller',sellerRoutes);
 router.use('/api/users',userRoutes);

export default router;