import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, BeforeInsert } from "typeorm";
import { Doctor } from "./Doctor";
import * as bcrypt from "bcrypt";

export enum UserRole {
  ADMIN = "admin",
  DOCTOR = "doctor",
  PATIENT = "patient",
}

@Entity("users")
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - dni
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         dni:
 *           type: string
 *           minLength: 10
 *           maxLength: 10
 *           example: "1712345678"
 *           description: Cédula o identificación única
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: "Juan Pérez"
 *         email:
 *           type: string
 *           format: email
 *           example: "juan.perez@example.com"
 *         password:
 *           type: string
 *           format: password
 *           writeOnly: true
 *           minLength: 8
 *           example: "Password123"
 *         role:
 *           type: string
 *           enum: [admin, doctor, patient]
 *           example: "patient"
 *         isActive:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           example: "2023-01-01T00:00:00Z"
 *       example:
 *         id: 1
 *         dni: "1712345678"
 *         name: "Juan Pérez"
 *         email: "juan.perez@example.com"
 *         role: "patient"
 *         isActive: true
 *         createdAt: "2023-01-01T00:00:00Z"
 */
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 10, unique: true })
  dni!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "enum", enum: UserRole })
  role!: UserRole;

  // @Column({ type: "boolean", default: true })
  // isActive!: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  doctor?: Doctor;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
