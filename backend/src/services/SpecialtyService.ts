import { masterDB } from "../config/orm.config";
import { Specialty } from "../entities/Specialty";
import { NotFoundError } from "../utils/response";

export class SpecialtyService {
  private specialtyRepository = masterDB.getRepository(Specialty);

  async findAll(): Promise<Specialty[]> {
    return await this.specialtyRepository.find();
  }

  async findById(id: number): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findOne({ where: { id } });
    if (!specialty) throw new NotFoundError("Specialty not found");
    return specialty;
  }

  async findByName(name: string): Promise<Specialty | null> {
    return await this.specialtyRepository.findOne({ where: { name } });
  }

  async create(specialtyData: Partial<Specialty>): Promise<Specialty> {
    const specialty = this.specialtyRepository.create(specialtyData);
    return await this.specialtyRepository.save(specialty);
  }

  async update(id: number, specialtyData: Partial<Specialty>): Promise<Specialty> {
    const specialty = await this.findById(id);
    Object.assign(specialty, specialtyData);
    return await this.specialtyRepository.save(specialty);
  }

  async delete(id: number): Promise<void> {
    const result = await this.specialtyRepository.delete(id);
    if (result.affected === 0) throw new NotFoundError("Specialty not found");
  }
}
