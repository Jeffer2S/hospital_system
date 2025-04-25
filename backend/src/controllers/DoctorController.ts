import { Request, Response } from "express";
import { DoctorService } from "../services/DoctorService";
import { ApiResponse, BadRequestError, NotFoundError } from "../utils/response";

/**
 * @swagger
 * tags:
 *   name: Doctores
 *   description: Gestión de médicos
 */
export class DoctorController {
  private doctorService = new DoctorService();

  /**
   * @swagger
   * /doctors:
   *   get:
   *     tags: [Doctores]
   *     summary: Obtener todos los doctores
   *     description: Devuelve una lista de todos los médicos registrados
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de doctores
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Doctor'
   *       401:
   *         description: No autorizado
   */
  async getAllDoctors(req: Request, res: Response) {
    try {
      const doctors = await this.doctorService.findAll();
      res.json(ApiResponse.success("Doctors retrieved successfully", doctors));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving doctors", error));
    }
  }

  /**
   * @swagger
   * /doctors/{id}:
   *   get:
   *     tags: [Doctores]
   *     summary: Obtener un doctor por ID
   *     description: Devuelve la información de un médico específico
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *     responses:
   *       200:
   *         description: Información del doctor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Doctor'
   *       404:
   *         description: Doctor no encontrado
   *       401:
   *         description: No autorizado
   */
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

  /**
   * @swagger
   * /doctors/medical-center/{medicalCenterId}:
   *   get:
   *     tags: [Doctores]
   *     summary: Obtener doctores por centro médico
   *     description: Devuelve una lista de médicos de un centro médico específico
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: medicalCenterId
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *     responses:
   *       200:
   *         description: Lista de doctores del centro médico
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Doctor'
   *       401:
   *         description: No autorizado
   */
  async getDoctorsByMedicalCenter(req: Request, res: Response) {
    try {
      const doctors = await this.doctorService.findByMedicalCenter(parseInt(req.params.medicalCenterId));
      res.json(ApiResponse.success("Doctors retrieved successfully", doctors));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving doctors", error));
    }
  }

  /**
   * @swagger
   * /doctors/specialty/{specialtyId}:
   *   get:
   *     tags: [Doctores]
   *     summary: Obtener doctores por especialidad
   *     description: Devuelve una lista de médicos de una especialidad específica
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: specialtyId
   *         required: true
   *         schema:
   *           type: integer
   *         example: 2
   *     responses:
   *       200:
   *         description: Lista de doctores de la especialidad
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Doctor'
   *       401:
   *         description: No autorizado
   */
  async getDoctorsBySpecialty(req: Request, res: Response) {
    try {
      const doctors = await this.doctorService.findBySpecialty(parseInt(req.params.specialtyId));
      res.json(ApiResponse.success("Doctors retrieved successfully", doctors));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving doctors", error));
    }
  }

  /**
   * @swagger
   * /doctors:
   *   post:
   *     tags: [Doctores]
   *     summary: Crear un nuevo doctor
   *     description: Registra un nuevo médico en el sistema
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *                 example: "Juan"
   *               lastName:
   *                 type: string
   *                 example: "Pérez"
   *               specialtyId:
   *                 type: integer
   *                 example: 1
   *               medicalCenterId:
   *                 type: integer
   *                 example: 1
   *               email:
   *                 type: string
   *                 example: "juan.perez@example.com"
   *               phone:
   *                 type: string
   *                 example: "+1234567890"
   *     responses:
   *       201:
   *         description: Doctor creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Doctor'
   *       400:
   *         description: Error en los datos proporcionados
   *       401:
   *         description: No autorizado
   */
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

  /**
   * @swagger
   * /doctors/{id}:
   *   put:
   *     tags: [Doctores]
   *     summary: Actualizar un doctor
   *     description: Actualiza la información de un médico existente
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *                 example: "Juan"
   *               lastName:
   *                 type: string
   *                 example: "Pérez"
   *               specialtyId:
   *                 type: integer
   *                 example: 1
   *               medicalCenterId:
   *                 type: integer
   *                 example: 1
   *               email:
   *                 type: string
   *                 example: "juan.perez@example.com"
   *               phone:
   *                 type: string
   *                 example: "+1234567890"
   *     responses:
   *       200:
   *         description: Doctor actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Doctor'
   *       400:
   *         description: Error en los datos proporcionados
   *       404:
   *         description: Doctor no encontrado
   *       401:
   *         description: No autorizado
   */
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

  /**
   * @swagger
   * /doctors/{id}:
   *   delete:
   *     tags: [Doctores]
   *     summary: Eliminar un doctor
   *     description: Elimina un médico del sistema
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *     responses:
   *       200:
   *         description: Doctor eliminado exitosamente
   *       404:
   *         description: Doctor no encontrado
   *       401:
   *         description: No autorizado
   */
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