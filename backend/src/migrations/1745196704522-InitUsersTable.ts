import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUsersTable1745196704522 implements MigrationInterface {
    name = 'InitUsersTable1745196704522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`medical_centers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`address\` text NOT NULL, \`city\` enum ('Quito', 'Guayaquil', 'Cuenca') NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`specialties\` (\`id\` int NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_565f38f8b0417c7dbd40e42978\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doctors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`medical_center_id\` int NOT NULL, \`specialty_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dni\` varchar(10) NOT NULL, \`name\` varchar(100) NOT NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('admin', 'doctor', 'patient') NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_5fe9cfa518b76c96518a206b35\` (\`dni\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`patient_id\` int NOT NULL, \`doctor_id\` int NOT NULL, \`appointment_date\` date NOT NULL, \`appointment_time\` time NOT NULL, \`status\` enum ('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`idx_doctor_date\` (\`doctor_id\`, \`appointment_date\`), INDEX \`idx_patient\` (\`patient_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`doctors\` ADD CONSTRAINT \`FK_653c27d1b10652eb0c7bbbc4427\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doctors\` ADD CONSTRAINT \`FK_7599ba650c20389b80df36752a5\` FOREIGN KEY (\`medical_center_id\`) REFERENCES \`medical_centers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`doctors\` ADD CONSTRAINT \`FK_67d7cd9e927b1dca13d42511c02\` FOREIGN KEY (\`specialty_id\`) REFERENCES \`specialties\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`doctors\` DROP FOREIGN KEY \`FK_67d7cd9e927b1dca13d42511c02\``);
        await queryRunner.query(`ALTER TABLE \`doctors\` DROP FOREIGN KEY \`FK_7599ba650c20389b80df36752a5\``);
        await queryRunner.query(`ALTER TABLE \`doctors\` DROP FOREIGN KEY \`FK_653c27d1b10652eb0c7bbbc4427\``);
        await queryRunner.query(`DROP INDEX \`idx_patient\` ON \`appointments\``);
        await queryRunner.query(`DROP INDEX \`idx_doctor_date\` ON \`appointments\``);
        await queryRunner.query(`DROP TABLE \`appointments\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_5fe9cfa518b76c96518a206b35\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`doctors\``);
        await queryRunner.query(`DROP INDEX \`IDX_565f38f8b0417c7dbd40e42978\` ON \`specialties\``);
        await queryRunner.query(`DROP TABLE \`specialties\``);
        await queryRunner.query(`DROP TABLE \`medical_centers\``);
    }

}
