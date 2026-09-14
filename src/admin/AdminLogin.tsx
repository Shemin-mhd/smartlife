import React, { useState, useRef, useEffect } from 'react';
import { Lock, Mail, Shield, AlertCircle, ArrowRight, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendAdminLoginOtp } from '../utils/brevoEmailService';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const { login } = useAuth();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [activeOtp, setActiveOtp] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'otp') {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  // Step 1: Validate Account Credentials & Send OTP
  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);
    setIsSubmitting(true);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please enter a valid official email address.');
      setIsSubmitting(false);
      return;
    }

    if (!password.trim()) {
      setError('Please enter your access passcode.');
      setIsSubmitting(false);
      return;
    }

    // 1. Dispatch OTP via Brevo SMTP to both admin emails
    const res = await sendAdminLoginOtp(trimmedEmail);
    setIsSubmitting(false);

    if (res.success) {
      setActiveOtp(res.otpCode);
      setStep('otp');
      setInfoMsg('📩 6-Digit OTP email sent to rishadsmartlife@gmail.com, nafalkt7@gmail.com & sheminmuhammed594@gmail.com!');
    } else {
      setError(res.error || 'Could not send OTP email. Please check your Brevo settings.');
    }
  };

  // Handle individual 6-digit OTP input boxes
  const handleOtpChange = (index: number, value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    
    // User pasted multiple digits into single input field
    if (digitsOnly.length === 6) {
      setOtpDigits(digitsOnly.split(''));
      inputRefs.current[5]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = digitsOnly.slice(-1);
    setOtpDigits(newDigits);

    if (digitsOnly && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digitsOnly = pastedData.replace(/\D/g, '');
    if (digitsOnly.length === 6) {
      setOtpDigits(digitsOnly.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  // Step 2: Verify OTP Code and complete Admin Sign-In
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      setIsSubmitting(false);
      return;
    }

    // Verify OTP against the active generated code sent via Brevo
    if (activeOtp && enteredOtp !== activeOtp) {
      setIsSubmitting(false);
      setError('Invalid OTP code. Please check your email inbox and enter the 6-digit code sent to you.');
      return;
    }

    try {
      const loginRes = await login(email, password);
      setIsSubmitting(false);
      if (loginRes.success) {
        onSuccess();
      } else {
        setError(loginRes.error || 'Authentication error.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError('Verification error. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setInfoMsg('Resending OTP code to rishadsmartlife@gmail.com, nafalkt7@gmail.com & sheminmuhammed594@gmail.com...');
    setIsSubmitting(true);
    
    const res = await sendAdminLoginOtp(email.trim());
    setIsSubmitting(false);

    if (res.success) {
      setActiveOtp(res.otpCode);
      setOtpDigits(['', '', '', '', '', '']);
      setInfoMsg('📩 A new 6-digit OTP code has been dispatched to rishadsmartlife@gmail.com, nafalkt7@gmail.com & sheminmuhammed594@gmail.com!');
    } else {
      setError(res.error || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              {step === 'credentials' ? <Shield className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
            </div>
            <div>
              <h1 className="text-base font-semibold text-white tracking-tight">Smart Life Admin Portal</h1>
              <p className="text-xs text-slate-400">
                {step === 'credentials' ? 'Step 1: Admin Credentials' : 'Step 2: Email Security OTP Check'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {infoMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{infoMsg}</div>
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your admin email"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-1/3 py-2.5 px-3 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition text-center"
                >
                  Back to Site
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 px-3 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending OTP...' : 'Next: Send Email OTP'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-600">
                  Enter the 6-digit OTP code sent to:
                </p>
                <p className="text-xs font-semibold text-emerald-700">rishadsmartlife@gmail.com, nafalkt7@gmail.com & sheminmuhammed594@gmail.com</p>
              </div>

              {/* 6-Digit Numeric Inputs */}
              <div className="flex justify-between items-center gap-2" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn't receive the email?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-emerald-600 font-medium hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="w-1/3 py-2.5 px-3 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 px-3 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify OTP & Enter Admin'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Protected by Firebase Auth + Brevo SMTP</span>
          <span>Dual Delivery Mode</span>
        </div>
      </div>
    </div>
  );
};
