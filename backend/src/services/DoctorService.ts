import { masterDB } from "../config/orm.config";
import { Doctor } from "../entities/Doctor";
import { User } from "../entities/User";
import { MedicalCenter } from "../entities/MedicalCenter";
import { Specialty } from "../entities/Specialty";
import { NotFoundError } from "../utils/response";

export class DoctorService {
  private doctorRepository = masterDB.getRepository(Doctor);
  private userRepository = masterDB.getRepository(User);
  private medicalCenterRepository = masterDB.getRepository(MedicalCenter);
  private specialtyRepository = masterDB.getRepository(Specialty);

  async findAll(): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      relations: ["user", "medicalCenter", "specialty"],
    });
  }

  async findById(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ["user", "medicalCenter", "specialty"],
    });
    if (!doctor) throw new NotFoundError("Doctor not found");
    return doctor;
  }

  async findByUserId(userId: number): Promise<Doctor | null> {
    return await this.doctorRepository.findOne({
      where: { userId },
      relations: ["user", "medicalCenter", "specialty"],
    });
  }

  async findByMedicalCenter(medicalCenterId: number): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      where: { medicalCenterId },
      relations: ["user", "medicalCenter", "specialty"],
    });
  }

  async findBySpecialty(specialtyId: number): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      where: { specialtyId },
      relations: ["user", "medicalCenter", "specialty"],
    });
  }

  async create(doctorData: { userId: number; medicalCenterId: number; specialtyId: number }): Promise<Doctor> {
    // Verificar que el usuario existe y es doctor
    const user = await this.userRepository.findOne({ where: { id: doctorData.userId } });
    if (!user) throw new NotFoundError("User not found");
    if (user.role !== "doctor") throw new Error("User is not a doctor");

    // Verificar que el centro médico existe
    const medicalCenter = await this.medicalCenterRepository.findOne({
      where: { id: doctorData.medicalCenterId },
    });
    if (!medicalCenter) throw new NotFoundError("Medical center not found");

    // Verificar que la especialidad existe
    const specialty = await this.specialtyRepository.findOne({
      where: { id: doctorData.specialtyId },
    });
    if (!specialty) throw new NotFoundError("Specialty not found");

    const doctor = this.doctorRepository.create(doctorData);
    return await this.doctorRepository.save(doctor);
  }

  async update(id: number, doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = await this.findById(id);
    Object.assign(doctor, doctorData);
    return await this.doctorRepository.save(doctor);
  }

  async delete(id: number): Promise<void> {
    const result = await this.doctorRepository.delete(id);
    if (result.affected === 0) throw new NotFoundError("Doctor not found");
  }
}
