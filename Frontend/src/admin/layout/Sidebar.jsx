import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
  FaUserShield,
  FaRocket,
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    {name:"plans", path:"/admin/plans", icon:<FaRocket />},
    { name: "Students", path: "/admin/students", icon: <FaUserShield /> },
    {name:"View Students", path:"/admin/view-students", icon:<FaUserShield />},
    { name: "Teachers", path: "/admin/teachers", icon: <FaUserShield /> },
    {name:"View Teachers", path:"/admin/view-teachers", icon:<FaUserShield />},

    { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
  ];

  const navigate = useNavigate();

  return (
    <>
      {/* 1. Mobile Overlay - Smooth Fade */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-all duration-500 md:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      {/* 2. Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70] bg-[#1E293B] text-[#E2E8F0] 
          /* Transition-all mobile translate aur desktop width dono ko handle karega */
          transition-all duration-500 ease-in-out overflow-hidden
          md:relative
          ${
            isSidebarOpen 
              ? "w-64 translate-x-0 opacity-100" 
              : "w-0 -translate-x-full md:translate-x-0 md:w-0 opacity-0 md:opacity-100"
          }
          flex flex-col h-screen border-r border-[#334155]
        `}
      >
        {/* Fixed Inner Div: Iska width fixed hona zaroori hai smoothness ke liye */}
        <div className="w-64 flex flex-col h-full shrink-0">
          
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#334155] shrink-0">
            <div className="flex items-center gap-2">
              <FaUserShield className="text-[#3B82F6] text-xl" />
              <span className="text-xl font-bold tracking-tight text-white">
                Admin
              </span>
            </div>

            {/* Close Button (Mobile Only) */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 text-[#E2E8F0] hover:bg-[#334155] rounded-full transition-colors"
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
                      ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20 font-semibold"
                      : "text-[#E2E8F0] hover:bg-[#334155] hover:text-white"
                  }`
                }
              >
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="text-sm tracking-wide">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Bottom - Logout */}
          <div className="p-4 border-t border-[#334155] shrink-0 bg-[#1E293B]">
            <button
              onClick={() => navigate("/admin/logout")}
              className="flex items-center gap-3 px-4 py-3 text-[#E2E8F0] hover:bg-red-500/10 hover:text-red-400 rounded-lg w-full transition-all duration-300 group"
            >
              <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;