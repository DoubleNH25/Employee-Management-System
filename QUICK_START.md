# ⚡ Quick Start Guide - For Recruiters

## 🎯 Run Project in 5 Minutes

### Step 1: Clone & Install (2 minutes)

```bash
# Clone repository
git clone <repository-url>
cd employee-management-system

# Install dependencies
cd server && npm install
cd ../client && npm install
```

### Step 2: Configure (2 minutes)

```bash
# Copy environment files
cd server
copy .env.example .env    # Windows
# cp .env.example .env    # macOS/Linux

cd ../client
copy .env.example .env    # Windows
# cp .env.example .env    # macOS/Linux
```

**Update `server/.env`:**
- Add Firebase credentials (see guide in README.md)
- Or contact for demo credentials

### Step 3: Seed Database (30 seconds)

```bash
cd server
npm run db:seed
```

### Step 4: Run (30 seconds)

**Terminal 1 - Backend:**
```bash
cd server
npm i
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd client
npm i
npm run dev
```

### Step 5: Access

Open browser: `http://localhost:5173`

---

## 👤 Demo Accounts

### HR/Admin:
```
Email: sarah.johnson@techcorp.com
Password: password123
```

### Employee:
```
Email: john.doe@techcorp.com
Password: password123
```

---

## 🔐 Test OTP Features

### Email OTP (Employee):
1. Login with email/password
2. Go to Profile → Change email to your real email
3. Logout → Login again with Email OTP
4. Check inbox for OTP

### SMS OTP (HR):
1. Login with email/password
2. Request SMS OTP
3. **View OTP in backend terminal** (due to Vonage limitations)

```bash
# Backend terminal will display:
📱 [SMS] OTP Code: 123456
```

---

## 📚 Full Documentation

- **README.md** - Detailed installation guide
- **OTP_TESTING_GUIDE.md** - OTP testing guide
- **API Documentation** - In README.md
