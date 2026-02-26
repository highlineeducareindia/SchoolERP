import React from "react";
import {
  Users, Eye, X, UserCircle, Briefcase, GraduationCap,
  MapPin, IndianRupee, Landmark, Phone, Mail, Calendar,
  FileText, Key, Search, Download, Building,
} from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
const getToken = () => localStorage.getItem("token");

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ text, color = "blue" }) => {
  const map = {
    blue:   "bg-blue-50 text-blue-600 border-blue-100",
    green:  "bg-green-50 text-green-600 border-green-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    gray:   "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest border rounded-full px-2.5 py-0.5 ${map[color] || map.gray}`}>
      {text || "—"}
    </span>
  );
};

const empColor = (t) =>
  t === "Full Time" ? "green" : t === "Part Time" ? "yellow" : "gray";

// ─── InfoRow ──────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-start gap-4 py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 shrink-0 w-36">
      {label}
    </span>
    <span className={`text-sm font-bold text-right break-all leading-snug ${highlight ? "text-[#3B82F6]" : "text-gray-700"}`}>
      {value ?? <span className="text-gray-300 font-normal italic text-xs">Not provided</span>}
    </span>
  </div>
);

// ─── Modal Section Card ───────────────────────────────────────────────────────
const ModalSection = ({ icon: Icon, title, children }) => (
  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
    <h3 className="flex items-center gap-2 text-[#3B82F6] font-black italic text-[10px] uppercase tracking-widest mb-3">
      <Icon size={13} /> {title}
    </h3>
    {children}
  </div>
);

// ─── Document Card ────────────────────────────────────────────────────────────
const DocCard = ({ label, path }) => {
  if (!path) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl text-center opacity-40 min-h-[100px]">
        <FileText size={18} className="text-gray-400 mb-1" />
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</p>
        <p className="text-[9px] text-gray-400 mt-0.5">Not uploaded</p>
      </div>
    );
  }

  const fullUrl = `${apiUrl}/${path}`;
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(path);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      {isImage ? (
        <a href={fullUrl} target="_blank" rel="noreferrer" className="block overflow-hidden">
          <img
            src={fullUrl}
            alt={label}
            className="w-full h-[90px] object-cover hover:scale-105 transition duration-300"
          />
        </a>
      ) : (
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center h-[90px] bg-blue-50 hover:bg-blue-100 transition"
        >
          <div className="text-center">
            <FileText size={22} className="text-blue-400 mx-auto mb-1" />
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-wider">Open PDF</p>
          </div>
        </a>
      )}
      <div className="px-3 py-2 flex items-center justify-between bg-white border-t border-gray-100">
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 truncate">{label}</p>
        <a href={fullUrl} download className="text-[#3B82F6] hover:text-blue-800 ml-2 shrink-0">
          <Download size={11} />
        </a>
      </div>
    </div>
  );
};

// ─── Center Modal ──────────────────────────────────────────────────────────────
const TeacherModal = ({ teacher, onClose }) => {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!teacher) return null;
  const photoUrl = teacher.profilePhoto ? `${apiUrl}/${teacher.profilePhoto}` : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={teacher.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30">
                <UserCircle size={30} className="text-white" />
              </div>
            )}
            <div>
              <p className="text-white font-black text-xl leading-tight">{teacher.name}</p>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-0.5">
                {teacher.designation || "Staff"}
                {teacher.employeeId && (
                  <span className="ml-2 opacity-60">· {teacher.employeeId}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {teacher.employmentType && (
                  <span className="bg-white/20 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/30">
                    {teacher.employmentType}
                  </span>
                )}
                {teacher.specialization && (
                  <span className="bg-white/20 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/30">
                    {teacher.specialization}
                  </span>
                )}
                {teacher.gender && (
                  <span className="bg-white/20 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/30">
                    {teacher.gender}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition border border-white/30 shrink-0"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* ── Quick Stats Bar ── */}
        <div className="grid grid-cols-4 border-b border-gray-100 bg-white shrink-0">
          {[
            { icon: Phone,       label: "Mobile",       value: teacher.phone },
            { icon: Mail,        label: "Email",        value: teacher.email,   small: true },
            { icon: Calendar,    label: "Joining Date", value: teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : null },
            { icon: IndianRupee, label: "Basic Salary", value: teacher.salary ? `₹ ${Number(teacher.salary).toLocaleString("en-IN")}` : null },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-3 px-2 border-r last:border-0 border-gray-100 text-center">
              <s.icon size={13} className="text-[#3B82F6] mb-1" />
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
              <p className={`font-black text-[#1E293B] mt-0.5 w-full px-1 truncate ${s.small ? "text-[10px]" : "text-xs"}`}>
                {s.value || "—"}
              </p>
            </div>
          ))}
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4 bg-[#F5F7FB]">

          {/* Row 1 — Basic + Professional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModalSection icon={UserCircle} title="Basic Details">
              <InfoRow label="Full Name"      value={teacher.name} />
              <InfoRow label="Employee ID"    value={teacher.employeeId} />
              <InfoRow label="Date of Birth"  value={teacher.dob ? new Date(teacher.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : null} />
              <InfoRow label="Gender"         value={teacher.gender} />
              <InfoRow label="Blood Group"    value={teacher.bloodGroup} />
              <InfoRow label="Marital Status" value={teacher.maritalStatus} />
              <InfoRow label="Aadhaar No."    value={teacher.aadhaar ? `XXXX XXXX ${String(teacher.aadhaar).slice(-4)}` : null} />
            </ModalSection>

            <ModalSection icon={Briefcase} title="Professional Details">
              <InfoRow label="Designation"      value={teacher.designation} />
              <InfoRow label="Specialization"   value={teacher.specialization} />
              <InfoRow label="Joining Date"     value={teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : null} />
              <InfoRow label="Employment Type"  value={teacher.employmentType} />
              <InfoRow label="Experience"       value={teacher.experienceYears ? `${teacher.experienceYears} Years` : null} />
            </ModalSection>
          </div>

          {/* Row 2 — Education + Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModalSection icon={GraduationCap} title="Educational Qualification">
              <InfoRow label="Qualification"    value={teacher.qualification} />
              <InfoRow label="University"       value={teacher.university} />
              <InfoRow label="Passing Year"     value={teacher.passingYear} />
            </ModalSection>

            <ModalSection icon={Phone} title="Contact Details">
              <InfoRow label="Mobile"  value={teacher.phone}  highlight />
              <InfoRow label="Email"   value={teacher.email}  highlight />
            </ModalSection>
          </div>

          {/* Row 3 — Address */}
          <ModalSection icon={Building} title="Residential Address">
            <InfoRow label="Full Address" value={teacher.fullAddress} />
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <InfoRow label="City"     value={teacher.city} />
              <InfoRow label="State"    value={teacher.state} />
              <InfoRow label="Country"  value={teacher.country} />
              <InfoRow label="Pincode"  value={teacher.pincode} />
            </div>
          </ModalSection>

          {/* Row 4 — Salary + Bank */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModalSection icon={IndianRupee} title="Salary">
              <InfoRow
                label="Basic Salary"
                value={teacher.salary ? `₹ ${Number(teacher.salary).toLocaleString("en-IN")}` : null}
                highlight
              />
              <p className="text-[9px] text-gray-400 italic mt-3 text-center">
                Allowances &amp; deductions in Payroll module.
              </p>
            </ModalSection>

            <div className="md:col-span-2">
              <ModalSection icon={Landmark} title="Bank Details">
                <InfoRow label="Account Holder" value={teacher.accountHolder} />
                <InfoRow label="Bank Name"      value={teacher.bankName} />
                <InfoRow label="Account No."    value={teacher.accountNumber ? `XXXXXXXX${String(teacher.accountNumber).slice(-4)}` : null} />
                <InfoRow label="IFSC Code"      value={teacher.ifscCode} />
              </ModalSection>
            </div>
          </div>

          {/* Row 5 — Documents */}
          <ModalSection icon={FileText} title="Uploaded Documents">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
              <DocCard label="Profile Photo"    path={teacher.profilePhoto} />
              <DocCard label="Aadhaar Card"     path={teacher.aadhaarCard} />
              <DocCard label="Qualification"    path={teacher.qualificationDoc || teacher.qualification_doc} />
              <DocCard label="Experience Cert." path={teacher.experience} />
            </div>
          </ModalSection>

          {/* Row 6 — ERP Access */}
          <ModalSection icon={Key} title="ERP Login Access">
            <InfoRow
              label="Login Access"
              value={
                teacher.erpAccess === true || teacher.erpAccess === "Yes"
                  ? "✓ Enabled"
                  : "✗ Not Enabled"
              }
              highlight={teacher.erpAccess === true || teacher.erpAccess === "Yes"}
            />
            {teacher.erpEmail && <InfoRow label="ERP Email" value={teacher.erpEmail} />}
          </ModalSection>

        </div>

        {/* ── Footer ── */}
        <div className="border-t border-gray-100 px-6 py-4 bg-white flex items-center justify-between shrink-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            ID: {teacher._id || "N/A"}
          </p>
          <button
            onClick={onClose}
            className="bg-[#3B82F6] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition shadow-sm shadow-blue-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const ViewTeachers = () => {
  const [teachers, setTeachers]     = React.useState([]);
  const [loading, setLoading]       = React.useState(true);
  const [error, setError]           = React.useState("");
  const [search, setSearch]         = React.useState("");
  const [filterType, setFilterType] = React.useState("");
  const [selected, setSelected]     = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${apiUrl}/api/admin/get-all-teachers`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (data.success) {
          setTeachers(data.teachers || data.data || []);
        } else {
          setError(data.message || "Failed to fetch teachers");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = teachers.filter((t) => {
    const q = search.toLowerCase();
    return (
      (!q ||
        t.name?.toLowerCase().includes(q) ||
        t.employeeId?.toLowerCase().includes(q) ||
        t.designation?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q) ||
        t.phone?.includes(q) ||
        t.specialization?.toLowerCase().includes(q)) &&
      (!filterType || t.employmentType === filterType)
    );
  });

  const inputBase =
    "bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#3B82F6] focus:bg-white transition font-bold text-gray-700 text-sm shadow-sm";

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 md:px-8">

      {/* Header */}
      <div className="max-w-7xl mx-auto border-b border-gray-200 pb-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] uppercase tracking-tight flex items-center gap-3">
            <Users size={22} className="text-[#3B82F6]" /> Staff Directory
          </h1>
          <p className="text-gray-500 text-sm">
            View all registered teaching staff and their complete details.
          </p>
        </div>
        <div className="text-sm font-black text-[#3B82F6] bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 self-start sm:self-auto">
          {teachers.length} Teachers Registered
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, employee ID, email, phone, designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputBase} pl-9 w-full`}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={inputBase}
        >
          <option value="">All Employment Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <div className="w-9 h-9 border-4 border-blue-100 border-t-[#3B82F6] rounded-full animate-spin" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Staff...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-500 font-bold text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Users size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 font-bold">
              {teachers.length === 0 ? "No teachers registered yet." : "No results match your search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["#", "Employee", "Designation", "Contact", "Joining Date", "Type", "Salary", "Action"].map((h) => (
                    <th
                      key={h}
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3 text-left whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, idx) => {
                  const photo = t.profilePhoto ? `${apiUrl}/${t.profilePhoto}` : null;
                  return (
                    <tr
                      key={t._id || idx}
                      className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* # */}
                      <td className="px-4 py-3 text-xs font-black text-gray-300">
                        {String(idx + 1).padStart(2, "0")}
                      </td>

                      {/* Employee */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {photo ? (
                            <img
                              src={photo}
                              alt={t.name}
                              className="w-9 h-9 rounded-xl object-cover border border-gray-100 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                              <UserCircle size={18} className="text-blue-300" />
                            </div>
                          )}
                          <div>
                            <p className="font-black text-[#1E293B] whitespace-nowrap">{t.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{t.employeeId || "No ID"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Designation */}
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-700 whitespace-nowrap text-xs">{t.designation || "—"}</p>
                        <p className="text-[10px] text-gray-400">{t.specialization || ""}</p>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                          <Phone size={10} className="text-gray-400 shrink-0" /> {t.phone || "—"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                          <Mail size={10} className="shrink-0" />
                          <span className="truncate max-w-[160px]">{t.email || "—"}</span>
                        </div>
                      </td>

                      {/* Joining */}
                      <td className="px-4 py-3 text-xs font-bold text-gray-600 whitespace-nowrap">
                        {t.joiningDate
                          ? new Date(t.joiningDate).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <Badge text={t.employmentType} color={empColor(t.employmentType)} />
                      </td>

                      {/* Salary */}
                      <td className="px-4 py-3 text-xs font-black text-gray-700 whitespace-nowrap">
                        {t.salary ? `₹ ${Number(t.salary).toLocaleString("en-IN")}` : "—"}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(t)}
                          className="flex items-center gap-1.5 bg-[#3B82F6] hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-lg transition shadow-sm shadow-blue-100 group-hover:scale-105"
                        >
                          <Eye size={12} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {!loading && !error && filtered.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Showing {filtered.length} of {teachers.length} teachers
            </p>
            {filterType && (
              <button
                onClick={() => setFilterType("")}
                className="text-[10px] font-black text-blue-500 hover:underline uppercase tracking-widest"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Center Modal ── */}
      {selected && (
        <TeacherModal teacher={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default ViewTeachers;