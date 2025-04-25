import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { ApiResponse, BadRequestError, NotFoundError } from "../utils/response";

export class UserController {
  private userService = new UserService();

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.findAll();
      res.json(ApiResponse.success("Users retrieved successfully", users));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving users", error));
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.findById(parseInt(req.params.id));
      res.json(ApiResponse.success("User retrieved successfully", user));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error retrieving user", error));
      }
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(ApiResponse.success("User created successfully", user));
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(400).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error creating user", error));
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userService.update(parseInt(req.params.id), req.body);
      res.json(ApiResponse.success("User updated successfully", user));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error updating user", error));
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await this.userService.delete(parseInt(req.params.id));
      res.json(ApiResponse.success("User deleted successfully"));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error deleting user", error));
      }
    }
  }

  async getDoctors(req: Request, res: Response) {
    try {
      const doctors = await this.userService.getDoctors();
      res.json(ApiResponse.success("Doctors retrieved successfully", doctors));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving doctors", error));
    }
  }

  async getPatients(req: Request, res: Response) {
    try {
      const patients = await this.userService.getPatients();
      res.json(ApiResponse.success("Patients retrieved successfully", patients));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving patients", error));
    }
  }
}
