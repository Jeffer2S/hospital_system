// src/config/orm.config.ts
import { DataSource } from "typeorm";
import { config } from "./env";
import { User } from "../entities/User";
import { MedicalCenter } from "../entities/MedicalCenter";
import { Specialty } from "../entities/Specialty";
import { Doctor } from "../entities/Doctor";
import { Appointment } from "../entities/Appointment";

// Configuración para la base de datos maestra (Quito)
export const masterDB = new DataSource({
  type: "mysql",
  host: config.MASTER_DB.HOST,
  port: config.MASTER_DB.PORT,
  username: config.MASTER_DB.USER,
  password: config.MASTER_DB.PASSWORD,
  database: config.MASTER_DB.NAME,
  synchronize: false,
  logging: true,
  entities: [User, MedicalCenter, Specialty, Doctor, Appointment],
  migrations: [],
  subscribers: [],
});

// Configuración para las bases de datos esclavas (Cuenca/Guayaquil)
export const slaveDB = new DataSource({
  type: "mysql",
  host: config.SLAVE_DB.HOST,
  port: config.SLAVE_DB.PORT,
  username: config.SLAVE_DB.USER,
  password: config.SLAVE_DB.PASSWORD,
  database: config.SLAVE_DB.NAME,
  synchronize: false,
  logging: true,
  entities: [Appointment], // Solo Appointment aquí
  migrations: [],
  subscribers: [],
});

// Inicializar conexiones
export const initializeDatabases = async () => {
  try {
    await masterDB.initialize();
    console.log("Master database connected");
    await slaveDB.initialize();
    console.log("Slave database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
