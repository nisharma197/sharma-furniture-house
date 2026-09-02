import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import prisma from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../middleware/errorHandler";
import { loginSchema } from "../utils/validation";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new ApiError(401, "Invalid email or password");

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid email or password");

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d",
  };

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET as string,
    options
  );

  res.json({
    success: true,
    data: {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin!.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!admin) throw new ApiError(404, "Admin not found");
  res.json({ success: true, data: admin });
});
