import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaTachometerAlt,
  FaBuilding,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaCrown } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/super-admin/dashboard",
      icon: <FaTachometerAlt />,
    },
    { name: "Companies", path: "/super-admin/company", icon: <FaBuilding /> },
    { name: "Admins", path: "/super-admin/admins", icon: <FaUsers /> },
    { name: "Plans", path: "/super-admin/plans", icon: <FaUsers /> },
    {
      name: "School Registration",
      path: "/super-admin/school-register",
      icon: <FaUsers />,
    },
    {
      name: "Company Registration",
      path: "/super-admin/company-register",
      icon: <FaUsers />,
    },
    { name: "Settings", path: "/super-admin/settings", icon: <FaCog /> },
  ];
  const navigate = useNavigate();
  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-[#1E293B] text-[#E2E8F0] transform transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:relative md:translate-x-0
      flex flex-col h-screen
    `}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#334155] shrink-0">
        <div className="flex items-center gap-2">
          <FaCrown className="text-[#7C3AED] text-xl" />
          <span className="text-xl font-bold">
            Super<span className="text-white">Admin</span>
          </span>
        </div>

        <button
          onClick={toggleSidebar}
          className="md:hidden text-white hover:text-[#7C3AED] transition"
        >
          <FaTimes />
        </button>
      </div>

      {/* Sidebar Links - Purple Active State */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-sidebar-scroll">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#7C3AED] text-white shadow-lg shadow-purple-900/40 font-medium"
                  : "text-[#E2E8F0] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Bottom Logout - Fixed with Purple Hover */}
      <div className="p-3  border-t border-[#334155] shrink-0 bg-[#1E293B]">
        <button
          onClick={() => navigate("/super-admin/logout")}
          className="flex items-center gap-3 px-4 py-3 text-[#E2E8F0] hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] rounded-lg w-full transition group"
        >
          <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
