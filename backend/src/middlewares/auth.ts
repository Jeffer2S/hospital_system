import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { UserRole } from "../entities/User";
import { UnauthorizedError, ForbiddenError } from "../utils/response";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authentication token is required");
    }

    const token = authHeader.split(" ")[1];
    const authService = new AuthService();
    const user = await authService.validateToken(token);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("You do not have permission to access this resource");
    }
    next();
  };
};
