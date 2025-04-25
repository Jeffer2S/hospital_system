import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Doctor } from "./Doctor";

export enum City {
  QUITO = "Quito",
  GUAYAQUIL = "Guayaquil",
  CUENCA = "Cuenca",
}

@Entity("medical_centers")
/**
 * @swagger
 * components:
 *   schemas:
 *     MedicalCenter:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - city
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         name:
 *           type: string
 *           maxLength: 100
 *           example: "Hospital General"
 *         address:
 *           type: string
 *           example: "Av. Principal 123"
 *         city:
 *           type: string
 *           enum: [Quito, Guayaquil, Cuenca]
 *           example: "Quito"
 *         active:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *       example:
 *         id: 1
 *         name: "Hospital General"
 *         address: "Av. Principal 123"
 *         city: "Quito"
 *         active: true
 *         createdAt: "2023-01-01T00:00:00Z"
 */
export class MedicalCenter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "enum", enum: City })
  city!: City;

  @Column({ type: "boolean", default: true })
  active!: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @OneToMany(() => Doctor, (doctor) => doctor.medicalCenter)
  doctors!: Doctor[];
}
