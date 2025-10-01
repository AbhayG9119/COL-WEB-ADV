// OTP utility for forgot password
const otpStore = new Map(); // In production, use Redis or DB

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
};

export const storeOTP = (mobile, otp) => {
  otpStore.set(mobile, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 min expiry
};

export const verifyOTP = (mobile, otp) => {
  const stored = otpStore.get(mobile);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(mobile);
    return false;
  }
  if (stored.otp === otp) {
    otpStore.delete(mobile);
    return true;
  }
  return false;
};

export const sendOTP = (mobileNumber, otp) => {
  // Mock SMS: In production, integrate with Twilio, AWS SNS, etc.
  console.log(`OTP for ${mobileNumber}: ${otp}`);
  // Example with Twilio (uncomment and configure):
  // const twilio = require('twilio');
  // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  // return client.messages.create({
  //   body: `Your OTP is ${otp}`,
  //   from: process.env.TWILIO_PHONE,
  //   to: mobileNumber
  // });
};
