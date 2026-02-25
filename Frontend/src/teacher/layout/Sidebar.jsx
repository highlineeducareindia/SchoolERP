import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
  FaChalkboardTeacher, // Updated icon for Teacher Panel
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/teacher/teacher/dashboard", // Updated path
      icon: <FaTachometerAlt />,
    },
    { 
      name: "Settings", 
      path: "/teacher/teacher/settings", // Updated path
      icon: <FaCog /> 
    },
  ];

  const navigate = useNavigate();

  return (
    <>
      {/* 1. Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 md:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      {/* 2. Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#1E293B] text-[#E2E8F0] 
          transform transition-transform duration-500 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
          flex flex-col h-screen border-r border-[#334155] shadow-2xl md:shadow-none
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#334155] shrink-0">
          <div className="flex items-center gap-2">
            {/* Primary Accent: Emerald Green */}
            <FaChalkboardTeacher className="text-[#10B981] text-xl" />
            <span className="text-xl font-bold tracking-tight text-white">
              Teacher<span className="text-[#10B981]">.</span>
            </span>
          </div>

          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 text-[#E2E8F0] hover:bg-[#334155] rounded-full transition-colors duration-300"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-sidebar-scroll">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? "bg-[#10B981] text-white shadow-sm shadow-[#10B981]/20 font-semibold scale-[1.02]"
                    : "text-[#E2E8F0] hover:bg-[#334155] hover:text-white"
                }`
              }
            >
              <span className={`text-lg transition-transform duration-300 group-hover:scale-110`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Bottom - Logout */}
        <div className="p-4 border-t border-[#334155] shrink-0 bg-[#1E293B]">
          <button
            onClick={() => navigate("/logout")}
            className="flex items-center gap-3 px-4 py-3 text-[#E2E8F0] hover:bg-red-500/10 hover:text-red-400 rounded-lg w-full transition-all duration-300 group"
          >
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;