import { Request, Response } from "express";
import { SpecialtyService } from "../services/SpecialtyService";
import { ApiResponse, NotFoundError } from "../utils/response";

/**
 * @swagger
 * tags:
 *   name: Especialidades Médicas
 *   description: Gestión de especialidades médicas
 */
export class SpecialtyController {
  private specialtyService = new SpecialtyService();

  /**
   * @swagger
   * /specialties:
   *   get:
   *     tags: [Especialidades Médicas]
   *     summary: Obtener todas las especialidades
   *     description: Devuelve una lista de todas las especialidades médicas registradas
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de especialidades médicas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Specialty'
   *       401:
   *         description: No autorizado
   */
  async getAllSpecialties(req: Request, res: Response) {
    try {
      const specialties = await this.specialtyService.findAll();
      res.json(ApiResponse.success("Specialties retrieved successfully", specialties));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving specialties", error));
    }
  }

  /**
   * @swagger
   * /specialties/{id}:
   *   get:
   *     tags: [Especialidades Médicas]
   *     summary: Obtener una especialidad por ID
   *     description: Devuelve la información de una especialidad médica específica
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
   *         description: Información de la especialidad médica
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Specialty'
   *       404:
   *         description: Especialidad no encontrada
   *       401:
   *         description: No autorizado
   */
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

  /**
   * @swagger
   * /specialties:
   *   post:
   *     tags: [Especialidades Médicas]
   *     summary: Crear una nueva especialidad
   *     description: Registra una nueva especialidad médica en el sistema
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Cardiología"
   *               description:
   *                 type: string
   *                 example: "Especialidad médica que se ocupa del corazón y sistema cardiovascular"
   *               isActive:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       201:
   *         description: Especialidad creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Specialty'
   *       400:
   *         description: Error en los datos proporcionados
   *       401:
   *         description: No autorizado
   */
  async createSpecialty(req: Request, res: Response) {
    try {
      const specialty = await this.specialtyService.create(req.body);
      res.status(201).json(ApiResponse.success("Specialty created successfully", specialty));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error creating specialty", error));
    }
  }

  /**
   * @swagger
   * /specialties/{id}:
   *   put:
   *     tags: [Especialidades Médicas]
   *     summary: Actualizar una especialidad
   *     description: Actualiza la información de una especialidad médica existente
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
   *               name:
   *                 type: string
   *                 example: "Cardiología Pediátrica"
   *               description:
   *                 type: string
   *                 example: "Subespecialidad de cardiología que trata problemas cardíacos en niños"
   *               isActive:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       200:
   *         description: Especialidad actualizada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Specialty'
   *       400:
   *         description: Error en los datos proporcionados
   *       404:
   *         description: Especialidad no encontrada
   *       401:
   *         description: No autorizado
   */
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

  /**
   * @swagger
   * /specialties/{id}:
   *   delete:
   *     tags: [Especialidades Médicas]
   *     summary: Eliminar una especialidad
   *     description: Elimina una especialidad médica del sistema
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
   *         description: Especialidad eliminada exitosamente
   *       404:
   *         description: Especialidad no encontrada
   *       401:
   *         description: No autorizado
   */
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