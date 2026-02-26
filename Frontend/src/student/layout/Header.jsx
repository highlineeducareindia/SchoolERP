import { FaBars, FaChevronDown, FaSearch, FaBell, FaUserCircle, FaGraduationCap } from "react-icons/fa";

const Header = ({ 
  toggleSidebar, 
  isProfileOpen, 
  setIsProfileOpen, 
  pageTitle, 
  logout 
}) => {
  return (
    <header className="bg-white border-b border-[#E5E7EB] h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm">
      
      {/* Left Section: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 text-[#1F2937] hover:bg-[#F5F7FB] hover:text-[#3B82F6] rounded-lg transition-all active:scale-95"
        >
          <FaBars size={18} />
        </button>
      
        <div className="flex flex-col">
          <h1 className="text-lg font-black text-[#3B82F6] whitespace-nowrap leading-none">
            {pageTitle}
          </h1>
          <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-tighter mt-1 hidden md:block">
            Student Workspace
          </span>
        </div>
      </div>

      {/* Center Section: Global Search */}
      <div className="hidden lg:flex items-center bg-[#F5F7FB] border border-[#E5E7EB] rounded-2xl px-4 py-1.5 w-96 focus-within:ring-4 focus-within:ring-[#3B82F6]/5 focus-within:border-[#3B82F6] transition-all">
        <FaSearch className="text-[#6B7280] text-sm" />
        <input 
          type="text" 
          placeholder="Search subjects, assignments, or results..." 
          className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none text-[#1F2937] placeholder:text-[#9CA3AF]"
        />
      </div>

      {/* Right Section: Notifications & Student Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Academic Badge (New for Student) */}
        <div className="hidden sm:flex items-center gap-2 bg-[#EEF2FF] px-3 py-1.5 rounded-xl border border-[#D1E0FF]">
          <FaGraduationCap className="text-[#3B82F6]" />
          <span className="text-[11px] font-black text-[#3B82F6] uppercase">Grade 10-A</span>
        </div>

        {/* Notification Bell */}
        <button className="p-2.5 text-[#6B7280] hover:bg-[#F5F7FB] hover:text-[#3B82F6] rounded-xl relative transition-all group">
          <FaBell size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
        </button>

        <div className="h-8 w-[1px] bg-[#E5E7EB] mx-1 hidden sm:block"></div>

        {/* Profile Section */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 p-1 rounded-2xl transition-all ${isProfileOpen ? 'bg-[#F5F7FB]' : 'hover:bg-[#F5F7FB]'}`}
          >
            <div className="text-right hidden sm:block pl-2">
              <p className="text-sm font-black leading-none text-[#1F2937]">Rahul Verma</p>
              <span className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-widest">ID: STU-2024-05</span>
            </div>
            
            {/* Student Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] shadow-lg flex items-center justify-center text-white font-black text-sm border-2 border-white">
              RV
            </div>
            
            <FaChevronDown className={`text-[10px] text-[#6B7280] transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-[#3B82F6]' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] py-3 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="px-5 py-2 mb-2">
                <p className="text-[10px] text-[#9CA3AF] uppercase font-black tracking-widest">Personal Account</p>
              </div>
              
              <div className="space-y-1 px-2">
                <button className="w-full text-left px-4 py-2.5 text-sm text-[#4B5563] hover:bg-[#F5F7FB] hover:text-[#3B82F6] rounded-xl transition font-bold flex items-center gap-3">
                  <FaUserCircle size={16} /> My Academic Profile
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-[#4B5563] hover:bg-[#F5F7FB] hover:text-[#3B82F6] rounded-xl transition font-bold flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-[#3B82F6]/10 flex items-center justify-center text-[10px]">₹</div> Fee Structure
                </button>
              </div>
              
              <div className="my-2 border-t border-[#F3F4F6] mx-4"></div>
              
              <div className="px-2">
                <button 
                  onClick={logout} 
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-black transition flex items-center justify-between"
                >
                  Logout Session
                  <span className="text-[9px] bg-red-100 px-2 py-0.5 rounded-full text-red-700 uppercase">Exit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;