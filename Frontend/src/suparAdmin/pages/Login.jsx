import axios from "axios";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"; 
import { toast, Toaster } from "react-hot-toast"; // 1. Added Toast Import
import { useNavigate } from "react-router-dom";

export default function Login() {
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

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const colors = {
    primary: '#1E3A8A',
    primaryLight: '#3B82F6',
    secondary: '#7C3AED',
    bg: '#F5F7FB',
    card: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB'
  };

  const toggleFlip = (newMode) => {
    setIsFlipped(!isFlipped);
    setTimeout(() => setMode(newMode), 150);
  };

  // --- Handlers with Toast ---
  const handleLogin = async () => {
    const loadingToast = toast.loading("Verifying credentials...");
    try {
      const res = await axios.post(`${apiUrl}/api/company/login`, { email, password });
      toast.success("Login Successful!", { id: loadingToast });
      
      if (res.data.firstLogin) {
  localStorage.setItem("companyId", res.data.companyId);
  navigate("/update-password");
} else {
  navigate("/dashboard");
}
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", { id: loadingToast });
    }
  };

  const handleForgot = async () => {
    if (!email) return toast.error("Please enter email address");
    const loadingToast = toast.loading("Sending OTP...");
    try {
      const res = await axios.post(`${apiUrl}/api/company/forgot-password`, { email });
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
      const res = await axios.post(`${apiUrl}/api/company/reset-password`, {
        email: email.trim(), otp: otp.trim(), password: newPass
      });
      toast.success(res.data.message || "Password updated!", { id: loadingToast });
      toggleFlip("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed", { id: loadingToast });
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 45px 14px 14px', marginBottom: '15px', borderRadius: '12px',
    border: `1px solid ${colors.border}`, outline: 'none', fontSize: '15px',
    backgroundColor: '#FAFAFA', boxSizing: 'border-box', transition: '0.3s'
  };

  const buttonStyle = {
    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
    backgroundColor: colors.primary, color: 'white', fontWeight: 'bold',
    fontSize: '16px', cursor: 'pointer', boxShadow: `0 4px 14px 0 rgba(30, 58, 138, 0.3)`,
    transition: '0.3s'
  };

  const iconContainerStyle = {
    position: 'absolute', right: '15px', top: '42px', cursor: 'pointer', color: colors.textSecondary
  };

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 2. Added Toaster Component (Doesn't affect UI layout) */}
      <Toaster position="top-center" reverseOrder={false} />

      <style>{`
        .main-container { display: flex; width: 1000px; height: 620px; background: white; border-radius: 30px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); }
        .image-side { flex: 1.2; position: relative; background: linear-gradient(rgba(30, 58, 138, 0.8), rgba(124, 58, 237, 0.8)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'); background-size: cover; background-position: center; display: flex; flex-direction: column; justify-content: center; padding: 40px; color: white; }
        .form-side { flex: 1; perspective: 1000px; padding: 20px; display: flex; align-items: center; justify-content: center; background: #fff; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
        .flipped { transform: rotateY(180deg); }
        .face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; justify-content: center; padding: 20px; box-sizing: border-box; }
        .back { transform: rotateY(180deg); }
        .input-group { position: relative; width: 100%; }
        @media (max-width: 900px) { .main-container { flex-direction: column; width: 100%; height: auto; } .image-side { height: 200px; } .form-side { height: 550px; } }
      `}</style>

      <div className="main-container">
        <div className="image-side">
          <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '1px', marginBottom: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={28} />SCHOOL ERP.
          </div>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '15px', lineHeight: '1.1' }}>Super Admin <br/> Portal.</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', maxWidth: '300px' }}>Manage students, staff, admissions, fees, attendance and academic operations from one secure platform..</p>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
            <div style={{ width: '40px', height: '4px', background: 'white', borderRadius: '10px' }}></div>
            <div style={{ width: '20px', height: '4px', background: 'rgba(255,255,255,0.4)', borderRadius: '10px' }}></div>
          </div>
        </div>

        <div className="form-side">
          <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
            
            <div className="face front">
              <h2 style={{ color: colors.textPrimary, fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0' }}>Login</h2>
              <p style={{ color: colors.textSecondary, marginBottom: '30px', fontSize: '14px' }}>Welcome back, Admin. Please sign in.</p>
              
              <div className="input-group">
                <label style={labelStyle}>Email Address</label>
                <input style={inputStyle} placeholder="admin@company.com" onChange={e => setEmail(e.target.value)} />
              </div>
              
              <div className="input-group">
                <label style={labelStyle}>Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  style={inputStyle} 
                  placeholder="••••••••" 
                  onChange={e => setPassword(e.target.value)} 
                />
                <span style={iconContainerStyle} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              
              <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <span onClick={() => toggleFlip("forgot")} style={{ color: colors.secondary, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Forgot Password?</span>
              </div>

              <button onClick={handleLogin} style={buttonStyle}>Sign In to Dashboard</button>
            </div>

            <div className="face back">
              <h2 style={{ color: colors.textPrimary, fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0' }}>
                {mode === "forgot" ? "Reset Access" : "Create Password"}
              </h2>
              <p style={{ color: colors.textSecondary, marginBottom: '30px', fontSize: '14px' }}>
                {mode === "forgot" ? "We'll send an OTP to your email." : "Secure your new admin password."}
              </p>

              {mode === "forgot" ? (
                <>
                  <div className="input-group">
                    <label style={labelStyle}>Registered Email</label>
                    <input style={inputStyle} placeholder="admin@company.com" onChange={e => setEmail(e.target.value)} />
                  </div>
                  <button onClick={handleForgot} style={{...buttonStyle, backgroundColor: colors.secondary, marginTop: '10px'}}>Send OTP Code</button>
                </>
              ) : (
                <>
                  <input placeholder="Enter 6-digit OTP" onChange={e => setOtp(e.target.value.trim())} style={inputStyle} />
                  
                  <div className="input-group">
                    <input 
                      type={showNewPass ? "text" : "password"} 
                      placeholder="New Password" 
                      onChange={e => setNewPass(e.target.value)} 
                      style={inputStyle} 
                    />
                    <span style={{...iconContainerStyle, top: '13px'}} onClick={() => setShowNewPass(!showNewPass)}>
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>

                  <input type="password" placeholder="Confirm Password" onChange={e => setConfirm(e.target.value)} style={inputStyle} />
                  
                  <button onClick={handleReset} style={{...buttonStyle, backgroundColor: colors.secondary}}>Update Password</button>
                </>
              )}

              <p onClick={() => toggleFlip("login")} style={{ textAlign: 'center', cursor: 'pointer', marginTop: '25px', fontSize: '14px', color: colors.textSecondary }}>
                Back to <span style={{ color: colors.primary, fontWeight: 'bold' }}>Login</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '11px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', marginBottom: '6px', display: 'block', letterSpacing: '0.5px' };