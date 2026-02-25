import axios from "axios";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [mode, setMode] = useState("login");
  const [isFlipped, setIsFlipped] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const toggleFlip = (newMode) => {
    setIsFlipped(!isFlipped);
    setTimeout(() => setMode(newMode), 150);
  };

  // --- Handlers (Logic remains the same) ---
  const handleLogin = async () => {
    const loadingToast = toast.loading("Verifying credentials...");
    try {
      const res = await axios.post(`${apiUrl}/api/superadmin/login`, { email, password });
      toast.success("Login Successful!", { id: loadingToast });
      if (res.data.firstLogin) {
        localStorage.setItem("companyId", res.data.companyId);
        navigate("/super-admin/update-password");
      } else {
        localStorage.setItem("companyId", res.data.companyId);
        navigate("/super-admin/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", { id: loadingToast });
    }
  };

  const handleForgot = async () => {
    if (!email) return toast.error("Please enter email address");
    const loadingToast = toast.loading("Sending OTP...");
    try {
      const res = await axios.post(`${apiUrl}/api/superadmin/forgot-password`, { email });
      toast.success(res.data.message || "OTP sent to email", { id: loadingToast });
      setMode("reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed", { id: loadingToast });
    }
  };

  const handleReset = async () => {
    if (newPass !== confirm) return toast.error("Passwords do not match");
    const loadingToast = toast.loading("Updating password...");
    try {
      const res = await axios.post(`${apiUrl}/api/superadmin/reset-password`, {
        email: email.trim(), otp: otp.trim(), password: newPass
      });
      toast.success(res.data.message || "Password updated!", { id: loadingToast });
      toggleFlip("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed", { id: loadingToast });
    }
  };

  // Shared Tailwind Class Constants
  const inputBase = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none text-[15px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-800 transition-all placeholder:text-gray-400";
  const labelBase = "text-[11px] font-bold text-gray-700 uppercase mb-1.5 block tracking-wider";
  const btnBase = "w-full py-3.5 rounded-xl font-bold text-white shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50";

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" />

      {/* Main Container */}
      <div className="flex flex-col md:flex-row w-full max-w-[1000px] min-h-[600px] bg-white rounded-[24px] overflow-hidden shadow-2xl">
        
        {/* Left Side (Visual) */}
        <div className="relative flex-[1.2] p-10 flex flex-col justify-between text-white overflow-hidden">
          {/* Background Layer */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/85 via-[#1E3A8A]/90 to-[#7C3AED]/85 z-10" />

          {/* Content */}
          <div className="relative z-20 flex items-center gap-2 text-[22px] font-black tracking-wider">
            <ShieldCheck size={26} /> SCHOOL ERP.
          </div>

          <div className="relative z-20">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Super Admin <br /> Portal.
            </h1>
            <p className="opacity-90 text-sm max-w-[300px] hidden md:block">
              Manage academic operations from one secure platform.
            </p>
          </div>

          <div className="relative z-20 flex gap-2.5">
            <div className="w-10 h-1 bg-white rounded-full"></div>
            <div className="w-5 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="flex-1 p-6 md:p-10 flex items-center justify-center [perspective:1500px]">
          <div className={`relative w-full max-w-[380px] h-[450px] transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            
            {/* FRONT FACE: LOGIN */}
            <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col justify-center">
              <h2 className="text-gray-900 text-[26px] font-extrabold mb-1">Login</h2>
              <p className="text-gray-500 text-sm mb-8">Welcome back, Admin.</p>
              
              <div className="mb-4">
                <label className={labelBase}>Email Address</label>
                <input 
                  className={inputBase} 
                  placeholder="admin@company.com" 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              
              <div className="mb-2 relative">
                <label className={labelBase}>Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className={inputBase} 
                  placeholder="••••••••" 
                  onChange={e => setPassword(e.target.value)} 
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9 text-gray-500 hover:text-blue-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="text-right mb-6">
                <button 
                  onClick={() => toggleFlip("forgot")} 
                  className="text-[#7C3AED] text-[13px] font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button onClick={handleLogin} className={`${btnBase} bg-[#1E3A8A] hover:bg-blue-900`}>
                Sign In
              </button>
            </div>

            {/* BACK FACE: FORGOT / RESET */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-center">
              <h2 className="text-gray-900 text-[26px] font-extrabold mb-1">
                {mode === "forgot" ? "Reset Access" : "Create Password"}
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                {mode === "forgot" ? "We'll send an OTP to your email." : "Secure your new admin password."}
              </p>

              {mode === "forgot" ? (
                <>
                  <div className="mb-4">
                    <label className={labelBase}>Registered Email</label>
                    <input className={inputBase} placeholder="admin@company.com" onChange={e => setEmail(e.target.value)} />
                  </div>
                  <button onClick={handleForgot} className={`${btnBase} bg-[#7C3AED] hover:bg-purple-700`}>
                    Send OTP
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <input placeholder="6-digit OTP" onChange={e => setOtp(e.target.value.trim())} className={inputBase} />
                  <div className="relative">
                    <input 
                      type={showNewPass ? "text" : "password"} 
                      placeholder="New Password" 
                      onChange={e => setNewPass(e.target.value)} 
                      className={inputBase} 
                    />
                    <button onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-3 text-gray-500">
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <input type="password" placeholder="Confirm Password" onChange={e => setConfirm(e.target.value)} className={inputBase} />
                  <button onClick={handleReset} className={`${btnBase} bg-[#7C3AED] hover:bg-purple-700`}>
                    Update Password
                  </button>
                </div>
              )}

              <button 
                onClick={() => toggleFlip("login")} 
                className="mt-6 text-sm text-gray-500 text-center hover:text-blue-900"
              >
                Back to <span className="font-bold text-[#1E3A8A]">Login</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}