import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Clear karne se pehle role nikal lo (Assuming aapne 'role' key use ki hai)
    const userRole = localStorage.getItem("role"); // 'school', 'teacher', ya 'super-admin'

    // 2. Clear auth data
    localStorage.clear();
    sessionStorage.clear();

    // 3. Condition based redirection
    if (userRole === "school") {
      navigate("/school/login", { replace: true });
    } else if (userRole === "teacher") {
      navigate("/teacher/login", { replace: true });
    } else {
      // Default fallback (Super Admin ya unknown)
      navigate("/admin/", { replace: true });
    }
    window.location.reload();
  }, [navigate]);

  return null;
}