"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dotenv"));
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
// app.post("/auth/registration",userRegistration);
// app.post("/auth/login",login);
// app.post("/auth/verify_token",verifyToken);
// Not found
app.use((_req, res) => {
    res.status(404).json("404 Not Found");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ Message: "Something broke!" });
});
const port = process.env.PORT || 4003;
const servicesName = process.env.SERVICES_NAME || "Auth Services";
app.listen(port, () => {
    console.log(`${servicesName} listening on ${port}`);
});
