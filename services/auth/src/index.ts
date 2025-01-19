import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { login, userRegistration, verifyToken } from "./controllers";



dotenv.config();
const app = express();
// middleware

app.use(express.json());
app.use(cors());
app.use(morgan("dotenv"));

app.get("/test", (_req, res) => {
  res.status(200).json("up");
});
// app.use((req, res, next) => {
//   const allowedOrigin = ["http://localhost:8081", "https://127.0.0.1:8081"];
//   const origin = req.headers.origin || "";
//   if (allowedOrigin.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//     next();
//   } else {
//     res.status(403).json("Forbidden");
//   }
// });

app.post("/auth/registration",userRegistration);
app.post("/auth/login",login);
app.post("/auth/verify_token",verifyToken);

// Not found
app.use((_req, res) => {
  res.status(404).json("404 Not Found");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ Message: "Something broke!" });
});

const port = process.env.PORT || 4003;
const servicesName = process.env.SERVICES_NAME || "Auth Services";
app.listen(port, () => {
  console.log(`${servicesName} listening on ${port}`);
});
