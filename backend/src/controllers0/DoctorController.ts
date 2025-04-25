import { Request, Response } from "express";
import { DoctorService } from "../services/DoctorService";
import { ApiResponse, BadRequestError, NotFoundError } from "../utils/response";

export class DoctorController {
  private doctorService = new DoctorService();

  async getAllDoctors(req: Request, res: Response) {
    try {
      const doctors = await this.doctorService.findAll();
      res.json(ApiResponse.success("Doctors retrieved successfully", doctors));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving doctors", error));
    }
  }

  async getDoctorById(req: Request, res: Response) {
    try {
      const doctor = await this.doctorService.findById(parseInt(req.params.id));
      res.json(ApiResponse.success("Doctor retrieved successfully", doctor));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error retrieving doctor", error));
      }
    }
  }

  async getDoctorsByMedicalCenter(req: Request, res: Response) {
    try {
      const doctors = await this.doctorService.findByMedicalCenter(parseInt(req.params.medicalCenterId));
      res.json(ApiResponse.success("Doctors retrieved successfully", doctors));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving doctors", error));
    }
  }

  async getDoctorsBySpecialty(req: Request, res: Response) {
    try {
      const doctors = await this.doctorService.findBySpecialty(parseInt(req.params.specialtyId));
      res.json(ApiResponse.success("Doctors retrieved successfully", doctors));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving doctors", error));
    }
  }

  async createDoctor(req: Request, res: Response) {
    try {
      const doctor = await this.doctorService.create(req.body);
      res.status(201).json(ApiResponse.success("Doctor created successfully", doctor));
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        res.status(400).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error creating doctor", error));
      }
    }
  }

  async updateDoctor(req: Request, res: Response) {
    try {
      const doctor = await this.doctorService.update(parseInt(req.params.id), req.body);
      res.json(ApiResponse.success("Doctor updated successfully", doctor));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error updating doctor", error));
      }
    }
  }

  async deleteDoctor(req: Request, res: Response) {
    try {
      await this.doctorService.delete(parseInt(req.params.id));
      res.json(ApiResponse.success("Doctor deleted successfully"));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error deleting doctor", error));
      }
    }
  }
}
