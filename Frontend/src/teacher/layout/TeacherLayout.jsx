import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const logout = () => {
    localStorage.clear();
    navigate("/super-admin");
  };

  return (
    <div className="flex h-screen bg-[#F5F7FB] overflow-hidden">

      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        logout={logout} 
      />

      <div className="flex-1 flex flex-col min-w-0 h-full">

        <Header 
          toggleSidebar={toggleSidebar}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          pageTitle={getPageTitle()}
          logout={logout}
        />

        {/* ROUTER CONTENT HERE */}
        <main className="flex-1 overflow-y-auto  custom-scrollbar bg-[#F5F7FB]">
          <div className="max-w-7xl mx-auto min-h-full px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-sm z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}