# 🔐 OTP Feature Testing Guide

## 📋 Overview

The system supports 2 OTP authentication methods:
- 📧 **Email OTP** - For Employees
- 📱 **SMS OTP** - For HR/Admin

---

## 👤 Available Demo Accounts

### HR/Admin Accounts:
```
Email: sarah.johnson@techcorp.com
Password: password123
Phone: +84912345678

```

### Employee Accounts:
```
Email: john.doe@techcorp.com
Password: password123
Phone: +1-555-0201

Email: jane.smith@techcorp.com
Password: password123
Phone: +1-555-0202

Email: alice.wilson@techcorp.com
Password: password123
Phone: +1-555-0203

Email: bob.brown@techcorp.com
Password: password123
Phone: +1-555-0204
```

---

## 📧 Testing Email OTP (Employee)

### Step 1: First Login with Email + Password

1. Open application: `http://localhost:5173`
2. Select **Employee Login**
3. Login with account:
   ```
   Email: john.doe@techcorp.com
   Password: password123
   ```

### Step 2: Update Email

1. After login, go to **Profile** or **Settings**
2. Find **Email Settings** section
3. Update email to **your real email**
4. Save changes

### Step 3: Test Email OTP

1. **Logout** from system
2. Return to login page
3. Select **Login with Email OTP**
4. Enter your new email
5. Check inbox (both Inbox and Spam)
6. Copy OTP code (6 digits)
7. Enter OTP and login

### ⚠️ Notes:
- OTP valid for **10 minutes**
- Check **Spam folder** if email not found
- Ensure Gmail App Password is correctly configured in `server/.env`

---

## 📱 Testing SMS OTP (HR)

### Step 1: First Login with Email + Password

1. Open application: `http://localhost:5173`
2. Select **HR Login**
3. Login with account:
   ```
   Email: sarah.johnson@techcorp.com
   Password: password123
   ```

### Step 2: Update Phone Number

1. After login, go to **Profile** or **Settings**
2. Find **Phone Settings** section
3. Update phone number (if you want to receive real SMS)
4. Save changes

### Step 3: Test SMS OTP

1. **Logout** from system
2. Return to login page
3. Select **Login with SMS OTP**
4. Enter phone number

### 🚨 Important: Vonage Limitations

Vonage only allows testing with limited credit. There are 3 ways to get OTP:

#### ✅ Method 1: View OTP in Backend Terminal (Recommended)

1. Open terminal running server
2. When requesting SMS OTP, terminal will display:
   ```
   📱 [SMS] Sending OTP to +84912345678
   📱 OTP Code: 123456
   📱 Valid for: 10 minutes
   ```
3. Copy OTP code from terminal
4. Enter in login form

#### ✅ Method 2: Use Your Own Vonage Credentials

If you have a Vonage account:

1. Open `server/.env` file
2. Update:
   ```env
   VONAGE_API_KEY=your_api_key
   VONAGE_API_SECRET=your_api_secret
   VONAGE_FROM_NUMBER=YourBrandName
   ```
3. Restart server
4. SMS will be sent to real phone number

#### ✅ Method 3: Mock Mode (Automatic Fallback)

If Vonage is unavailable, system automatically switches to mock mode:

```bash
# Terminal will display:
📱 [DEMO] SMS to +84912345678: Your OTP is 123456
```

---

## 🔍 Debug & Troubleshooting

### Email OTP not received:

**Check:**
1. ✅ Is Gmail App Password correct?
2. ✅ Is 2-Step Verification enabled?
3. ✅ Check Spam folder
4. ✅ View server logs:
   ```bash
   cd server
   npm run server
   # Look for: "Email sent successfully"
   ```

**View OTP in Server Logs:**
```bash
# Server terminal will log:
📧 [EMAIL] Sending OTP to user@example.com
📧 OTP Code: 123456
📧 Email sent successfully
```

### SMS OTP not received:

**Solution:**
1. ✅ **Always check backend terminal first**
2. ✅ Copy OTP from console log
3. ✅ Or use your own Vonage credentials

**View OTP in Server Logs:**
```bash
# Server terminal will log:
📱 [SMS] Sending OTP to +84912345678
📱 OTP Code: 123456
📱 Message ID: abc123xyz
```

### OTP expired:

- OTP valid for **10 minutes**
- Request new OTP if expired
- Each request creates new OTP and invalidates old one

---

## 💡 Tips & Best Practices

### When Demoing to Recruiters:

1. **Prepare in advance:**
   - Update email/phone to real information
   - Test OTP before demo
   - Open backend terminal to show OTP logs

2. **During demo:**
   - Explain Vonage limitations
   - Show terminal logs to prove OTP generation
   - Highlight security features (hashing, expiration, etc.)

3. **Bonus points:**
   - Explain rate limiting
   - Show code implementation
   - Discuss production considerations

### Development Tips:

```javascript
// In development, you can log OTP to console
console.log('🔐 OTP for testing:', otpCode);

// Or return OTP in response (ONLY for development)
if (process.env.NODE_ENV === 'development') {
  return res.json({ 
    success: true, 
    message: 'OTP sent',
    otp: otpCode // ONLY for testing
  });
}
```
