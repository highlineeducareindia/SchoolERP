import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import apiClient from "../../api/api";
import {
  FaSchool,
  FaUserShield,
  FaMapMarkerAlt,
  FaCogs,
  FaRocket,
  FaPalette,
} from "react-icons/fa";
import LiquidButton from "../../components/LiquidButton";

const SchoolRegistration = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolCode: "",
    phone: "",
    altPhone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    district: "",
    country: "India",
    pincode: "",
    sessionType: "Apr-March",
    sessionYear: "2026-27",
    classes: [],
    boards: [],
    adminName: "",
    adminEmail: "",
    adminMobile: "",
    plan: "",
    modules: [],
    primaryColor: "#1E3A8A",
    secondaryColor: "#7C3AED",
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await apiClient.get("/api/superadmin/get-plans");
        if (res.data.success) {
          setPlans(res.data.plans);
          if (res.data.plans.length > 0) {
            setFormData(prev => ({ ...prev, plan: res.data.plans[0]._id }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch plans", error);
      }
    };
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        toast.error("Company ID not found. Please login again.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("companyId", companyId);
      formDataToSend.append("schoolname", formData.schoolName);
      formDataToSend.append("email", formData.adminEmail);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", JSON.stringify({
        street: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode
      }));
      formDataToSend.append("max_class", formData.classes.length > 0 ? 12 : 12);
      formDataToSend.append("session_type", formData.sessionType === "Apr-March" ? "Annual" : "Semester");
      formDataToSend.append("session", formData.sessionYear);
      formDataToSend.append("plan_id", formData.plan);
      
      formDataToSend.append("udise_code", formData.schoolCode);
      formDataToSend.append("alternate_phone", formData.altPhone);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("classes", JSON.stringify(formData.classes));
      formDataToSend.append("boards", JSON.stringify(formData.boards));
      formDataToSend.append("admin_name", formData.adminName);
      formDataToSend.append("admin_mobile", formData.adminMobile);
      formDataToSend.append("modules", JSON.stringify(formData.modules));
      formDataToSend.append("primary_color", formData.primaryColor);
      formDataToSend.append("secondary_color", formData.secondaryColor);
      
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      }

      const res = await apiClient.post("/api/superadmin/create-school", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (res.data.success) {
        toast.success(res.data.message || "School created successfully!");
      } else {
        toast.error(res.data.message || "Failed to create school");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create school");
    }
  };

  const classesList = [
    "Nursery",
    "LKG",
    "UKG",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
  ];
  const boardsList = ["CBSE", "ICSE", "State Board"];
  const modulesList = [
    "Library",
    "Transport",
    "Hostel",
    "HR & Payroll",
    "Online Payment",
    "Inventory",
    "Examination",
  ];

  const handleCheckbox = (listName, value) => {
    const updatedList = formData[listName].includes(value)
      ? formData[listName].filter((item) => item !== value)
      : [...formData[listName], value];
    setFormData({ ...formData, [listName]: updatedList });
  };
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      logo: file,
      logoPreview: URL.createObjectURL(file),
    });
  };
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 bg-[#F5F7FB]">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-[#1E293B] uppercase tracking-tight">
          Onboard New School
        </h1>
        <p className="text-gray-500 text-sm">
          Register institution and configure system settings.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* 1. Basic Details */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="flex items-center gap-2 text-[#7C3AED] font-bold mb-6 italic">
            <FaSchool /> School Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="School Name"
              placeholder="e.g. St. Xavier's School"
              onChange={(v) => setFormData({ ...formData, schoolName: v })}
            />
            <InputField
              label="UDISE / School Code"
              placeholder="CODE1234"
              onChange={(v) => setFormData({ ...formData, schoolCode: v })}
            />
            <InputField
              label="Phone Number"
              type="tel"
              placeholder="+91..."
              onChange={(v) => setFormData({ ...formData, phone: v })}
            />
            <InputField
              label="Alternate Phone (Optional)"
              type="tel"
              onChange={(v) => setFormData({ ...formData, altPhone: v })}
            />
            <InputField
              label="Website URL (Optional)"
              type="url"
              placeholder="https://..."
              onChange={(v) => setFormData({ ...formData, website: v })}
            />
          </div>
        </section>

        {/* 2. Address Details */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="flex items-center gap-2 text-[#7C3AED] font-bold mb-6 italic">
            <FaMapMarkerAlt /> Location Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <InputField
                label="Full Address"
                placeholder="Street, Landmark..."
                onChange={(v) => setFormData({ ...formData, address: v })}
              />
            </div>
            <InputField
              label="City"
              onChange={(v) => setFormData({ ...formData, city: v })}
            />
            <InputField
              label="District"
              onChange={(v) => setFormData({ ...formData, district: v })}
            />
            <InputField
              label="State"
              onChange={(v) => setFormData({ ...formData, state: v })}
            />
            <InputField
              label="Pincode"
              onChange={(v) => setFormData({ ...formData, pincode: v })}
            />
          </div>
        </section>

        {/* 3. Academic Configuration */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="flex items-center gap-2 text-[#7C3AED] font-bold mb-6 italic">
            <FaCogs /> Academic Setup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="text-xs font-black uppercase text-gray-400 mb-3 block">
                Session Type
              </label>
              <div className="flex gap-4">
                {["Apr-March", "Jan-Dec"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, sessionType: type })
                    }
                    className={`flex-1 py-3 rounded-xl border-2 font-bold transition ${formData.sessionType === type ? "border-[#7C3AED] bg-purple-50 text-[#7C3AED]" : "border-gray-100 text-gray-400"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <InputField
              label="Academic Year"
              placeholder="2026-2027"
              onChange={(v) => setFormData({ ...formData, sessionYear: v })}
            />
          </div>

          <div className="mt-8">
            <label className="text-xs font-black uppercase text-gray-400 mb-3 block">
              Boards Supported
            </label>
            <div className="flex flex-wrap gap-3">
              {boardsList.map((board) => (
                <CheckBadge
                  key={board}
                  label={board}
                  active={formData.boards.includes(board)}
                  onClick={() => handleCheckbox("boards", board)}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <label className="text-xs font-black uppercase text-gray-400 mb-3 block">
              Classes (Nursery to 12th)
            </label>
            <div className="grid grid-cols-3 md:grid-cols-8 gap-2">
              {classesList.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => handleCheckbox("classes", cls)}
                  className={`py-2 text-[10px] font-black rounded-lg border transition ${formData.classes.includes(cls) ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-gray-50 text-gray-500 border-gray-200"}`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Admin & Plan Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="flex items-center gap-2 text-[#7C3AED] font-bold mb-6 italic">
              <FaUserShield /> School Admin & Plan
            </h2>
            <div className="space-y-4">
              <InputField
                label="Admin Name"
                placeholder="Full Name"
                onChange={(v) => setFormData({ ...formData, adminName: v })}
              />
              <InputField
                label="Admin Email"
                type="email"
                placeholder="admin@school.com"
                onChange={(v) => setFormData({ ...formData, adminEmail: v })}
              />
              <InputField
                label="Admin Mobile"
                type="tel"
                onChange={(v) => setFormData({ ...formData, adminMobile: v })}
              />
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                  Select Plan
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#7C3AED] focus:bg-white transition font-bold text-gray-700 text-sm shadow-sm"
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                >
                  {plans.map(p => (
                    <option key={p._id} value={p._id}>{p.name} - ₹{p.MonthlyPrice}/mo</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="flex items-center gap-2 text-[#7C3AED] font-bold mb-6 italic">
              <FaPalette /> Branding & Theme
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={formData.primaryColor}
                  className="w-full h-12 rounded-lg cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={formData.secondaryColor}
                  className="w-full h-12 rounded-lg cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formData, secondaryColor: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-gray-200 text-center">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">
                Upload School Logo
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="text-xs"
              />

              {formData.logoPreview && (
                <img
                  src={formData.logoPreview}
                  alt="Logo Preview"
                  className="mx-auto mt-4 h-24 object-contain border rounded-xl p-2"
                />
              )}
            </div>
          </section>
        </div>

        {/* 5. Modules Selection */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="flex items-center gap-2 text-[#7C3AED] font-bold mb-6 italic">
            <FaRocket /> Features & Modules
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modulesList.map((mod) => (
              <label
                key={mod}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-purple-50 transition group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#7C3AED]"
                  onChange={() => handleCheckbox("modules", mod)}
                />
                <span className="text-sm font-bold text-gray-600 group-hover:text-[#7C3AED]">
                  {mod}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Submit Button */}
        <div className="max-w-xs mx-auto pt-4">
          <LiquidButton label="Register & Setup School" role="superadmin" type="submit" />
        </div>
      </form>
    </div>
  );
};

// Reusable Sub-Components
const InputField = ({ label, type = "text", placeholder, onChange }) => (
  <div>
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#7C3AED] focus:bg-white transition font-bold text-gray-700 text-sm shadow-sm"
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const CheckBadge = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-black border transition ${active ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-white text-gray-400 border-gray-200 hover:border-[#7C3AED]"}`}
  >
    {active ? `✓ ${label}` : label}
  </button>
);

export default SchoolRegistration;
