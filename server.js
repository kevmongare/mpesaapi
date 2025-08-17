import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mpesaRoutes from "./routes/mpesa.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/mpesa", mpesaRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 M-Pesa Mini App running on http://localhost:${PORT}`));
