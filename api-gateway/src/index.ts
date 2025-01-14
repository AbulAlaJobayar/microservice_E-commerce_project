import { Handler } from "./../node_modules/arg/index.d";
import express, { NextFunction, Request, response, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { configureRoute } from "./utils";

dotenv.config();
const app = express();
const port = process.env.PORT || 8081;

//security middleware
app.use(helmet());

//rate limiting middleware

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, //Limit each IP to 100 requests per `window` (here, per 15 minutes).

  handler: (req: Request, res: Response) => {
    res.status(409).json({
      message: "Too many requests, please try again later ",
    });
  },
});

app.use("/api", limiter);

// request Logger
app.use(morgan("dev"));
app.use(express.json());

// auth route


// route
configureRoute(app)

app.get("/health", (req, res) => {
  res.json({ message: "up" });
});
 //404 not found
 app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).json({
    message: "internal server error",
  });
});

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
