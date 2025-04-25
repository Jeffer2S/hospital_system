import jwt from "jsonwebtoken";
import { UserService } from "./UserService";
import { User } from "../entities/User";
import { config } from "../config/env";
import { BadRequestError, UnauthorizedError } from "../utils/response";

export class AuthService {
  private userService = new UserService();

  async register(userData: Partial<User>): Promise<User> {
    return await this.userService.create(userData);
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // if (!user.isActive) {
    //   throw new UnauthorizedError("User account is inactive");
    // }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    if (!config.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the configuration");
    }

    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: "24h",
    });
  }

  async validateToken(token: string): Promise<User> {
    try {
      if (!config.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the configuration");
      }
      const decoded = jwt.verify(token, config.JWT_SECRET) as any;
      const user = await this.userService.findById(decoded.id);

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      return user;
    } catch (error) {
      throw new UnauthorizedError("Invalid token");
    }
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userService.findById(userId);

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestError("Current password is incorrect");
    }

    user.password = newPassword;
    await this.userService.update(userId, user);
  }
}
