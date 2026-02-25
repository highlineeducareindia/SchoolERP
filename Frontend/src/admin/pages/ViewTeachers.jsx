import React, { useEffect, useState } from "react";
import { 
  Search, 
  Eye, 
  User, 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  X,
  ChevronLeft,
  FileText,
  Landmark,
  IndianRupee,
  Download,
  GraduationCap
} from "lucide-react";
import apiClient from "../../api/api";

const ViewTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/admin/get-all-teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setTeachers(result.data);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={14} className="text-blue-500" />}
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-bold text-gray-700">{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 md:px-8 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight flex items-center gap-3">
            Faculty Directory
          </h1>
          <p className="text-slate-500 text-sm  font-medium">Manage and view all registered teaching staff.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or Employee ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition shadow-sm font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Teacher Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-[2px]">
                <th className="px-8 py-5">Teacher Profile</th>
                <th className="px-6 py-5">Designation</th>
                <th className="px-6 py-5">Specialization</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-20 text-slate-400 font-bold animate-pulse">Accessing Staff Records...</td></tr>
              ) : filteredTeachers.length > 0 ? (
                filteredTeachers.map((t) => (
                  <tr key={t._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 overflow-hidden">
                          {t.profilePhoto ? <img src={t.profilePhoto} className="w-full h-full object-cover" alt="" /> : <User size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{t.name}</p>
                          <p className="text-[11px] text-slate-400 font-black uppercase">{t.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-bold text-slate-600">{t.designation}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black uppercase">
                        {t.specialization || "General"}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase">Active</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => openDetails(t)}
                        className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-95"
                      >
                        <Eye size={14} className="inline mr-2" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-20 text-slate-400 font-bold">No teachers registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TEACHER DETAILS MODAL */}
      {isModalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[35px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                     <User size={32} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">{selectedTeacher.name}</h3>
                    <p className="text-blue-400 text-xs font-black uppercase tracking-[3px]">{selectedTeacher.employeeId} • {selectedTeacher.designation}</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                 <X size={24} />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Personal & Contact */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><User size={14}/> Basic Information</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <DetailItem label="Email Address" value={selectedTeacher.email} icon={Mail} />
                    <DetailItem label="Phone Number" value={selectedTeacher.phone} icon={Phone} />
                    <DetailItem label="Date of Birth" value={selectedTeacher.dob} icon={Calendar} />
                    <DetailItem label="Gender" value={selectedTeacher.gender} />
                    <DetailItem label="Marital Status" value={selectedTeacher.maritalStatus} />
                  </div>
                </div>

                {/* 2. Professional & Education */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Briefcase size={14}/> Professional Profile</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <DetailItem label="Joining Date" value={selectedTeacher.joiningDate} icon={Calendar} />
                    <DetailItem label="Employment Type" value={selectedTeacher.employmentType} />
                    <DetailItem label="Specialization" value={selectedTeacher.specialization} />
                    <DetailItem label="Qualification" value={selectedTeacher.qualification} icon={GraduationCap} />
                    <DetailItem label="Experience" value={`${selectedTeacher.experienceYears} Years`} />
                  </div>
                </div>

                {/* 3. Address & Bank */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Landmark size={14}/> Address & Banking</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <DetailItem label="Residential Address" value={selectedTeacher.fullAddress} icon={MapPin} />
                    <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-100 relative overflow-hidden">
                       <Landmark className="absolute right-[-10px] bottom-[-10px] opacity-10 w-20 h-20" />
                       <p className="text-[9px] font-black uppercase opacity-60 mb-3 tracking-widest">Payroll Account</p>
                       <p className="text-xs font-bold mb-1">{selectedTeacher.bankName || "HDFC Bank"}</p>
                       <p className="text-lg font-black tracking-tighter mb-4">{selectedTeacher.accountNumber || "XXXX XXXX 1234"}</p>
                       <div className="flex justify-between items-center opacity-80 text-[10px] font-bold">
                          <span>IFSC: {selectedTeacher.ifscCode}</span>
                          <span>₹ {selectedTeacher.salary} / mo</span>
                       </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Document Section */}
              <div className="mt-10 pt-10 border-t border-gray-200">
                <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-6 italic">Verification Documents</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["aadhaarCard", "qualification", "experience"].map((doc) => (
                    <div key={doc} className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-500 transition-all flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <FileText size={18} />
                          </div>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                            {doc.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                       </div>
                       {selectedTeacher[doc] ? (
                          <a href={selectedTeacher[doc]} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Download size={16} />
                          </a>
                       ) : <span className="text-[8px] font-bold text-gray-300 uppercase">Empty</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
               <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-gray-100 text-gray-500 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all">
                 Close Window
               </button>
               <button className="px-8 py-3 bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                 Edit Teacher
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTeacher;