import React from "react";
import { useLocation } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  MapPin, 
  FileText, 
  Truck, 
  Upload,
  ChevronLeft
} from "lucide-react";
import LiquidButton from "../../components/LiquidButton";
import apiClient from "../../api/api";

const StudentRegistration = () => {
  const [formData, setFormData] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const location = useLocation();
  const token = localStorage.getItem("token");
  
  // Theme Detection (Keeping your logic)
  const isSchool = !location.pathname.includes("teacher");
  const themeAccent = isSchool ? "#3B82F6" : "#10B981"; // Blue or Emerald
  const themeBgLight = isSchool ? "bg-blue-50" : "bg-emerald-50";

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTransportChange = (val) => {
    setFormData({ ...formData, transportRequired: val });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "address") {
        data.append("address", JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    const res = await apiClient.post(
      "/api/admin/register-student",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.success) {
      alert("Student Registered Successfully ✅");
      setFormData({});
    } else {
      alert(res.data.message || "Registration Failed");
    }

  } catch (err) {
    console.error(err);

    if (err.response?.data?.message) {
      alert(err.response.data.message);
    } else {
      alert("Server Error");
    }

  } finally {
    setLoading(false);
  }
};
  const inputBase = `w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[${themeAccent}] focus:bg-white transition font-bold text-gray-700 text-sm shadow-sm`;
  const labelBase = "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block";
  const sectionCard = "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm";

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 md:px-8">
      
      {/* 1. Header Section (Matching School UI) */}
      <div className="max-w-6xl mx-auto border-b border-gray-200 pb-4 mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] uppercase tracking-tight flex items-center gap-3">
            Student Enrollment
          </h1>
          <p className="text-gray-500 text-sm ">
            Register new students and assign academic batches.
          </p>
        </div>
      </div>

      <form className="max-w-6xl mx-auto space-y-8" onSubmit={handleSubmit}>
        
        {/* 2. Academic Section */}
        <section className={sectionCard}>
          <h2 className={`flex items-center gap-2 font-bold mb-6 italic`} style={{ color: themeAccent }}>
            <GraduationCap size={20} /> Academic Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label className={labelBase}>Admission No.</label>
              <input 
                type="text" 
                name="admissionNo" 
                className={inputBase} 
                placeholder="ADM-2026-001" 
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className={labelBase}>Class</label>
              <select name="class" className={inputBase} onChange={handleChange} required>
                <option value="">Select Class</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div>
              <label className={labelBase}>Section</label>
              <select name="section" className={inputBase} onChange={handleChange} required>
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div>
              <label className={labelBase}>Admission Date</label>
              <input 
                type="date" 
                name="admissionDate" 
                className={inputBase} 
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        {/* 3. Personal Information */}
        <section className={sectionCard}>
          <h2 className="flex items-center gap-2 font-bold mb-6 italic" style={{ color: themeAccent }}>
            <Users size={20} /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className={labelBase}>Student Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                className={inputBase} 
                placeholder="e.g. Rahul Sharma" 
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className={labelBase}>Date of Birth</label>
              <input 
                type="date" 
                name="dob" 
                className={inputBase} 
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className={labelBase}>Gender</label>
              <div className="flex gap-3">
                {["Male", "Female", "Other"].map((g) => (
                  <button 
                    key={g} 
                    type="button" 
                    className={`flex-1 py-3 rounded-xl border font-bold text-xs transition ${formData.gender === g ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white'}`}
                    onClick={() => setFormData({ ...formData, gender: g })}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelBase}>Blood Group</label>
              <input 
                type="text" 
                name="bloodGroup" 
                className={inputBase} 
                placeholder="O+ve" 
                onChange={handleChange}
              />
            </div>
            <div>
              <label className={labelBase}>Aadhar Number</label>
              <input 
                type="text" 
                name="aadhar" 
                className={inputBase} 
                placeholder="0000 0000 0000" 
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* 4. Contact & Address (Split Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 font-bold mb-6 italic" style={{ color: themeAccent }}>
              <FileText size={20} /> Parent / Guardian
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelBase}>Father's Name</label>
                <input 
                  type="text" 
                  name="fatherName" 
                  className={inputBase} 
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className={labelBase}>Mother's Name</label>
                <input 
                  type="text" 
                  name="motherName" 
                  className={inputBase} 
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className={inputBase} 
                    placeholder="+91" 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className={labelBase}>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    className={inputBase} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 font-bold mb-6 italic" style={{ color: themeAccent }}>
              <MapPin size={20} /> Residential Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelBase}>Full Address</label>
                <textarea 
                  name="address.fullAddress" 
                  rows="1" 
                  className={`${inputBase} resize-none`} 
                  placeholder="House No, Street..." 
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>City</label>
                  <input 
                    type="text" 
                    name="address.city" 
                    className={inputBase} 
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className={labelBase}>Pincode</label>
                  <input 
                    type="text" 
                    name="address.pincode" 
                    className={inputBase} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className={labelBase}>State</label>
                <input 
                  type="text" 
                  name="address.state" 
                  className={inputBase} 
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        </div>

        {/* 5. Documents & Transport */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className={`${sectionCard} lg:col-span-2`}>
            <h2 className="flex items-center gap-2 font-bold mb-6 italic" style={{ color: themeAccent }}>
              <Upload size={20} /> Documents Upload
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl text-center bg-gray-50 hover:bg-white transition cursor-pointer group">
                <p className={labelBase}>Student Photo</p>
                <input 
                  type="file" 
                  name="studentPhoto"
                  className="text-[10px] w-full" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl text-center bg-gray-50 hover:bg-white transition cursor-pointer group">
                <p className={labelBase}>Birth Certificate</p>
                <input 
                  type="file" 
                  name="birthCertificate"
                  className="text-[10px] w-full" 
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 font-bold mb-6 italic " style={{ color: themeAccent }}>
              <Truck size={20} /> Transport
            </h2>
            <label className={labelBase}>Require Bus Facility?</label>
            <div className="flex gap-3">
                {["No", "Yes"].map((opt) => (
                  <button 
                    key={opt} 
                    type="button" 
                    onClick={() => handleTransportChange(opt === "Yes")}
                    className={`flex-1 py-3 rounded-xl border font-bold text-xs transition ${formData.transportRequired === (opt === "Yes") ? 'border-blue-100 bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                  >
                    {opt}
                  </button>
                ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-4 text-center italic">Routes will be assigned post-registration.</p>
          </section>
        </div>

        {/* 6. Submit Button (Matching School Registration Style) */}
        <div className="max-w-xs mx-auto pt-10">
           <LiquidButton
             type="submit" 
             role="admin"
             label={loading ? "Registering..." : "Register Student"}
             disabled={loading}
           />
        </div>

      </form>
    </div>
  );
};

export default StudentRegistration;