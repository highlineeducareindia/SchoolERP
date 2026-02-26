import React, { useEffect, useState } from "react";
import { 
  Search, 
  Eye, 
  User, 
  Users,
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  X,
  ChevronLeft,
  FileText,
  Download,
  GraduationCap
} from "lucide-react";
import apiClient from "../../api/api";

const ViewStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await apiClient.get("/api/admin/get-all-students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        // Handle different API response shapes
        const list = res.data.data || res.data.students || res.data.result || [];
        setStudents(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(stu => 
    (stu.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (stu.studentId || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 md:px-8 font-sans">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight flex items-center gap-3">
            Registered Students
          </h1>
          <p className="text-slate-500 text-sm font-medium">Total Enrolled: {students.length}</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or student ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition shadow-sm font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="max-w-7xl mx-auto bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-[2px]">
                <th className="px-8 py-5">Student</th>
                <th className="px-6 py-5">Admission No</th>
                <th className="px-6 py-5">Class/Section</th>
                <th className="px-6 py-5">Parent Contact</th>
                <th className="px-6 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-slate-400 font-bold animate-pulse">
                    Loading Database...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((stu) => (
                  <tr key={stu._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase overflow-hidden border border-blue-200">
                          {stu.studentPhoto 
                            ? <img src={stu.studentPhoto} alt="stu" className="w-full h-full object-cover" /> 
                            : <User size={18} />
                          }
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{stu.fullName}</p>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{stu.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">{stu.admissionNo}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[12px] font-black text-slate-600 uppercase tracking-tighter">
                        {stu.class} - {stu.section}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{stu.phone}</p>
                      <p className="text-xs text-slate-400">{stu.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openDetails(stu)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-md shadow-slate-200"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-slate-400 font-bold">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED VIEW MODAL */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 overflow-hidden">
                  {selectedStudent.studentPhoto 
                    ? <img src={selectedStudent.studentPhoto} alt="photo" className="w-full h-full object-cover" />
                    : <User size={28} />
                  }
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase leading-none">
                    {selectedStudent.fullName}
                  </h3>
                  <p className="text-sm text-slate-500 font-bold mt-1">
                    Enrollment ID: {selectedStudent.studentId}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Left Column — Info */}
                <div className="space-y-8">

                  {/* Academic Profile */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[2px] text-blue-500 mb-4 italic">
                      Academic Profile
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Class</span>
                        <span className="font-black text-slate-700 uppercase">{selectedStudent.class || "—"}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Section</span>
                        <span className="font-black text-slate-700 uppercase">{selectedStudent.section || "—"}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Admission No</span>
                        <span className="font-black text-slate-700">{selectedStudent.admissionNo || "—"}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Roll No</span>
                        <span className="font-black text-slate-700">{selectedStudent.rollNo || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[2px] text-blue-500 italic">
                      Personal Details
                    </h4>
                    <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                      <Calendar size={18} className="text-slate-300 shrink-0" />
                      DOB: {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString("en-IN") : "—"}
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                      <User size={18} className="text-slate-300 shrink-0" />
                      Gender: {selectedStudent.gender || "—"}
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                      <Users size={18} className="text-slate-300 shrink-0" />
                      Father: {selectedStudent.fatherName || "—"}
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                      <Users size={18} className="text-slate-300 shrink-0" />
                      Mother: {selectedStudent.motherName || "—"}
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                      <Phone size={18} className="text-slate-300 shrink-0" />
                      {selectedStudent.phone || "—"}
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                      <Mail size={18} className="text-slate-300 shrink-0" />
                      {selectedStudent.email || "—"}
                    </div>
                    <div className="flex items-start gap-4 text-slate-600 font-bold text-sm">
                      <MapPin size={18} className="text-slate-300 mt-0.5 shrink-0" />
                      <span>
                        {[
                          selectedStudent.address?.fullAddress,
                          selectedStudent.address?.city,
                          selectedStudent.address?.state,
                          selectedStudent.address?.pincode,
                        ].filter(Boolean).join(", ") || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column — Documents + ID Card */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[2px] text-blue-500 italic">
                    Uploaded Documents
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      { key: "studentPhoto",      label: "Student Photo" },
                      { key: "birthCertificate",  label: "Birth Certificate" },
                    ].map((doc) => (
                      <div
                        key={doc.key}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText size={20} />
                          </div>
                          <span className="text-sm font-black text-slate-700 uppercase tracking-tighter">
                            {doc.label}
                          </span>
                        </div>
                        {selectedStudent[doc.key] ? (
                          <a 
                            href={selectedStudent[doc.key]} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <Download size={16} />
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 uppercase">Not Provided</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ID Card Preview */}
                  <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-blue-100">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black tracking-widest opacity-60 uppercase mb-4">
                        Official Student ID
                      </p>
                      <p className="text-2xl font-black italic mb-1 uppercase tracking-tighter">
                        {selectedStudent.fullName}
                      </p>
                      <p className="font-mono text-sm opacity-80">{selectedStudent.studentId}</p>
                      {selectedStudent.class && (
                        <p className="text-xs opacity-60 mt-1 uppercase tracking-widest font-bold">
                          Class {selectedStudent.class} — {selectedStudent.section}
                        </p>
                      )}
                    </div>
                    <GraduationCap className="absolute right-[-20px] bottom-[-20px] opacity-10 w-32 h-32" />
                  </div>
                </div>

              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 bg-slate-200 text-slate-700 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-300 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-8 py-3 bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Print Profile
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudent;