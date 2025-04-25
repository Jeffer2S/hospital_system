import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { ApiResponse } from "../utils/response";
/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Registro y manejo de sesiones
 */
export class AuthController {
  private authService = new AuthService();
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     tags: [Autenticación]
   *     summary: Registrar un nuevo usuario
   *     description: Crea una nueva cuenta de usuario en el sistema
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *             required:
   *               - dni
   *               - name
   *               - email
   *               - password
   *               - role
   *             example:
   *               dni: "1712345678"
   *               name: "Paciente Nuevo"
   *               email: "paciente@example.com"
   *               password: "Password123"
   *               role: "patient"
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "User registered successfully"
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Error en los datos de entrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               message: "Validation error"
   *               data:
   *                 error: "Email already in use"
   */
  async register(req: Request, res: Response) {
    try {
      const user = await this.authService.register(req.body);
      const token = this.authService.generateToken(user);

      res.status(201).json(
        ApiResponse.success("User registered successfully", {
          user,
          token,
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json(ApiResponse.error(errorMessage));
    }
  }
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags: [Autenticación]
   *     summary: Iniciar sesión
   *     description: Autentica un usuario y devuelve un token JWT
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "paciente@example.com"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: "Password123"
   *     responses:
   *       200:
   *         description: Inicio de sesión exitoso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Login successful"
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       $ref: '#/components/schemas/User'
   *                     token:
   *                       type: string
   *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       401:
   *         description: Credenciales inválidas
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      res.json(ApiResponse.success("Login successful", result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(401).json(ApiResponse.error(errorMessage));
    }
  }
  /**
   * @swagger
   * /auth/me:
   *   get:
   *     tags: [Autenticación]
   *     summary: Obtener información del usuario actual
   *     description: Devuelve los datos del usuario autenticado
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Datos del usuario
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: No autorizado
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      // El usuario ya está adjunto a la solicitud por el middleware de autenticación
      res.json(ApiResponse.success("Current user retrieved", req.user));
    } catch (error) {
      res.status(500).json(ApiResponse.error("Error getting current user"));
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(req.user.id, currentPassword, newPassword);

      res.json(ApiResponse.success("Password changed successfully"));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json(ApiResponse.error(errorMessage));
    }
  }
}
