import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import EmployeeAuthRouter from './routes/EmployeeAuth.route.js'
import HRAuthrouter from './routes/HRAuth.route.js'
import DashboardRouter from './routes/Dashboard.route.js'
import EmployeeRouter from './routes/Employee.route.js'
import EmployeeDashboardRouter from './routes/EmployeeDashboard.route.js'
import HRRouter from './routes/HR.route.js'
import DepartmentRouter from './routes/Department.route.js'
import TaskRouter from './routes/Task.route.js'
import ChatRouter from './routes/Chat.route.js'
import { initializeFirebase } from './config/firebase.js';
import { initializeSocket } from './config/socket.js';
import cookieParser from 'cookie-parser';
import cors from "cors"


dotenv.config()
const app = express();
const httpServer = createServer(app);

app.use(bodyParser.json())
app.use(cookieParser())

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Task Management System API', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Real-Time Employee Task Management Tool API', version: '1.0.0' });
});


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use("/api/auth/employee", EmployeeAuthRouter) 
app.use("/api/auth/HR", HRAuthrouter)
app.use("/api/v1/dashboard", DashboardRouter) 
app.use("/api/v1/employee", EmployeeRouter)
app.use("/api/v1/employee", EmployeeDashboardRouter)
app.use("/api/v1/HR", HRRouter)
app.use("/api/v1/department", DepartmentRouter)
app.use("/api/v1/task", TaskRouter)
app.use("/api/v1/chat", ChatRouter)

httpServer.listen(process.env.PORT, async () => {
  await initializeFirebase()
  initializeSocket(httpServer)
})