// src/entities/Appointment.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

export enum AppointmentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("appointments")
/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - appointmentDate
 *         - appointmentTime
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         patientId:
 *           type: integer
 *           example: 2
 *         doctorId:
 *           type: integer
 *           example: 1
 *         appointmentDate:
 *           type: string
 *           format: date
 *           example: "2023-12-15"
 *         appointmentTime:
 *           type: string
 *           format: time
 *           example: "14:30:00"
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           default: pending
 *           example: "pending"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *       example:
 *         id: 1
 *         patientId: 2
 *         doctorId: 1
 *         appointmentDate: "2023-12-15"
 *         appointmentTime: "14:30:00"
 *         status: "pending"
 *         createdAt: "2023-12-01T00:00:00Z"
 */
@Index("idx_patient", ["patientId"])
@Index("idx_doctor_date", ["doctorId", "appointmentDate"])
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "patient_id" })
  patientId!: number;

  @Column({ name: "doctor_id" })
  doctorId!: number;

  @Column({ name: "appointment_date", type: "date" })
  appointmentDate!: Date;

  @Column({ name: "appointment_time", type: "time" })
  appointmentTime!: string;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status!: AppointmentStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
