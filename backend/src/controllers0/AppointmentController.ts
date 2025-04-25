import { Request, Response } from "express";
import { AppointmentService } from "../services/AppointmentService";
import { ApiResponse, BadRequestError, NotFoundError } from "../utils/response";
/**
 * @swagger
 * tags:
 *   name: Citas Médicas
 *   description: Gestión de citas médicas
 */
export class AppointmentController {
  private appointmentService = new AppointmentService();

  /**
   * Recupera todas las citas médicas de la base de datos.
   *
   * @param req - El objeto de solicitud HTTP.
   * @param res - El objeto de respuesta HTTP.
   * @returns Una respuesta JSON que contiene un mensaje de éxito y la lista de citas,
   *          o un mensaje de error si la operación falla.
   *
   * @throws {Error} Si ocurre un problema al recuperar las citas.
   */
  async getAllAppointments(req: Request, res: Response) {
    try {
      const appointments = await this.appointmentService.findAll();
      res.json(ApiResponse.success("Appointments retrieved successfully", appointments));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving appointments", error));
    }
  }

  async getAppointmentById(req: Request, res: Response) {
    try {
      const appointment = await this.appointmentService.findById(parseInt(req.params.id));
      res.json(ApiResponse.success("Appointment retrieved successfully", appointment));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error retrieving appointment", error));
      }
    }
  }
  /**
   * @swagger
   * /appointments/patient/{patientId}:
   *   get:
   *     tags: [Citas Médicas]
   *     summary: Obtener citas por paciente
   *     description: Devuelve todas las citas de un paciente específico
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: patientId
   *         required: true
   *         schema:
   *           type: integer
   *         example: 2
   *     responses:
   *       200:
   *         description: Lista de citas del paciente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Appointment'
   *       401:
   *         description: No autorizado
   */
  async getAppointmentsByPatient(req: Request, res: Response) {
    try {
      const appointments = await this.appointmentService.findByPatient(parseInt(req.params.patientId));
      res.json(ApiResponse.success("Appointments retrieved successfully", appointments));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving appointments", error));
    }
  }

  async getAppointmentsByDoctor(req: Request, res: Response) {
    try {
      const appointments = await this.appointmentService.findByDoctor(parseInt(req.params.doctorId));
      res.json(ApiResponse.success("Appointments retrieved successfully", appointments));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving appointments", error));
    }
  }

  async getAppointmentsByDate(req: Request, res: Response) {
    try {
      const date = new Date(req.params.date);
      const appointments = await this.appointmentService.findByDate(date);
      res.json(ApiResponse.success("Appointments retrieved successfully", appointments));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving appointments", error));
    }
  }
  /**
   * @swagger
   * /appointments:
   *   post:
   *     tags: [Citas Médicas]
   *     summary: Crear una nueva cita
   *     description: Programa una nueva cita médica
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               patientId:
   *                 type: integer
   *                 example: 2
   *               doctorId:
   *                 type: integer
   *                 example: 1
   *               appointmentDate:
   *                 type: string
   *                 format: date
   *                 example: "2023-12-15"
   *               appointmentTime:
   *                 type: string
   *                 format: time
   *                 example: "14:30:00"
   *     responses:
   *       201:
   *         description: Cita creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Appointment'
   *       400:
   *         description: Error en los datos o conflicto de horario
   *       401:
   *         description: No autorizado
   */
  async createAppointment(req: Request, res: Response) {
    try {
      const appointment = await this.appointmentService.create(req.body);
      res.status(201).json(ApiResponse.success("Appointment created successfully", appointment));
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        res.status(400).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error creating appointment", error));
      }
    }
  }

  async updateAppointmentStatus(req: Request, res: Response) {
    try {
      const appointment = await this.appointmentService.updateStatus(parseInt(req.params.id), req.body.status);
      res.json(ApiResponse.success("Appointment status updated successfully", appointment));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error updating appointment status", error));
      }
    }
  }

  async deleteAppointment(req: Request, res: Response) {
    try {
      await this.appointmentService.delete(parseInt(req.params.id));
      res.json(ApiResponse.success("Appointment deleted successfully"));
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json(ApiResponse.error(error.message));
      } else {
        res.status(500).json(ApiResponse.error("Error deleting appointment", error));
      }
    }
  }
}
