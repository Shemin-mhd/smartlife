// Serverless Brevo Email Dispatch Service

export interface SendOtpResult {
  success: boolean;
  otpCode: string;
  recipients: string[];
  error?: string;
  message?: string;
}

/**
 * Sends a 6-digit OTP email via Brevo SMTP to rishadsmartlife@gmail.com and nafalkt7@gmail.com.
 */
export const sendAdminLoginOtp = async (primaryEmail: string): Promise<SendOtpResult> => {
  const recipientList = ['rishadsmartlife@gmail.com', 'nafalkt7@gmail.com'];

  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: primaryEmail })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        otpCode: data.otpCode,
        recipients: recipientList,
        message: 'OTP dispatched successfully to rishadsmartlife@gmail.com & nafalkt7@gmail.com'
      };
    } else {
      return {
        success: false,
        otpCode: '',
        recipients: recipientList,
        error: data.message || 'Failed to dispatch email'
      };
    }
  } catch (err: any) {
    console.error('Error dispatching OTP email:', err);
    return {
      success: false,
      otpCode: '',
      recipients: recipientList,
      error: 'Network request failed'
    };
  }
};
