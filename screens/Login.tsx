
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-12 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div className="mb-12 relative z-10">
        <div className="w-16 h-16 bg-green-600 rounded-3xl shadow-xl shadow-green-100 flex items-center justify-center mb-6">
          <span className="text-white font-black text-2xl italic tracking-tighter">P</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          Pureingo<br />
          <span className="text-green-600">Delivery Partner</span>
        </h1>
        <p className="text-gray-500 font-medium mt-3">Welcome back! Please sign in to start your deliveries.</p>
      </div>

      <div className="flex-1 relative z-10">
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all font-bold text-lg outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>

            <button
              disabled={isLoading || phone.length < 10}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2 text-center">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Verification Code</label>
              <p className="text-xs text-gray-500 mb-6">We've sent a 4-digit code to +91 {phone}</p>
              <div className="flex justify-center space-x-4">
                 {[1,2,3,4].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-14 h-16 text-center text-2xl font-black bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all"
                      onChange={(e) => {
                         if(e.target.value) setOtp(prev => prev + e.target.value);
                      }}
                    />
                 ))}
              </div>
            </div>

            <div className="space-y-4">
              <button
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-lg shadow-green-200"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verify & Login</span>
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-4 text-sm font-bold text-gray-400"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-12 text-center text-xs text-gray-400 font-medium">
        By continuing, you agree to Pureingo's <br />
        <span className="text-gray-900 underline">Terms of Service</span> and <span className="text-gray-900 underline">Privacy Policy</span>
      </div>
    </div>
  );
};
