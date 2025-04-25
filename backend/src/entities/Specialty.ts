import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Doctor } from "./Doctor";

@Entity("specialties")
/**
 * @swagger
 * components:
 *   schemas:
 *     Specialty:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           maxLength: 100
 *           unique: true
 *           example: "Cardiología"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Especialidad en enfermedades del corazón"
 *       example:
 *         id: 1
 *         name: "Cardiología"
 *         description: "Especialidad en enfermedades del corazón"
 */
export class Specialty {
  @PrimaryColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @OneToMany(() => Doctor, (doctor) => doctor.specialty)
  doctors!: Doctor[];
}
