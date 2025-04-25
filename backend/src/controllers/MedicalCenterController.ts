import { Request, Response } from "express";
import { MedicalCenterService } from "../services/MedicalCenterService";
import { ApiResponse, NotFoundError } from "../utils/response";
import { City } from "../entities/MedicalCenter";

/**
 * @swagger
 * tags:
 *   name: Centros Médicos
 *   description: Gestión de centros médicos
 */
export class MedicalCenterController {
  private medicalCenterService = new MedicalCenterService();

  /**
   * @swagger
   * /medical-centers:
   *   get:
   *     tags: [Centros Médicos]
   *     summary: Obtener todos los centros médicos
   *     description: Devuelve una lista de todos los centros médicos registrados
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de centros médicos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MedicalCenter'
   *       401:
   *         description: No autorizado
   */
  async getAllCenters(req: Request, res: Response) {
    try {
      const centers = await this.medicalCenterService.findAll();
      res.json(ApiResponse.success("Medical centers retrieved successfully", centers));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving medical centers", error));
    }
  }

  /**
   * @swagger
   * /medical-centers/{id}:
   *   get:
   *     tags: [Centros Médicos]
   *     summary: Obtener un centro médico por ID
   *     description: Devuelve la información de un centro médico específico
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
   *         description: Información del centro médico
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MedicalCenter'
   *       404:
   *         description: Centro médico no encontrado
   *       401:
   *         description: No autorizado
   */
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

  /**
   * @swagger
   * /medical-centers/city/{city}:
   *   get:
   *     tags: [Centros Médicos]
   *     summary: Obtener centros médicos por ciudad
   *     description: Devuelve una lista de centros médicos en una ciudad específica
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: city
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/City'
   *         example: "BOGOTA"
   *     responses:
   *       200:
   *         description: Lista de centros médicos en la ciudad especificada
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MedicalCenter'
   *       401:
   *         description: No autorizado
   */
  async getCentersByCity(req: Request, res: Response) {
    try {
      const city = req.params.city as City;
      const centers = await this.medicalCenterService.findByCity(city);
      res.json(ApiResponse.success("Medical centers retrieved successfully", centers));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving medical centers", error));
    }
  }

  /**
   * @swagger
   * /medical-centers:
   *   post:
   *     tags: [Centros Médicos]
   *     summary: Crear un nuevo centro médico
   *     description: Registra un nuevo centro médico en el sistema
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
   *                 example: "Clínica Sanitas"
   *               address:
   *                 type: string
   *                 example: "Calle 123 #45-67"
   *               city:
   *                 $ref: '#/components/schemas/City'
   *                 example: "BOGOTA"
   *               phone:
   *                 type: string
   *                 example: "+5712345678"
   *               email:
   *                 type: string
   *                 example: "contacto@sanitas.com"
   *               isActive:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       201:
   *         description: Centro médico creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MedicalCenter'
   *       400:
   *         description: Error en los datos proporcionados
   *       401:
   *         description: No autorizado
   */
  async createCenter(req: Request, res: Response) {
    try {
      const center = await this.medicalCenterService.create(req.body);
      res.status(201).json(ApiResponse.success("Medical center created successfully", center));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error creating medical center", error));
    }
  }

  /**
   * @swagger
   * /medical-centers/{id}:
   *   put:
   *     tags: [Centros Médicos]
   *     summary: Actualizar un centro médico
   *     description: Actualiza la información de un centro médico existente
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
   *                 example: "Clínica Sanitas Actualizada"
   *               address:
   *                 type: string
   *                 example: "Calle 123 #45-67"
   *               city:
   *                 $ref: '#/components/schemas/City'
   *                 example: "BOGOTA"
   *               phone:
   *                 type: string
   *                 example: "+5712345678"
   *               email:
   *                 type: string
   *                 example: "contacto@sanitas.com"
   *     responses:
   *       200:
   *         description: Centro médico actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MedicalCenter'
   *       400:
   *         description: Error en los datos proporcionados
   *       404:
   *         description: Centro médico no encontrado
   *       401:
   *         description: No autorizado
   */
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

  /**
   * @swagger
   * /medical-centers/{id}/toggle-status:
   *   patch:
   *     tags: [Centros Médicos]
   *     summary: Cambiar estado de un centro médico
   *     description: Activa o desactiva un centro médico
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
   *         description: Estado del centro médico actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MedicalCenter'
   *       404:
   *         description: Centro médico no encontrado
   *       401:
   *         description: No autorizado
   */
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

  /**
   * @swagger
   * /medical-centers/{id}:
   *   delete:
   *     tags: [Centros Médicos]
   *     summary: Eliminar un centro médico
   *     description: Elimina un centro médico del sistema
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
   *         description: Centro médico eliminado exitosamente
   *       404:
   *         description: Centro médico no encontrado
   *       401:
   *         description: No autorizado
   */
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