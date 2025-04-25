import { masterDB } from "../config/orm.config";
import { City, MedicalCenter } from "../entities/MedicalCenter";
import { NotFoundError } from "../utils/response";

export class MedicalCenterService {
  private medicalCenterRepository = masterDB.getRepository(MedicalCenter);

  async findAll(): Promise<MedicalCenter[]> {
    return await this.medicalCenterRepository.find();
  }

  async findById(id: number): Promise<MedicalCenter> {
    const center = await this.medicalCenterRepository.findOne({ where: { id } });
    if (!center) throw new NotFoundError("Medical center not found");
    return center;
  }

  async findByCity(city: City): Promise<MedicalCenter[]> {
    return await this.medicalCenterRepository.find({ where: { city } });
  }

  async create(centerData: Partial<MedicalCenter>): Promise<MedicalCenter> {
    const center = this.medicalCenterRepository.create(centerData);
    return await this.medicalCenterRepository.save(center);
  }

  async update(id: number, centerData: Partial<MedicalCenter>): Promise<MedicalCenter> {
    const center = await this.findById(id);
    Object.assign(center, centerData);
    return await this.medicalCenterRepository.save(center);
  }

  async toggleStatus(id: number): Promise<MedicalCenter> {
    const center = await this.findById(id);
    center.active = !center.active;
    return await this.medicalCenterRepository.save(center);
  }

  async delete(id: number): Promise<void> {
    const result = await this.medicalCenterRepository.delete(id);
    if (result.affected === 0) throw new NotFoundError("Medical center not found");
  }
}
