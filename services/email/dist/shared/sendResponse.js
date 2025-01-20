"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, jsonData) => {
    res.status(jsonData.status).json({
        success: jsonData.success,
        statusCode: jsonData.status,
        message: jsonData.message,
        meta: jsonData.meta || null || undefined,
        data: jsonData.data || null || undefined,
    });
};
exports.default = sendResponse;
