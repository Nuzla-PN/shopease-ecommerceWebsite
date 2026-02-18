import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get("/", authController.home);
router.post("/register", authController.signUp);
router.post("/login", authController.Login);
export default router;