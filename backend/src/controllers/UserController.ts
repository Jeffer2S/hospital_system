import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { ApiResponse, BadRequestError, NotFoundError } from "../utils/response";

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema (médicos, pacientes y administradores)
 */
export class UserController {
  private userService = new UserService();

  /**
   * @swagger
   * /users:
   *   get:
   *     tags: [Usuarios]
   *     summary: Obtener todos los usuarios
   *     description: Devuelve una lista de todos los usuarios registrados en el sistema
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuarios
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       401:
   *         description: No autorizado
   *       403:
   *         description: Acceso prohibido (requiere rol de administrador)
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.findAll();
      res.json(ApiResponse.success("Users retrieved successfully", users));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving users", error));
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     tags: [Usuarios]
   *     summary: Obtener un usuario por ID
   *     description: Devuelve la información detallada de un usuario específico
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
   *         description: Información del usuario
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: Usuario no encontrado
   *       401:
   *         description: No autorizado
   */
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

  /**
   * @swagger
   * /users:
   *   post:
   *     tags: [Usuarios]
   *     summary: Crear un nuevo usuario
   *     description: Registra un nuevo usuario en el sistema (médico, paciente o administrador)
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
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "juan.perez@example.com"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: "Password123!"
   *               role:
   *                 type: string
   *                 enum: [DOCTOR, PATIENT, ADMIN]
   *                 example: "PATIENT"
   *               phone:
   *                 type: string
   *                 example: "+573001234567"
   *               isActive:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       201:
   *         description: Usuario creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Error en los datos (email duplicado, contraseña inválida, etc.)
   *       401:
   *         description: No autorizado
   *       403:
   *         description: Acceso prohibido (requiere rol de administrador)
   */
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

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     tags: [Usuarios]
   *     summary: Actualizar un usuario
   *     description: Actualiza la información de un usuario existente
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
   *                 example: "Juan Carlos"
   *               lastName:
   *                 type: string
   *                 example: "Pérez Gómez"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "juan.perez@example.com"
   *               phone:
   *                 type: string
   *                 example: "+573001234567"
   *               isActive:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       200:
   *         description: Usuario actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Error en los datos proporcionados
   *       401:
   *         description: No autorizado
   *       403:
   *         description: Acceso prohibido
   *       404:
   *         description: Usuario no encontrado
   */
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

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     tags: [Usuarios]
   *     summary: Eliminar un usuario
   *     description: Elimina un usuario del sistema (eliminación lógica)
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
   *         description: Usuario eliminado exitosamente
   *       401:
   *         description: No autorizado
   *       403:
   *         description: Acceso prohibido (requiere rol de administrador)
   *       404:
   *         description: Usuario no encontrado
   */
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

  /**
   * @swagger
   * /users/doctors:
   *   get:
   *     tags: [Usuarios]
   *     summary: Obtener todos los médicos
   *     description: Devuelve una lista de todos los usuarios con rol de médico
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de médicos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       401:
   *         description: No autorizado
   */
  async getDoctors(req: Request, res: Response) {
    try {
      const doctors = await this.userService.getDoctors();
      res.json(ApiResponse.success("Doctors retrieved successfully", doctors));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving doctors", error));
    }
  }

  /**
   * @swagger
   * /users/patients:
   *   get:
   *     tags: [Usuarios]
   *     summary: Obtener todos los pacientes
   *     description: Devuelve una lista de todos los usuarios con rol de paciente
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de pacientes
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       401:
   *         description: No autorizado
   */
  async getPatients(req: Request, res: Response) {
    try {
      const patients = await this.userService.getPatients();
      res.json(ApiResponse.success("Patients retrieved successfully", patients));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error retrieving patients", error));
    }
  }
}