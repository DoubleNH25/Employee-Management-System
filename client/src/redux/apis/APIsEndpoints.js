export const APIsEndPoints = {
    LOGIN: "/api/auth/employee/login",
    LOGOUT: "/api/auth/employee/logout",
    CHECKELOGIN: "/api/auth/employee/check-login",
    FORGOT_PASSWORD: "/api/auth/employee/forgot-password",
    RESET_PASSWORD: (token) => `/api/auth/employee/reset-password/${token}`
}

export const HREndPoints = {
    SIGNUP: "/api/auth/HR/signup",
    CHECKLOGIN: "/api/auth/HR/check-login",
    LOGIN: "/api/auth/HR/login",
    LOGOUT: "/api/auth/HR/logout",
    VERIFY_EMAIL: "/api/auth/HR/verify-email",
    CHECK_VERIFY_EMAIL: "/api/auth/HR/check-verify-email",
    RESEND_VERIFY_EMAIL: "/api/auth/HR/resend-verify-email",
    FORGOT_PASSWORD: "/api/auth/HR/forgot-password",
    RESET_PASSWORD: (token) => `/api/auth/HR/reset-password/${token}`,
    MY_PROFILE: "/api/v1/HR/my-profile",
    SEND_OTP: "/api/auth/HR/send-otp",
    VERIFY_OTP: "/api/auth/HR/verify-otp"
}

export const DashboardEndPoints = {
    GETDATA: "/api/v1/dashboard/HR-dashboard"
}

export const HREmployeesPageEndPoints = {
    GETALL: "/api/v1/employee/all",
    ADDEMPLOYEE: "/api/auth/employee/signup",
    GETONE: (EMID) => `/api/v1/employee/by-HR/${EMID}`,
    DELETE: (EMID) => `/api/v1/employee/delete-employee/${EMID}`
}

export const HRDepartmentPageEndPoints = {
    GETALL: "/api/v1/department/all",
    CREATE: "/api/v1/department/create-department",
    UPDATE: (departmentId) => `/api/v1/department/update-department/${departmentId}`,
    ADD_EMPLOYEES: "/api/v1/department/add-employees",
    REMOVE_EMPLOYEES: "/api/v1/department/remove-employees",
    DELETE: (departmentId) => `/api/v1/department/delete-department/${departmentId}`
}

export const EmployeesIDsEndPoints = {
    GETALL: "/api/v1/employee/all-employees-ids",
}

export const TaskEndPoints = {
    GET_ALL_TASKS: "/api/v1/task/all",
    CREATE_TASK: "/api/v1/task/create",
    UPDATE_TASK: "/api/v1/task",
    DELETE_TASK: "/api/v1/task",
    GET_TASK_STATISTICS: "/api/v1/task/statistics",
    GET_EMPLOYEE_TASKS: "/api/v1/task/employee"
}

export const EmployeeDashboardEndPoints = {
    GET_PROFILE: "/api/v1/employee/profile",
    UPDATE_PROFILE: "/api/v1/employee/profile",
    GET_TASKS: "/api/v1/employee/tasks",
    UPDATE_TASK_STATUS: "/api/v1/employee/task"
}

export const APIsEndpoints = {
    EMPLOYEE_ENDPOINTS: APIsEndPoints,
    HR_ENDPOINTS: HREndPoints,
    DASHBOARD_ENDPOINTS: DashboardEndPoints,
    HR_EMPLOYEES_ENDPOINTS: HREmployeesPageEndPoints,
    HR_DEPARTMENT_ENDPOINTS: HRDepartmentPageEndPoints,
    EMPLOYEES_IDS_ENDPOINTS: EmployeesIDsEndPoints,
    TASK_ENDPOINTS: TaskEndPoints,
    EMPLOYEE_DASHBOARD: EmployeeDashboardEndPoints
} 
