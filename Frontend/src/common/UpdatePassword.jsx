import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function UpdatePassword({ userType = "school" }) { // 'superadmin', 'school', 'teacher'
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  // --- Theme Logic ---
  const themeMap = {
    superadmin: '#7C3AED', // Purple
    school: '#3B82F6',    // Blue
    teacher: '#10B981'    // Green
  };
  const activeColor = themeMap[userType] || '#3B82F6';

  const handleUpdate = async () => {
    if (password !== confirm) return toast.error("Passwords do not match");
    const loadingToast = toast.loading("Updating security...");
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${apiUrl}/api/common/update-password`, {
        id: localStorage.getItem("userId"),
        newPassword: password
      });
      toast.success("Security Updated!", { id: loadingToast });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error("Update failed", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" />
      <div className="w-full max-w-[420px] bg-white p-10 rounded-[24px] shadow-2xl text-center border border-gray-100">
        
        {/* Icon Circle */}
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${activeColor}15` }} // 15% opacity
        >
          <KeyRound size={28} style={{ color: activeColor }} />
        </div>

        <h2 className="text-gray-900 font-extrabold text-2xl mb-2">Set New Password</h2>
        <p className="text-gray-500 text-sm mb-8">Update your security settings for {userType}.</p>

        <div className="space-y-5 text-left">
          <div>
            <label className="text-[11px] font-bold text-gray-700 uppercase mb-2 block tracking-wider">New Password</label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 transition-all"
                style={{ focusRingColor: activeColor }}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <span className="absolute right-4 top-3.5 cursor-pointer text-gray-400" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-700 uppercase mb-2 block tracking-wider">Confirm Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 transition-all"
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            onClick={handleUpdate}
            className="w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-[0.98] transition-all mt-4"
            style={{ backgroundColor: activeColor }}
          >
            Finish Setup
          </button>
        </div>
      </div>
    </div>
  );
}