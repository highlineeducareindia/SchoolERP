import { FaBars, FaChevronDown, FaSearch, FaBell } from "react-icons/fa";

const Header = ({ 
  toggleSidebar, 
  isProfileOpen, 
  setIsProfileOpen, 
  pageTitle, 
  logout 
}) => {
  return (
    <header className="bg-white border-b border-[#E5E7EB] h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className=" p-2 text-[#1F2937] hover:bg-[#F5F7FB] hover:text-[#3B82F6] rounded-lg transition"
        >
          <FaBars size={18} />
        </button>
      
        <h1 className="text-lg font-bold text-[#3B82F6]  whitespace-nowrap flex items-center">
          {pageTitle}
        </h1>
      </div>

      {/* Center: Search Bar with Background Light Gray (#F5F7FB) */}
      <div className="hidden lg:flex items-center bg-[#F5F7FB] border border-[#E5E7EB] rounded-full px-4 py-1.5 w-80 focus-within:ring-2 focus-within:ring-[#3B82F6]/20 focus-within:border-[#3B82F6] transition-all">
        <FaSearch className="text-[#6B7280] text-sm" />
        <input 
          type="text" 
          placeholder="Search for something..." 
          className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none text-[#1F2937] placeholder:text-[#6B7280]"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-5">
        {/* Notification Bell with Sky Blue Hover */}
        <button className="p-2 text-[#6B7280] hover:bg-[#F5F7FB] hover:text-[#3B82F6] rounded-full relative transition">
          <FaBell size={18} />
          {/* Badge using Sky Blue */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3B82F6] rounded-full border-2 border-white shadow-sm"></span>
        </button>

        <div className="h-8 w-[1px] bg-[#E5E7EB] hidden sm:block"></div>

        {/* Profile Section */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-2 p-1 rounded-xl transition-all ${isProfileOpen ? 'bg-[#F5F7FB]' : 'hover:bg-[#F5F7FB]'}`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none text-[#3B82F6]">Arjun Sharma</p>
              {/* Role label in Secondary Gray */}
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">School Admin</span>
            </div>
            
            {/* Avatar with Primary Blue Background (#3B82F6) */}
            <div className="w-10 h-10 rounded-full bg-[#3B82F6] border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
              AS
            </div>
            <FaChevronDown className={`text-[10px] text-[#6B7280] transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-[#3B82F6]' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-2xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-[#F5F7FB] mb-1">
                <p className="text-[10px] text-[#6B7280] uppercase font-black tracking-widest">Account Panel</p>
              </div>
              
              <button className="w-full text-left px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F5F7FB] hover:text-[#3B82F6] transition font-medium">
                My Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-[#1F2937] hover:bg-[#F5F7FB] hover:text-[#3B82F6] transition font-medium">
                System Settings
              </button>
              
              <hr className="my-1 border-[#E5E7EB]" />
              
              <button 
                onClick={logout} 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition flex items-center justify-between"
              >
                Logout
                <span className="text-[10px] bg-red-100 px-1.5 py-0.5 rounded text-red-700">Exit</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;