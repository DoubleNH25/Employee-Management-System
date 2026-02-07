# 🚀 Real-Time Employee Task Management System

A comprehensive real-time employee task management system with modern interface, live chat features, and statistical dashboards.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-black)

---

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Demo & Screenshots](#-demo--screenshots)
- [Tech Stack](#-tech-stack)
- [System Requirements](#-system-requirements)
- [Installation Guide](#-quick-installation-guide)
- [Demo Accounts](#-demo-accounts)
- [OTP Testing Guide](#-otp-testing-guide)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Introduction

A comprehensive employee task management system built with:
- ✅ Efficient employee and department management
- ✅ Real-time task assignment and tracking
- ✅ Internal communication via live chat
- ✅ Visual statistical dashboards with charts
- ✅ Secure authentication and authorization
- ✅ Automatic email notifications

---

## ✨ Features

### 👔 For HR/Admin:
- 📊 Overview dashboard with statistical charts
- 👥 Employee management (add, edit, delete, search)
- 🏢 Department and organizational structure management
- 📝 Create and assign tasks to employees
- 📈 Track work progress and performance
- 💬 Direct chat with employees
- 📧 Send automatic email notifications
- 📱 Real-time notifications via Socket.io
- 🔐 Login with Email/Password or SMS OTP

### 👨‍💼 For Employees:
- 📋 View assigned task list
- ✅ Update task status (Todo, In Progress, Completed)
- � Persovnal dashboard with work statistics
- �  Chat with HR and colleagues
- � Rece ive real-time new task notifications
- � Mannage personal information
- 🔐 Login with Email/Password or Email OTP

### 🔐 Multi-Method Authentication:
- **HR:** Email/Password or SMS OTP
- **Employee:** Email/Password or Email OTP
- JWT token-based authentication
- Secure password hashing with Bcrypt

---

## 🎬 Demo & Screenshots

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)
![alt text](image-8.png)
![alt text](image-9.png)
![alt text](image-10.png)
![alt text](image-11.png)
![alt text](image-12.png)
![alt text](image-13.png)
![alt text](image-14.png)
![alt text](image-15.png)
---

## 🛠 Tech Stack

### Frontend:
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI Library |
| Vite | 5.4.10 | Build Tool & Dev Server |
| Redux Toolkit | 2.3.0 | State Management |
| React Router | 6.28.0 | Client-side Routing |
| Material-UI | 6.1.8 | Component Library |
| TailwindCSS | 3.4.15 | Utility-first CSS |
| Socket.io Client | 4.8.3 | Real-time Communication |
| Axios | 1.7.7 | HTTP Client |
| Recharts | 2.13.3 | Data Visualization |

### Backend:
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 16+ | Runtime Environment |
| Express.js | 4.21.1 | Web Framework |
| Socket.io | 4.8.3 | WebSocket Server |
| Firebase Admin | 12.0.0 | Database & Auth |
| JWT | 9.0.2 | Authentication |
| Bcrypt | 5.1.1 | Password Hashing |
| Nodemailer | 6.10.1 | Email Service |
| Day.js | 1.11.13 | Date Manipulation |

---

## 💻 System Requirements

Before starting, ensure your computer has:

- ✅ **Node.js** version 16.x or higher (recommended 18.x or 20.x)
  - Check: `node --version`
  - Download: [nodejs.org](https://nodejs.org/)

- ✅ **npm** version 8.x or higher (comes with Node.js)
  - Check: `npm --version`

- ✅ **Git** to clone repository
  - Check: `git --version`
  - Download: [git-scm.com](https://git-scm.com/)

---

## 🚀 Quick Installation Guide

### Step 1: Clone Repository

Open Terminal/Command Prompt and run:

```bash
# Clone repository to your machine
git clone https://github.com/your-username/employee-management-system.git

# Navigate to project directory
cd employee-management-system
```

---

### Step 2: Install Dependencies

#### 2.1. Install Backend Dependencies

```bash
# Navigate to server directory
cd server

# Install all packages
npm install

# Return to root directory
cd ..
```

**Note:** Installation may take 2-5 minutes depending on network speed.

#### 2.2. Install Frontend Dependencies

```bash
# Navigate to client directory
cd client

# Install all packages
npm install

# Return to root directory
cd ..
```

---

### Step 3: Configure Environment Variables

#### 3.1. Backend Configuration

```bash
# Navigate to server directory
cd server

# Copy .env.example to .env
# Windows (Command Prompt):
copy .env.example .env

# Windows (PowerShell):
Copy-Item .env.example .env

# macOS/Linux:
cp .env.example .env
```

**Open `server/.env` file** and update the following information:

```env
# ============================================
# IMPORTANT: Update these credentials
# ============================================

# 1. Firebase Configuration
# Get from: https://console.firebase.google.com/
# Project Settings > Service Accounts > Generate New Private Key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your_client_email

# 2. JWT Secret (Generate any random string)
JWT_SECRET=your_super_secret_jwt_key_here

# 3. Server Configuration (Keep as is)
PORT=3001
CLIENT_URL=http://localhost:5173

# 4. Email Configuration (Optional - for testing email)
# Guide to create Gmail App Password: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
FROM_EMAIL=noreply@yourcompany.com

# 5. SMS Configuration (Optional - can skip)
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_FROM_NUMBER=YourBrandName
```

#### 3.2. Frontend Configuration

```bash
# Navigate to client directory (if in server)
cd ../client

# Copy .env.example to .env
# Windows (Command Prompt):
copy .env.example .env

# Windows (PowerShell):
Copy-Item .env.example .env

# macOS/Linux:
cp .env.example .env
```

**Open `client/.env` file** and verify:

```env
# API Configuration
# Ensure port matches PORT in server/.env
VITE_EMPLOYEE_API=http://localhost:3001
```

---

### Step 4: Setup Database (Firebase)

#### 4.1. Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name your project (e.g., `employee-management-demo`)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

#### 4.2. Get Firebase Credentials

1. In Firebase Console, click **⚙️ (Settings)** > **Project settings**
2. Select **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Download the JSON file
5. Open JSON file and copy values to `server/.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key_id` → `FIREBASE_PRIVATE_KEY_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `client_id` → `FIREBASE_CLIENT_ID`

#### 4.3. Enable Firestore Database

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose nearest location (e.g., `asia-southeast1`)
5. Click **"Enable"**

#### 4.4. Seed Sample Data

```bash
# Navigate to server directory
cd server

# Run script to create sample data
npm run db:seed

# Or clear old data and create fresh
npm run db:fresh
```

**Result:** Database will have sample data for employees, departments, and tasks.

---

### Step 5: Run Application

#### 5.1. Run Backend Server

Open Terminal/Command Prompt **#1**:

```bash
# Navigate to server directory
cd server

# Run server
npm run server
```

**Success output:**
```
Server is running on port 3001
Firebase initialized successfully
Socket.io server is running
```

**Keep server running, DO NOT close this terminal!**

#### 5.2. Run Frontend

Open Terminal/Command Prompt **#2** (new terminal):

```bash
# Navigate to client directory
cd client

# Run development server
npm run dev
```

**Success output:**
```
  VITE v5.4.10  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

### Step 6: Access Application

Open browser and visit:

```
http://localhost:5173
```

---

## 👤 Demo Accounts

After running `npm run db:seed`, the system will create the following sample accounts:

### 🔑 HR/Admin Accounts

| Name | Email | Password | Phone | Role |
|------|-------|----------|-------|------|
| Sarah Johnson | `sarah.johnson@techcorp.com` | `password123` | +84912345678 | HR-Admin |

### 👨‍💼 Employee Accounts

| Name | Email | Password | Phone | Role | Department |
|------|-------|----------|-------|------|------------|
| John Doe | `john.doe@techcorp.com` | `password123` | +1-555-0201 | Software Engineer | Engineering |
| Jane Smith | `jane.smith@techcorp.com` | `password123` | +1-555-0202 | Frontend Developer | Engineering |
| Alice Wilson | `alice.wilson@techcorp.com` | `password123` | +1-555-0203 | Marketing Specialist | Marketing |
| Bob Brown | `bob.brown@techcorp.com` | `password123` | +1-555-0204 | Sales Representative | Sales |

---

## 📱 OTP Testing Guide

The system supports 2 OTP authentication methods:
- � ***Email OTP** - For employees
- 📱 **SMS OTP** - For HR

### ⚠️ Important Notes About OTP

#### 🔐 Testing Email OTP (Employee Login):

**Step 1:** Login with Email + Password first
```
Email: john.doe@techcorp.com
Password: password123
```

**Step 2:** Go to **Profile/Settings** and update email to your real email

**Step 3:** Logout and login again with **Email OTP**
- Enter your new email
- Check inbox for OTP code
- Enter OTP to login

#### 📲 Testing SMS OTP (HR Login):

**Step 1:** Login with Email + Password first
```
Email: sarah.johnson@techcorp.com
Password: password123
```

**Step 2:** Go to **Profile/Settings** and update phone number

**Step 3:** Logout and login again with **SMS OTP**

---

### 🚨 SMS Limitations (Vonage)

**⚠️ Important:** Vonage only allows testing with one phone number with limited credit.

#### Ways to test SMS OTP:

**Option 1: View OTP in Terminal (Recommended)** ⭐
```bash
# When running server, OTP will be logged to console
cd server
npm run server

# When requesting SMS OTP, terminal will display:
📱 [SMS] Sending OTP to +84912345678: Your OTP is 123456
```

**Option 2: Replace Vonage Credentials**

If you have your own Vonage account:
```env
# In server/.env
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_FROM_NUMBER=YourBrandName
```

**Option 3: Mock SMS Service**

System automatically falls back to mock mode if Vonage is unavailable:
```javascript
// SMS will be logged to console instead of sending
📱 [DEMO] SMS to +84912345678: Your OTP is 123456
```

---

### 💡 Testing Tips

1. **Email OTP:**
   - ✅ Works well if Gmail App Password is configured
   - ✅ Check both Inbox and Spam folder
   - ✅ OTP valid for 10 minutes

2. **SMS OTP:**
   - ⚠️ May not send due to Vonage limitations
   - ✅ Always check backend terminal for OTP
   - ✅ Or use your own Vonage credentials

3. **Development Mode:**
   - 🔍 Open Developer Console (F12) to view logs
   - 🔍 Check Network tab to debug API calls
   - 🔍 View backend terminal to monitor requests

📖 **See detailed guide:** [OTP_TESTING_GUIDE.md](./OTP_TESTING_GUIDE.md)

---

## 📜 Useful Scripts

### Server Scripts:

```bash
cd server

# Run server with nodemon (auto-reload on code changes)
npm run server

# Setup database structure
npm run db:setup

# Clear all data in database
npm run db:clear

# Create sample data
npm run db:seed

# Verify data in database
npm run db:verify

# Clear and recreate sample data (fresh start)
npm run db:fresh
```

### Client Scripts:

```bash
cd client

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and check code
npm run lint
```

---

## 📁 Project Structure

```
employee-management-system/
│
├── client/                          # Frontend React Application
│   ├── public/                      # Static files
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/                  # Images, icons, fonts
│   │   ├── components/              # Reusable React components
│   │   │   ├── ui/                  # UI components (buttons, inputs, etc.)
│   │   │   ├── layout/              # Layout components (header, sidebar)
│   │   │   └── features/            # Feature-specific components
│   │   ├── context/                 # React Context providers
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utility libraries
│   │   ├── pages/                   # Page components
│   │   │   ├── Dashboard/
│   │   │   ├── Employees/
│   │   │   ├── Tasks/
│   │   │   ├── Chat/
│   │   │   └── Auth/
│   │   ├── redux/                   # Redux store and slices
│   │   │   ├── app/                 # Store configuration
│   │   │   ├── features/            # Feature slices
│   │   │   └── services/            # RTK Query services
│   │   ├── routes/                  # Route definitions
│   │   ├── services/                # API service calls
│   │   ├── utils/                   # Helper functions
│   │   ├── App.jsx                  # Main App component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   └── postcss.config.js            # PostCSS configuration
│
├── server/                          # Backend Node.js Application
│   ├── config/                      # Configuration files
│   │   ├── firebase.js              # Firebase initialization
│   │   └── socket.js                # Socket.io configuration
│   ├── controllers/                 # Request handlers
│   │   ├── auth.controller.js
│   │   ├── employee.controller.js
│   │   ├── task.controller.js
│   │   └── chat.controller.js
│   ├── middlewares/                 # Express middlewares
│   │   ├── auth.middleware.js       # JWT verification
│   │   ├── error.middleware.js      # Error handling
│   │   └── validation.middleware.js # Input validation
│   ├── models/                      # Data models
│   ├── routes/                      # API routes
│   │   ├── EmployeeAuth.route.js
│   │   ├── HRAuth.route.js
│   │   ├── Employee.route.js
│   │   ├── Task.route.js
│   │   └── Chat.route.js
│   ├── scripts/                     # Database scripts
│   │   ├── setupDatabase.js
│   │   ├── clearDatabase.js
│   │   ├── seedData.js
│   │   └── verifyData.js
│   ├── seeds/                       # Seed data files
│   ├── services/                    # Business logic
│   │   ├── email.service.js
│   │   ├── sms.service.js
│   │   └── notification.service.js
│   ├── socket/                      # Socket.io handlers
│   │   ├── chat.socket.js
│   │   └── notification.socket.js
│   ├── utils/                       # Helper functions
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── index.js                     # Entry point
│   └── package.json                 # Dependencies
│
├── .gitignore                       # Git ignore rules
├── README.md                        # Documentation (this file)
├── OTP_TESTING_GUIDE.md            # OTP testing guide
└── QUICK_START.md                   # Quick start guide
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register Employee
```http
POST /auth/employee/register
Content-Type: application/json

{
  "email": "employee@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "0123456789",
  "department": "IT"
}
```

#### Employee Login
```http
POST /auth/employee/login
Content-Type: application/json

{
  "email": "employee@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### HR Login
```http
POST /auth/HR/login
Content-Type: application/json

{
  "email": "hr@example.com",
  "password": "password123"
}
```

### Employee Management

```http
GET    /v1/employee              # Get employee list
POST   /v1/employee              # Create new employee
GET    /v1/employee/:id          # Get employee info
PUT    /v1/employee/:id          # Update employee
DELETE /v1/employee/:id          # Delete employee
```

### Task Management

```http
GET    /v1/task                  # Get task list
POST   /v1/task                  # Create new task
GET    /v1/task/:id              # Get task details
PUT    /v1/task/:id              # Update task
DELETE /v1/task/:id              # Delete task
PATCH  /v1/task/:id/status       # Update status
```

### Department Management

```http
GET    /v1/department            # Get department list
POST   /v1/department            # Create new department
PUT    /v1/department/:id        # Update department
DELETE /v1/department/:id        # Delete department
```

### Chat

```http
GET    /v1/chat                  # Get messages
POST   /v1/chat                  # Send message
GET    /v1/chat/conversations    # Get conversation list
```

### Dashboard

```http
GET    /v1/dashboard             # Get dashboard data
GET    /v1/dashboard/stats       # Get statistics
```

### Health Check

```http
GET    /health                   # Check server status
GET    /                         # API info
```

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot find module"

**Cause:** Dependencies not installed

**Solution:**
```bash
# Delete node_modules and reinstall
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Error: "Port 3001 already in use"

**Cause:** Port is being used by another process

**Solution:**

**Windows:**
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill process (replace <PID> with process ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9
```

**Or change port:**
```env
# In server/.env
PORT=3002

# In client/.env
VITE_EMPLOYEE_API=http://localhost:3002
```

---

### ❌ Error: "Firebase initialization failed"

**Cause:** Wrong Firebase credentials or Firestore not enabled

**Solution:**
1. Check `server/.env` file
2. Ensure correct copy from Firebase JSON
3. Check `FIREBASE_PRIVATE_KEY` has complete `\n` (newlines)
4. Ensure Firestore is enabled in Firebase Console

---

### ❌ Error: "CORS policy blocked"

**Cause:** Client URL doesn't match server config

**Solution:**
```env
# In server/.env, ensure:
CLIENT_URL=http://localhost:5173

# If client runs on different port, update accordingly
```

---

### ❌ Error: "Cannot connect to Socket.io"

**Cause:** Server not running or wrong port

**Solution:**
1. Ensure server is running (`npm run server`)
2. Check server console logs
3. Check `VITE_EMPLOYEE_API` in `client/.env`

---

### ❌ Error: "Email not sending"

**Cause:** Wrong Gmail App Password or 2FA not enabled

**Solution:**
1. Enable 2-Step Verification in Google Account
2. Create App Password at: https://myaccount.google.com/apppasswords
3. Copy App Password (16 characters) to `SMTP_PASS`
4. Don't use regular Gmail password

---

### ❌ Error: "SMS OTP not received"

**Cause:** Vonage credit limited or invalid phone number

**Solution:**

**Method 1: View OTP in Backend Terminal (Recommended)** ⭐
```bash
# Terminal running server will display:
📱 [SMS] Sending OTP to +84912345678
📱 OTP Code: 123456
📱 Valid for: 10 minutes
```

**Method 2: Check Server Logs**
```bash
cd server
npm run server

# Look for lines containing "OTP" or "SMS"
```

**Method 3: Use Your Vonage**
```env
# In server/.env
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret
```

**Method 4: Mock SMS (Development)**
```javascript
// System automatically logs OTP to console
// No additional configuration needed
```

---

### ❌ Error: "npm ERR! code ENOENT"

**Cause:** Wrong directory

**Solution:**
```bash
# Ensure you're in correct directory
pwd  # macOS/Linux
cd   # Windows

# Navigate to correct directory
cd path/to/employee-management-system/server
# or
cd path/to/employee-management-system/client
```

---

### Quick Start Summary

```bash
# 1. Clone
git clone <repo-url>
cd employee-management-system

# 2. Install
cd server && npm install
cd ../client && npm install

# 3. Configure
cd server && cp .env.example .env
cd ../client && cp .env.example .env
# Edit .env files

# 4. Run
cd server && npm run server    # Terminal 1
cd client && npm run dev        # Terminal 2

# 5. Open browser
http://localhost:5173
```
