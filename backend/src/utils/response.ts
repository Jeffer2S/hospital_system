export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class ApiResponse {
  success: boolean;
  message: string;
  data?: any;

  constructor(success: boolean, message: string, data?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success(message: string, data?: any): ApiResponse {
    return new ApiResponse(true, message, data);
  }

  static error(message: string, error?: any): ApiResponse {
    return new ApiResponse(false, message, error);
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
