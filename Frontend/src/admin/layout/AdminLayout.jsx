import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function AdminLayout() {
  // Desktop par default open rakhne ke liye true
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("company")) return "Companies Management";
    if (path.includes("admins")) return "System Administrators";
    if (path.includes("plans")) return "Plans";
    return "Dashboard";
  };

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  };

  // First load
  handleResize();

  // Add resize listener
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);

  const logout = () => {
    localStorage.clear();
    navigate("/super-admin");
  };

  return (
    <div className="flex h-screen bg-[#F5F7FB] overflow-hidden">
      
      {/* SIDEBAR: Wrapper handles the layout push/pull effect */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        logout={logout} 
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full transition-all duration-500 ease-in-out">
        
        <Header 
          toggleSidebar={toggleSidebar}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          pageTitle={getPageTitle()}
          logout={logout}
          isSidebarOpen={isSidebarOpen}
        />

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#F5F7FB]">
          <div className="w-full mx-auto min-h-full px-4 sm:px-6 lg:px-8 py-6 transition-all duration-500">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}