import { EmployeeLogin } from "../pages/Employees/emplyoeelogin.jsx"
import { EmployeeDashboard } from "../pages/Employees/employeedashboard.jsx"
import { ProtectedRoutes } from "./protectedroutes.jsx"
import { EntryPage } from "../pages/Employees/EntryPage.jsx"

export const EmployeeRoutes = [
    {
        path: "/",
        element: <EntryPage />
    },
    {
        path: "/auth/employee/login",
        element: <EmployeeLogin />
    },
    {
        path: "/auth/employee/employee-dashboard",
        element: <ProtectedRoutes> <EmployeeDashboard /> </ProtectedRoutes>
    },
]
