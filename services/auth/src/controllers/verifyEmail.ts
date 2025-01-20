import { emailVerificationSchema } from "../schema";
import prisma from "../shared/prisma";
import AppError from "../shared/AppError";
import catchAsync from "../shared/catchAsync";
import axios from "axios";
const verifyEmail = catchAsync(async (req, res) => {
  const parseBody = emailVerificationSchema.safeParse(req.body);
  if (!parseBody.success) {
    throw new AppError(400, "parse error");
  }
  const user = await prisma.user.findUnique({
    where: {
      email: parseBody.data.email,
    },
  });
  if (!user) {
    throw new AppError(400, "user not fount");
  }
  // find verification Code
  const verification = await prisma.verificationCode.findFirst({
    where: {
      userId: user.id,
      code: parseBody.data.code,
    },
  });
  if (!verification) {
    throw new AppError(404, "code dose't Match");
  }
  if (verification.expireAt < new Date()) {
    throw new AppError(400, "verification code Expire");
  }
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      verified: true,
      status: "ACTIVE",
    },
  });
  await prisma.verificationCode.update({
    where: {
      id: verification.id,
    },
    data: {
      verifiedAt: new Date(),
    },
  });
  //send success email
  await axios.post(`${process.env.EMAIL_PROFILE}/emails/send`, {
    to: user.email,
    subject: "Email verified",
    text: "your email has been verified successfully",
    source: "verify email",
  });
});
export default verifyEmail