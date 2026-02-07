import express from "express"
import { HandleCreateDepartment, HandleAllDepartments, HandleDepartment, HandleUpdateDepartment, HandleDeleteDepartment, HandleAddEmployeesToDepartment, HandleRemoveEmployeeFromDepartment } from "../controllers/Department.controller.js"
import { VerifyhHRToken } from "../middlewares/Auth.middleware.js"
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"

const router = express.Router()

router.post("/create-department", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleCreateDepartment)

router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllDepartments) 

router.get("/:departmentID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDepartment)

router.patch("/update-department/:departmentId", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateDepartment)

router.patch("/add-employees", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAddEmployeesToDepartment)

router.patch("/remove-employees", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleRemoveEmployeeFromDepartment)

router.delete("/delete-department/:departmentId", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteDepartment) 


export default router 