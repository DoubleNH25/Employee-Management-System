import express from "express";
import { 
    HandleGetEmployeeProfile,
    HandleUpdateEmployeeProfile,
    HandleGetEmployeeTasks,
    HandleUpdateTaskStatus,
    HandleEmployeeLogout
} from "../controllers/EmployeeDashboard.controller.js";
import { VerifyEmployeeToken } from "../middlewares/Auth.middleware.js";

const router = express.Router();

router.use(VerifyEmployeeToken);

router.get("/profile", HandleGetEmployeeProfile);
router.patch("/profile", HandleUpdateEmployeeProfile);

router.get("/tasks", HandleGetEmployeeTasks);
router.patch("/task/:taskId", HandleUpdateTaskStatus);

router.post("/logout", HandleEmployeeLogout);

export default router;
