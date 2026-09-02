import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler";

export interface AuthPayload {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "EDITOR";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication required"));
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    req.admin = payload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

// Attaches req.admin when a valid token is present, but never blocks the request.
// Used on public GET routes so admins previewing the site also see inactive/draft items.
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return next();

  const token = header.split(" ")[1];
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
  } catch {
    // ignore invalid token on public routes
  }
  next();
};

export const requireRole = (...roles: AuthPayload["role"][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    next();
  };
};
