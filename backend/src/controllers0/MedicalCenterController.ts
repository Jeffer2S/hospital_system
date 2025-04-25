import { Request, Response } from "express";
import { MedicalCenterService } from "../services/MedicalCenterService";
import { ApiResponse, NotFoundError } from "../utils/response";
import { City } from "../entities/MedicalCenter";

export class MedicalCenterController {
  private medicalCenterService = new MedicalCenterService();

  async getAllCenters(req: Request, res: Response) {
    try {
      const centers = await this.medicalCenterService.findAll();
      res.json(ApiResponse.success("Medical centers retrieved successfully", centers));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving medical centers", error));
    }
  }

  async getCenterById(req: Request, res: Response) {
    try {
      const center = await this.medicalCenterService.findById(parseInt(req.params.id));
      res.json(ApiResponse.success("Medical center retrieved successfully", center));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error retrieving medical center", error));
      }
    }
  }

  async getCentersByCity(req: Request, res: Response) {
    try {
      const city = req.params.city as City;
      const centers = await this.medicalCenterService.findByCity(city);
      res.json(ApiResponse.success("Medical centers retrieved successfully", centers));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving medical centers", error));
    }
  }

  async createCenter(req: Request, res: Response) {
    try {
      const center = await this.medicalCenterService.create(req.body);
      res.status(201).json(ApiResponse.success("Medical center created successfully", center));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error creating medical center", error));
    }
  }

  async updateCenter(req: Request, res: Response) {
    try {
      const center = await this.medicalCenterService.update(parseInt(req.params.id), req.body);
      res.json(ApiResponse.success("Medical center updated successfully", center));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error updating medical center", error));
      }
    }
  }

  async toggleCenterStatus(req: Request, res: Response) {
    try {
      const center = await this.medicalCenterService.toggleStatus(parseInt(req.params.id));
      res.json(ApiResponse.success("Medical center status updated successfully", center));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error updating medical center status", error));
      }
    }
  }

  async deleteCenter(req: Request, res: Response) {
    try {
      await this.medicalCenterService.delete(parseInt(req.params.id));
      res.json(ApiResponse.success("Medical center deleted successfully"));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error deleting medical center", error));
      }
    }
  }
}
