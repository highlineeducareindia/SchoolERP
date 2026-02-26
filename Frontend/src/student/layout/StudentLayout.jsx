import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Student specific sidebar
import Header from "./Header";   // Student specific header
import Footer from "./Footer";

export default function StudentLayout() {
  // Mobile/Desktop handling
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Updated Title logic for Students
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("attendance")) return "My Attendance";
    if (path.includes("assignments")) return "Assignments & Tasks";
    if (path.includes("results")) return "Exams & Reports";
    if (path.includes("fees")) return "Fee Records";
    if (path.includes("classes")) return "My Classes";
    if (path.includes("settings")) return "Profile Settings";
    return "Student Dashboard";
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Lg screens par open
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logout = () => {
    localStorage.clear();
    // Student login page par redirect
    navigate("/login"); 
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* SIDEBAR */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative transition-all duration-500 ease-in-out">
        
        <Header 
          toggleSidebar={toggleSidebar}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          pageTitle={getPageTitle()}
          logout={logout}
          isSidebarOpen={isSidebarOpen}
        />

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
          <div className="w-full mx-auto min-h-full p-4 md:p-8 transition-all duration-500">
            {/* Animated Wrapper for smooth page transitions */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Outlet />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}