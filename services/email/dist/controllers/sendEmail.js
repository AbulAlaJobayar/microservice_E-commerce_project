"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../shared/catchAsync"));
const schema_1 = require("../schema");
const AppError_1 = __importDefault(require("../shared/AppError"));
const config_1 = require("../config");
const prisma_1 = __importDefault(require("../shared/prisma"));
const sendResponse_1 = __importDefault(require("../shared/sendResponse"));
const sendEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseBody = schema_1.createEmailSchema.safeParse(req.body);
    if (!parseBody.success) {
        throw new AppError_1.default(400, "parse error");
    }
    //create email option
    const { recipient, subject, sender, body, source } = parseBody.data;
    const form = sender || process.env.DEFAULT_SENDER_EMAIL || "admin@gmail.com";
    const mailOption = {
        form,
        to: recipient,
        subject,
        text: body,
    };
    //send mail
    const { rejected } = yield config_1.transporter.sendMail(mailOption);
    if (rejected.length) {
        throw new AppError_1.default(500, "rejected");
    }
    yield prisma_1.default.email.create({
        data: {
            sender: form,
            recipient,
            subject,
            body,
            source,
        },
    });
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: "Email sent successfully",
        data: null,
    });
}));
exports.default = sendEmail;
