import { masterDB } from "../config/orm.config";
import { User } from "../entities/User";
import { UserRole } from "../entities/User";
import { NotFoundError, BadRequestError } from "../utils/response";

export class UserService {
  private userRepository = masterDB.getRepository(User);

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByDni(dni: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { dni } });
  }

  async create(userData: Partial<User>): Promise<User> {
    // Verificar si el email o dni ya existen
    if (userData.email) {
      const emailExists = await this.findByEmail(userData.email);
      if (emailExists) throw new BadRequestError("Email already in use");
    }

    if (userData.dni) {
      const dniExists = await this.findByDni(userData.dni);
      if (dniExists) throw new BadRequestError("DNI already in use");
    }

    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, userData);
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundError("User not found");
  }

  async getDoctors(): Promise<User[]> {
    return await this.userRepository.find({ where: { role: UserRole.DOCTOR } });
  }

  async getPatients(): Promise<User[]> {
    return await this.userRepository.find({ where: { role: UserRole.PATIENT } });
  }
}
