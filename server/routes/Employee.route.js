import express from "express"
import { HandleAllEmployees, HandleUpdateEmployee, HandleDeleteEmployee, HandleEmployee, HandleEmployeeByEmployee, HandleAllEmployeesIDS } from "../controllers/Employee.controller.js"
import { VerifyhHRToken } from "../middlewares/Auth.middleware.js"
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"
import { VerifyEmployeeToken } from "../middlewares/Auth.middleware.js"

const router = express.Router()


router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllEmployees)

router.get("/all-employees-ids", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllEmployeesIDS)

router.patch("/update-employee", VerifyEmployeeToken, HandleUpdateEmployee)

router.delete("/delete-employee/:employeeId", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteEmployee)

router.get("/by-HR/:employeeId", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleEmployee)

router.get("/by-employee", VerifyEmployeeToken, HandleEmployeeByEmployee)



export default router