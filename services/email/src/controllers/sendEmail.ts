import { Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import { createEmailSchema } from "../schema";
import AppError from "../shared/AppError";
import { transporter } from "../config";
import prisma from "../shared/prisma";
import sendResponse from "../shared/sendResponse";

const sendEmail = catchAsync(async (req: Request, res: Response) => {
  const parseBody = createEmailSchema.safeParse(req.body);

  if (!parseBody.success) {
    throw new AppError(400, "parse error");
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
  const { rejected } = await transporter.sendMail(mailOption);
  if (rejected.length) {
    throw new AppError(500, "rejected");
  }
  await prisma.email.create({
    data: {
      sender: form,
      recipient,
      subject,
      body,
      source,
    },
  });
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Email sent successfully",
    data: null,
  });
});
export default sendEmail;
