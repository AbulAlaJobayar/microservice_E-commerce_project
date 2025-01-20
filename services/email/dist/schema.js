"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailSchema = void 0;
const zod_1 = require("zod");
exports.createEmailSchema = zod_1.z.object({
    recipient: zod_1.z.string().email(),
    subject: zod_1.z.string(),
    body: zod_1.z.string(),
    source: zod_1.z.string(),
    sender: zod_1.z.string().email().optional()
});
