import express from "express";
import { initiatePayment, handleCallback } from "../controllers/mpesaController.js";

const router = express.Router();

// Client → initiate payment
router.post("/pay", initiatePayment);

// Safaricom → callback after STK push
router.post("/callback", handleCallback);

export default router;
