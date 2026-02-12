import { Vonage } from '@vonage/server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPSMS = async (phoneNumber, otpCode) => {
  // Check if Vonage is enabled
  const isVonageEnabled = process.env.VONAGE_ENABLED === 'true';
  
  // DEV MODE: Just log to console
  if (!isVonageEnabled) {
    console.log('\n============ SMS OTP (DEV MODE) ============');
    console.log(`To: ${phoneNumber}`);
    console.log(`OTP Code: ${otpCode}`);
    console.log(`Valid for: 5 minutes`);
    console.log('===========================================\n');
    
    return {
      success: true,
      messageId: 'dev-mode-' + Date.now(),
      message: 'OTP sent successfully (DEV MODE - Check console)'
    };
  }
  
  // PRODUCTION MODE: Real SMS via Vonage
  try {
    const from = process.env.VONAGE_FROM_NUMBER || 'HRMS';
    const to = phoneNumber;
    const text = `Your HRMS verification code is: ${otpCode}. Valid for 5 minutes. Do not share this code.`;
        
    let response;
    try {
      response = await vonage.sms.send({ to, from, text });
    } catch (error) {
      if (error.response && error.response.messages) {
        response = error.response;
      } else {
        throw error;
      }
    }
    
    if (response.messages && response.messages.length > 0) {
      const message = response.messages[0];
      
      if (message.status === '0') {
        return {
          success: true,
          messageId: message['message-id'],
          message: 'OTP sent successfully'
        };
      } else {
        return {
          success: false,
          error: message['error-text'] || `Error status: ${message.status}`,
          message: 'Failed to send OTP',
          statusCode: message.status
        };
      }
    } else {
      return {
        success: false,
        error: 'No response from SMS service',
        message: 'Failed to send OTP'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to send OTP'
    };
  }
};

export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
};
