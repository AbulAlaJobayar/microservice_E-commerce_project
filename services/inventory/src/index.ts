import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
const app = express();
// middleware

app.use(express.json());
app.use(cors());
app.use(morgan("dotenv"));

app.get("/health", (_req, res) => {
  res.status(200).json("up");
});

// Not found
app.use((_req, res) => {
  res.status(404).json("404 Not Found");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ Message: "Something broke!" });
});
