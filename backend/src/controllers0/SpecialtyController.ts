import { Request, Response } from "express";
import { SpecialtyService } from "../services/SpecialtyService";
import { ApiResponse, NotFoundError } from "../utils/response";

export class SpecialtyController {
  private specialtyService = new SpecialtyService();

  async getAllSpecialties(req: Request, res: Response) {
    try {
      const specialties = await this.specialtyService.findAll();
      res.json(ApiResponse.success("Specialties retrieved successfully", specialties));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving specialties", error));
    }
  }

  async getSpecialtyById(req: Request, res: Response) {
    try {
      const specialty = await this.specialtyService.findById(parseInt(req.params.id));
      res.json(ApiResponse.success("Specialty retrieved successfully", specialty));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error retrieving specialty", error));
      }
    }
  }

  async createSpecialty(req: Request, res: Response) {
    try {
      const specialty = await this.specialtyService.create(req.body);
      res.status(201).json(ApiResponse.success("Specialty created successfully", specialty));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error creating specialty", error));
    }
  }

  async updateSpecialty(req: Request, res: Response) {
    try {
      const specialty = await this.specialtyService.update(parseInt(req.params.id), req.body);
      res.json(ApiResponse.success("Specialty updated successfully", specialty));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error updating specialty", error));
      }
    }
  }

  async deleteSpecialty(req: Request, res: Response) {
    try {
      await this.specialtyService.delete(parseInt(req.params.id));
      res.json(ApiResponse.success("Specialty deleted successfully"));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error deleting specialty", error));
      }
    }
  }
}
