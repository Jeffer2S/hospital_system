import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { MedicalCenter } from "./MedicalCenter";
import { Specialty } from "./Specialty";

@Entity("doctors")
/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - userId
 *         - medicalCenterId
 *         - specialtyId
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 3
 *           description: "ID del usuario con rol doctor"
 *         medicalCenterId:
 *           type: integer
 *           example: 1
 *         specialtyId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *       example:
 *         id: 1
 *         userId: 3
 *         medicalCenterId: 1
 *         specialtyId: 1
 *         createdAt: "2023-01-01T00:00:00Z"
 */
export class Doctor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "user_id" })
  userId!: number;

  @ManyToOne(() => User, (user) => user.doctor)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "medical_center_id" })
  medicalCenterId!: number;

  @ManyToOne(() => MedicalCenter, (medicalCenter) => medicalCenter.doctors)
  @JoinColumn({ name: "medical_center_id" })
  medicalCenter!: MedicalCenter;

  @Column({ name: "specialty_id" })
  specialtyId!: number;

  @ManyToOne(() => Specialty, (specialty) => specialty.doctors)
  @JoinColumn({ name: "specialty_id" })
  specialty!: Specialty;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
