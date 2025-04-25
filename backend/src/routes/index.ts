import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { MedicalCenterController } from "../controllers/MedicalCenterController";
import { SpecialtyController } from "../controllers/SpecialtyController";
import { DoctorController } from "../controllers/DoctorController";
import { AppointmentController } from "../controllers/AppointmentController";
import { AuthController } from "../controllers/AuthController";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../entities/User";

const router = Router();
const userController = new UserController();
const medicalCenterController = new MedicalCenterController();
const specialtyController = new SpecialtyController();
const doctorController = new DoctorController();
const appointmentController = new AppointmentController();
const authController = new AuthController();

// Auth routes
router.post("/auth/register", authController.register.bind(authController));
router.post("/auth/login", authController.login.bind(authController));
router.get("/auth/me", authenticate, authController.getCurrentUser.bind(authController));
router.post("/auth/change-password", authenticate, authController.changePassword.bind(authController));

// User routes (protegidas)
router.get("/users", authenticate, authorize([UserRole.ADMIN]), userController.getAllUsers.bind(userController));
router.get("/users/:id", authenticate, authorize([UserRole.ADMIN]), userController.getUserById.bind(userController));
router.post("/users", authenticate, authorize([UserRole.ADMIN]), userController.createUser.bind(userController));
router.put("/users/:id", authenticate, authorize([UserRole.ADMIN]), userController.updateUser.bind(userController));
router.delete("/users/:id", authenticate, authorize([UserRole.ADMIN]), userController.deleteUser.bind(userController));
router.get("/users/doctors", authenticate, userController.getDoctors.bind(userController));
router.get("/users/patients", authenticate, authorize([UserRole.ADMIN, UserRole.DOCTOR]), userController.getPatients.bind(userController));

// Medical Center routes (algunas públicas, otras protegidas)
router.get("/medical-centers", medicalCenterController.getAllCenters.bind(medicalCenterController));
router.get("/medical-centers/:id", medicalCenterController.getCenterById.bind(medicalCenterController));
router.get("/medical-centers/city/:city", medicalCenterController.getCentersByCity.bind(medicalCenterController));
router.post("/medical-centers", authenticate, authorize([UserRole.ADMIN]), medicalCenterController.createCenter.bind(medicalCenterController));
router.put("/medical-centers/:id", authenticate, authorize([UserRole.ADMIN]), medicalCenterController.updateCenter.bind(medicalCenterController));
router.patch("/medical-centers/:id/toggle-status", authenticate, authorize([UserRole.ADMIN]), medicalCenterController.toggleCenterStatus.bind(medicalCenterController));
router.delete("/medical-centers/:id", authenticate, authorize([UserRole.ADMIN]), medicalCenterController.deleteCenter.bind(medicalCenterController));

// Specialty routes (protegidas para escritura)
router.get("/specialties", specialtyController.getAllSpecialties.bind(specialtyController));
router.get("/specialties/:id", specialtyController.getSpecialtyById.bind(specialtyController));
router.post("/specialties", authenticate, authorize([UserRole.ADMIN]), specialtyController.createSpecialty.bind(specialtyController));
router.put("/specialties/:id", authenticate, authorize([UserRole.ADMIN]), specialtyController.updateSpecialty.bind(specialtyController));
router.delete("/specialties/:id", authenticate, authorize([UserRole.ADMIN]), specialtyController.deleteSpecialty.bind(specialtyController));

// Doctor routes (protegidas)
router.get("/doctors", doctorController.getAllDoctors.bind(doctorController));
router.get("/doctors/:id", doctorController.getDoctorById.bind(doctorController));
router.get("/doctors/medical-center/:medicalCenterId", doctorController.getDoctorsByMedicalCenter.bind(doctorController));
router.get("/doctors/specialty/:specialtyId", doctorController.getDoctorsBySpecialty.bind(doctorController));
router.post("/doctors", authenticate, authorize([UserRole.ADMIN]), doctorController.createDoctor.bind(doctorController));
router.put("/doctors/:id", authenticate, authorize([UserRole.ADMIN]), doctorController.updateDoctor.bind(doctorController));
router.delete("/doctors/:id", authenticate, authorize([UserRole.ADMIN]), doctorController.deleteDoctor.bind(doctorController));

// Appointment routes (protegidas)
router.get("/appointments", authenticate, appointmentController.getAllAppointments.bind(appointmentController));
router.get("/appointments/:id", authenticate, appointmentController.getAppointmentById.bind(appointmentController));
router.get("/appointments/patient/:patientId", authenticate, appointmentController.getAppointmentsByPatient.bind(appointmentController));
router.get("/appointments/doctor/:doctorId", authenticate, appointmentController.getAppointmentsByDoctor.bind(appointmentController));
router.get("/appointments/date/:date", authenticate, appointmentController.getAppointmentsByDate.bind(appointmentController));
router.post("/appointments", authenticate, appointmentController.createAppointment.bind(appointmentController));
router.patch("/appointments/:id/status", authenticate, appointmentController.updateAppointmentStatus.bind(appointmentController));
router.delete("/appointments/:id", authenticate, appointmentController.deleteAppointment.bind(appointmentController));

export default router;
