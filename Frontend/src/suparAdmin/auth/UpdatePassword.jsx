import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const companyId = localStorage.getItem("companyId");

  const colors = {
    primary: '#1E3A8A',
    bg: '#F5F7FB',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB'
  };

  const handleUpdate = async () => {
    if (!password || !confirm) return toast.error("All fields are required");
    if (password !== confirm) return toast.error("Passwords do not match");

    const loadingToast = toast.loading("Updating security settings...");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      await axios.post(`${apiUrl}/api/superadmin/update-password`, {
        companyId,
        newPassword: password
      });

      toast.success("Password Updated! Redirecting...", { id: loadingToast });
      setTimeout(() => navigate("/super-admin"), 2000); // Thoda delay login pe jane se pehle
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed", { id: loadingToast });
    }
  };

  // Inline Styles
  const containerStyle = {
    backgroundColor: colors.bg,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
    padding: '20px'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  };

  const inputGroup = { position: 'relative', marginBottom: '20px', textAlign: 'left' };
  
  const inputStyle = {
    width: '100%', padding: '14px 45px 14px 15px', borderRadius: '12px',
    border: `1px solid ${colors.border}`, outline: 'none', fontSize: '15px',
    backgroundColor: '#FAFAFA', boxSizing: 'border-box'
  };

  const eyeIconStyle = {
    position: 'absolute', right: '15px', top: '38px', cursor: 'pointer', color: colors.textSecondary
  };

  return (
    <div style={containerStyle}>
      <Toaster position="top-center" />
      <div style={cardStyle}>
        <div style={{ backgroundColor: '#EEF2FF', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <KeyRound size={28} color={colors.primary} />
        </div>

        <h2 style={{ color: colors.textPrimary, fontWeight: '800', fontSize: '24px', margin: '0 0 10px 0' }}>Set New Password</h2>
        <p style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '30px' }}>For security, please update your password on first login.</p>

        <div style={inputGroup}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: colors.textPrimary, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>New Password</label>
          <input 
            type={showPass ? "text" : "password"} 
            style={inputStyle} 
            placeholder="••••••••" 
            onChange={e => setPassword(e.target.value)} 
          />
          <span style={eyeIconStyle} onClick={() => setShowPass(!showPass)}>
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <div style={inputGroup}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: colors.textPrimary, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Confirm Password</label>
          <input 
            type={showConfirm ? "text" : "password"} 
            style={inputStyle} 
            placeholder="••••••••" 
            onChange={e => setConfirm(e.target.value)} 
          />
          <span style={eyeIconStyle} onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button 
          onClick={handleUpdate}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            backgroundColor: colors.primary, color: 'white', fontWeight: 'bold',
            fontSize: '16px', cursor: 'pointer', marginTop: '10px'
          }}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}