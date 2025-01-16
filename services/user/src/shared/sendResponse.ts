import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  jsonData: {
    status: number;
    success: boolean;
    message: string;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data: T | undefined | null;
  }
) => {
  res.status(jsonData.status).json({
    success: jsonData.success,
    statusCode:jsonData.status,
    message: jsonData.message,
    meta: jsonData.meta || null || undefined,
    data: jsonData.data || null || undefined,
  });
};
export default sendResponse