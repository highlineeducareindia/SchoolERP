import axios from "axios";
import { useState } from "react";
import { Eye, EyeOff, GraduationCap, ArrowRight } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [email, setEmail] = useState(""); // Maps to your student identifier
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const toggleFlip = (newMode) => {
    setIsFlipped(!isFlipped);
    setTimeout(() => setMode(newMode), 150);
  };

const handleLogin = async () => {
  if (!email || !password) return toast.error("Please enter Student ID");
  
  const loadingToast = toast.loading("Verifying Student ID...");
  try {
    // 🔥 Variable ka naam 'email' hai but hum bhej 'studentId' rahe hain
    const res = await axios.post(`${apiUrl}/api/admin/student-login`, { 
      studentId: email.trim(), // Database field 'studentId' ke saath match karein
      password: password 
    });
    
    if (res.data.success) {
      toast.success("Login Successful", { id: loadingToast });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", "student");
      navigate("/student/dashboard", { replace: true });
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Student Not Found", { id: loadingToast });
  }
};
  // Student Theme Styles (Cyan Accent)
  const inputBase = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none text-[15px] focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder:text-gray-400";
  const labelBase = "text-[11px] font-bold text-gray-700 uppercase mb-1.5 block tracking-wider";
  const btnBase = "w-full py-3.5 rounded-xl font-bold text-white shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen bg-[#ECFEFF] flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" />

      <div className="flex flex-col md:flex-row w-full max-w-[1000px] min-h-[600px] bg-white rounded-[24px] overflow-hidden shadow-2xl">
        
        {/* Left Side (Student Branding) */}
        <div className="relative flex-[1.2] p-10 flex flex-col justify-between text-white overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 scale-110" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2]/90 via-[#0E7490]/85 to-[#1E40AF]/80 z-10" />

          <div className="relative z-20 flex items-center gap-2 text-[22px] font-black tracking-wider">
            <GraduationCap size={28} className="text-cyan-300" /> HIGHLINE STUDENT
          </div>

          <div className="relative z-20">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 italic uppercase">
              Unlock <br /> Your Future.
            </h1>
            <p className="opacity-90 text-sm max-w-[320px] leading-relaxed italic">
              Access your digital classroom, assignments, and exam results in one click.
            </p>
          </div>

          <div className="relative z-20 h-1.5 w-20 bg-cyan-400 rounded-full" />
        </div>

        {/* Right Side (Form) */}
        <div className="flex-1 p-6 md:p-12 flex items-center justify-center [perspective:1500px]">
          <div className={`relative w-full max-w-[380px] h-[460px] transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            
            {/* FRONT: STUDENT LOGIN */}
            <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col justify-center">
              <h2 className="text-gray-900 text-[28px] font-black mb-1 tracking-tight">Student Portal</h2>
              <p className="text-gray-500 text-sm mb-8 font-medium">Please enter your student credentials.</p>
              
              <div className="mb-4">
                <label className={labelBase}>Student ID / Email</label>
                <input 
                  className={inputBase} 
                  placeholder="e.g. STU12345" 
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
                  className="absolute right-4 top-9 text-gray-400 hover:text-cyan-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="text-right mb-6">
                <button 
                  onClick={() => toggleFlip("forgot")} 
                  className="text-cyan-600 text-[13px] font-bold hover:underline tracking-tight"
                >
                  Forgot Password?
                </button>
              </div>

              <button onClick={handleLogin} className={`${btnBase} bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200`}>
                Enter Classroom <ArrowRight size={19} />
              </button>
            </div>

            {/* BACK: FORGOT PASSWORD */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-center">
              <h2 className="text-gray-900 text-[26px] font-black mb-1">Help Desk</h2>
              <p className="text-gray-500 text-sm mb-8">We'll help you recover your account.</p>

              <div className="mb-6">
                <label className={labelBase}>Registered Email</label>
                <input className={inputBase} placeholder="student@school.com" />
              </div>
              
              <button className={`${btnBase} bg-slate-800 hover:bg-black`}>
                Send Recovery OTP
              </button>

              <button 
                onClick={() => toggleFlip("login")} 
                className="mt-8 text-sm text-gray-500 text-center font-bold hover:text-cyan-700"
              >
                Back to <span className="text-cyan-600 underline">Login</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}