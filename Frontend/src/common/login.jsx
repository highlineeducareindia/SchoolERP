import axios from "axios";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ShieldCheck, UserCircle, ArrowLeft } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

export default function UnifiedLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  
  const [mode, setMode] = useState("login"); // 'login', 'forgot', 'reset'
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // URL se initial detection (Agar koi specific URL par jaye)
  const [isSchool, setIsSchool] = useState(!location.pathname.includes("teacher"));

  // URL change hone par theme update karein
  useEffect(() => {
    setIsSchool(!location.pathname.includes("teacher"));
  }, [location.pathname]);

  // --- DYNAMIC STYLE CONFIG ---
  const themeColor = isSchool ? "#2563EB" : "#10B981"; 
  const themeGradient = isSchool 
    ? "from-[#1E3A8A]/95 to-[#2563EB]/90" 
    : "from-[#047857]/95 to-[#10B981]/90";
    
  const bgImage = isSchool 
    ? "url('https://images.unsplash.com/photo-1523050335392-93851179428c?q=80&w=2070')" 
    : "url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974')";

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const toggleFlip = (targetMode) => {
    setIsFlipped(!isFlipped);
    setTimeout(() => setMode(targetMode), 150);
  };

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please fill all fields");
    
    const loadingToast = toast.loading("Authenticating...");
    try {
      // Common endpoint jo dono roles handle karega
      const res = await axios.post(`${apiUrl}/api/common/login`, { email, password });
      
      const { role, id, firstLogin, token } = res.data;
      
      // Token save karein
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      toast.success(`${role.toUpperCase()} Login Successful!`, { id: loadingToast });

      if (firstLogin) {
        localStorage.setItem("userId", id);
        navigate(role === "school" ? "/school/update-password" : "/teacher/update-password");
      } else {
        // Yahan redirection logic hai role ke according
        if (role === "school" || role === "admin") {
          navigate("/school/dashboard");
        } else {
          navigate("/teacher/dashboard");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Credentials", { id: loadingToast });
    }
  };

  const handleSendOTP = async () => {
    if (!email) return toast.error("Please enter email");
    const loadingToast = toast.loading("Sending OTP...");
    try {
      const type = isSchool ? "school" : "teacher";
      await axios.post(`${apiUrl}/api/common/forgot-password`, { email, type });
      toast.success("OTP sent to your email!", { id: loadingToast });
      setMode("reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP", { id: loadingToast });
    }
  };

  const inputBase = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none text-[14px] font-medium text-gray-700 transition-all focus:bg-white focus:ring-2 focus:border-transparent";
  const labelBase = "text-[11px] font-bold text-gray-500 uppercase mb-2 block tracking-wider";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 font-sans">
      <Toaster position="top-center" />
      
      <div className="flex flex-col md:flex-row w-full max-w-[1000px] bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl border border-gray-100 min-h-[600px]">
        
        {/* Left Side (Visual Panel) */}
        <div className="relative w-full md:flex-[1.2] p-8 md:p-12 flex flex-col justify-between text-white overflow-hidden min-h-[260px] md:min-h-[600px]">
          <div className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000 scale-105" style={{ backgroundImage: bgImage }} />
          <div className={`absolute inset-0 bg-gradient-to-br ${themeGradient} z-10`} />
          
          <div className="relative z-20 flex items-center gap-2.5 text-base md:text-lg font-bold tracking-widest mb-6 md:mb-0">
            {isSchool ? <ShieldCheck size={24} /> : <UserCircle size={24} />} 
            {isSchool ? "SCHOOL ADMIN" : "TEACHER PORTAL"}
          </div>
          
          <div className="relative z-20 mt-auto md:mt-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3 md:mb-4 tracking-tight">
              {isSchool ? "Empower" : "Digital" } <br /> {isSchool ? "Education." : "Classroom." }
            </h1>
            <p className="opacity-90 text-xs md:text-sm font-medium max-w-[280px] leading-relaxed hidden sm:block">
              {isSchool 
                ? "Secure access to school management and administrative tools."
                : "Your personalized digital space to manage students and classes."}
            </p>
          </div>
          
          <div className="relative z-20 flex gap-2 mt-6 md:mt-0 hidden md:flex">
            <div className={`w-10 h-1 bg-white rounded-full transition-all`}></div>
            <div className={`w-4 h-1 bg-white/40 rounded-full`}></div>
          </div>
        </div>

        {/* Right Side (Form Panel) */}
        <div className="w-full md:flex-1 p-6 sm:p-8 md:p-12 flex items-center justify-center [perspective:2000px] bg-white min-h-[450px]">
          
          <div className={`relative w-full max-w-[360px] h-[450px] transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            
            {/* FRONT: LOGIN */}
            <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col justify-center bg-white">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Sign In</h2>
                <p className="text-gray-500 text-sm font-medium">Please enter your credentials.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Email Address</label>
                  <input 
                    className={inputBase} 
                    style={{ '--tw-ring-color': `${themeColor}40` }} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="email@example.com" 
                  />
                </div>
                <div className="relative">
                  <label className={labelBase}>Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className={inputBase} 
                    style={{ '--tw-ring-color': `${themeColor}40` }} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-10 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 mb-6">
                 <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" className="rounded border-gray-300 cursor-pointer" style={{ accentColor: themeColor }} />
                    <label htmlFor="remember" className="text-xs font-semibold text-gray-500 cursor-pointer">Remember me</label>
                 </div>
                 <button onClick={() => toggleFlip("forgot")} className="text-xs font-bold transition-colors hover:underline" style={{ color: themeColor }}>
                    Forgot Password?
                </button>
              </div>

              <button 
                onClick={handleLogin} 
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-md transition-all active:scale-[0.98] hover:shadow-lg" 
                style={{ backgroundColor: themeColor }}
              >
                Sign In to Portal
              </button>

              <p className="mt-8 text-center text-[11px] text-gray-400 font-medium">
                Protected by Secure SSL Encryption
              </p>
            </div>

            {/* BACK: FORGOT / RESET */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-center bg-white">
               <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-500 text-sm">Enter email to recover access.</p>
              </div>
              <input className={inputBase} placeholder="Enter registered email" onChange={e => setEmail(e.target.value)} />
              <button onClick={handleSendOTP} className="w-full py-3.5 mt-4 rounded-xl font-bold text-white shadow-md" style={{ backgroundColor: themeColor }}>
                  Send OTP
              </button>
              <button onClick={() => toggleFlip("login")} className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-700 mx-auto">
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}