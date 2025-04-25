import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/User';
import { Doctor } from './entities/Doctor';
import { Specialty } from './entities/Specialty';
import { Appointment } from './entities/Appointment';
import	{ MedicalCenter } from './entities/MedicalCenter';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MASTER_DB_HOST,
  port: parseInt(process.env.MASTER_DB_PORT || '3306'),
  username: process.env.MASTER_DB_USER,
  password: process.env.MASTER_DB_PASSWORD,
  database: process.env.MASTER_DB_NAME,
  entities: [User, Doctor, Specialty, Appointment, MedicalCenter],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
