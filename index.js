import dotenv from "dotenv";
import express from 'express';
import router from './route/userAuthRoutes.js';
import dns from 'dns';
import cors from "cors";
import databaseConnection from "./config/databaseConnection.js";
import productRouter from './route/productRoutes.js';

dotenv.config();
const PORT = 8000;
dns.setDefaultResultOrder('ipv4first');

dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
]);

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


await databaseConnection()
app.use("/api",router)

app.use("/api/product",productRouter)

// // Express Custom Error Handler
// app.use((err, req, res, next) => {
//   console.error("GLOBAL ERROR HANDLER:", err);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     error: typeof err === "object" ? err : String(err)
//   });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});