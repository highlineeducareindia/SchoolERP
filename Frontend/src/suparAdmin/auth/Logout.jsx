import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth data
    localStorage.clear();
    sessionStorage.clear();

    // Instant redirect to login
    navigate("/super-admin/", { replace: true });

    // Hard refresh (optional but recommended)
    window.location.reload();
  }, []);

  return null; 
}