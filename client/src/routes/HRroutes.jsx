import { HRSignupPage } from "../pages/HumanResources/HRSignup"
import { HRLogin } from "../pages/HumanResources/HRlogin"
import { HRDashbaord } from "../pages/HumanResources/HRdashbaord"
import { VerifyEmailPage } from "../pages/HumanResources/verifyemailpage.jsx"
import { ResetHRVerifyEmailPage } from "../pages/HumanResources/resetemail.jsx"
import { HRDashboardPage } from "../pages/HumanResources/Dashboard Childs/dashboardpage.jsx"
import { HRProtectedRoutes } from "./HRprotectedroutes.jsx"
import { HREmployeesPage } from "../pages/HumanResources/Dashboard Childs/employeespage.jsx"
import { HRDepartmentPage } from "../pages/HumanResources/Dashboard Childs/departmentpage.jsx"
import { HRTasksPage } from "../pages/HumanResources/Dashboard Childs/taskspage.jsx"
import { HRChatPage } from "../pages/HumanResources/Dashboard Childs/chatpage.jsx"
import { ProfilePage } from "../pages/HumanResources/Dashboard Childs/profilepage.jsx"
import { Navigate } from "react-router-dom"

const DebugRoute = () => {
    const location = window.location;
    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h2>Debug Route Info</h2>
            <p><strong>Current URL:</strong> {location.href}</p>
            <p><strong>Pathname:</strong> {location.pathname}</p>
            <p><strong>Search:</strong> {location.search}</p>
            <p><strong>Hash:</strong> {location.hash}</p>
            <hr />
            <p>This route was not found. Available HR routes:</p>
            <ul>
                <li>/auth/HR/login</li>
                <li>/auth/HR/dashboard</li>
                <li>/auth/HR/dashboard/dashboard-data</li>
                <li>/auth/HR/dashboard/employees</li>
                <li>/auth/HR/dashboard/departments</li>
            </ul>
        </div>
    );
};

export const HRRoutes = [
    {
        path: "/auth/HR/signup",
        element: <HRSignupPage />
    },
    {
        path: "/auth/HR/login",
        element: <HRLogin />
    },
    {
        path: "/auth/HR/dashboard",
        element: <HRProtectedRoutes><HRDashbaord /></HRProtectedRoutes>,
        children: [
            {
                index: true,
                element: <Navigate to="dashboard-data" replace />
            },
            {
                path: "dashboard-data",
                element: <HRDashboardPage />
            },
            {
                path: "employees",
                element: <HREmployeesPage />
            },
            {
                path: "departments",
                element: <HRDepartmentPage />
            },
            {
                path: "tasks",
                element: <HRTasksPage />
            },
            {
                path: "chat",
                element: <HRChatPage />
            },
            {
                path: "profile",
                element: <ProfilePage />
            },
            {
                path: "*",
                element: <DebugRoute />
            }
        ]
    },
    {
        path: "/auth/HR/verify-email",
        element: <VerifyEmailPage />
    },
    {
        path: "/auth/HR/reset-email-validation",
        element: <ResetHRVerifyEmailPage />
    },
]
