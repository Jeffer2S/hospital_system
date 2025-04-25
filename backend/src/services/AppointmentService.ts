// src/services/AppointmentService.ts
import { slaveDB } from "../config/orm.config";
import { Appointment, AppointmentStatus } from "../entities/Appointment";
import { NotFoundError, BadRequestError } from "../utils/response";
import { masterDB } from "../config/orm.config";

export class AppointmentService {
  private appointmentRepository = slaveDB.getRepository(Appointment);

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find();
  }

  async findById(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) throw new NotFoundError("Appointment not found");
    return appointment;
  }

  async findByPatient(patientId: number): Promise<Appointment[]> {
    return await this.appointmentRepository.find({ where: { patientId } });
  }

  async findByDoctor(doctorId: number): Promise<Appointment[]> {
    return await this.appointmentRepository.find({ where: { doctorId } });
  }

  async findByDate(date: Date): Promise<Appointment[]> {
    return await this.appointmentRepository.find({ where: { appointmentDate: date } });
  }

  async create(appointmentData: { patientId: number; doctorId: number; appointmentDate: Date; appointmentTime: string }): Promise<Appointment> {
    // Verificar disponibilidad del doctor
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId: appointmentData.doctorId,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
      },
    });

    if (existingAppointment) {
      throw new BadRequestError("Doctor is not available at that time");
    }

    const appointment = this.appointmentRepository.create(appointmentData);
    return await this.appointmentRepository.save(appointment);
  }

  async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findById(id);
    appointment.status = status;
    return await this.appointmentRepository.save(appointment);
  }

  async delete(id: number): Promise<void> {
    const result = await this.appointmentRepository.delete(id);
    if (result.affected === 0) throw new NotFoundError("Appointment not found");
  }
}
