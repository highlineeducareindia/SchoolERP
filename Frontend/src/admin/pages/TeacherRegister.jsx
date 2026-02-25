import React from "react";
import {
  UserPlus,
  Briefcase,
  MapPin,
  GraduationCap,
  IndianRupee,
  Landmark,
  FileText,
  Key,
  ChevronLeft,
  Upload,
} from "lucide-react";
import LiquidButton from "../../components/LiquidButton";

const TeacherRegistration = () => {
  const [formData, setFormData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    const requiredFields = [
      "name", "email", "phone", "dob", "gender", 
      "designation", "joiningDate", "fullAddress"
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill the following required fields:\n- ${missingFields.join("\n- ")}`);
      setLoading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
      
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      const response = await fetch(`${apiUrl}/api/admin/create-teacher`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (result.success) {
        alert("Teacher Registered Successfully!");
        // Optional: Reset form or redirect
      } else {
        if (result.errors) {
          alert(result.message + ":\n" + result.errors.join("\n"));
        } else {
          alert(result.message || "Registration Failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Theme Variables
  const primaryBlue = "#3B82F6"; // The Admin Theme Color
  const inputBase = `w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#3B82F6] focus:bg-white transition font-bold text-gray-700 text-sm shadow-sm`;
  const labelBase =
    "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block";
  const sectionCard =
    "bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm";

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 md:px-8">
      {/* 1. Page Header */}
      <div className="max-w-6xl mx-auto border-b border-gray-200 pb-4 mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] uppercase tracking-tight flex items-center gap-3">
            <button className="p-2 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition">
              <ChevronLeft size={18} className="text-gray-400" />
            </button>
            Staff Onboarding
          </h1>
          <p className="text-gray-500 text-sm ml-12">
            Register a new teacher and set up professional credentials.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        {/* 2. Basic Information */}
        <section className={sectionCard}>
          <h2 className="flex items-center gap-2 font-bold mb-6 italic text-[#3B82F6]">
            <UserPlus size={20} /> Basic Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className={labelBase}>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                onChange={handleChange}
                className={inputBase}
                placeholder="EMP-2026-001"
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelBase}>Full Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                className={inputBase}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className={labelBase}>Aadhaar Number</label>
              <input
                type="text"
                name="aadhaar"
                onChange={handleChange}
                className={inputBase}
                placeholder="12 Digit No."
                pattern="[0-9]{12}"
              />
            </div>
            <div>
              <label className={labelBase}>Date of Birth</label>
              <input type="date" name="dob" onChange={handleChange} className={inputBase} required />
            </div>
            <div>
              <label className={labelBase}>Gender</label>
              <select name="gender" onChange={handleChange} className={inputBase}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelBase}>Blood Group</label>
              <input type="text" name="bloodGroup" onChange={handleChange} className={inputBase} placeholder="O+ve" />
            </div>
            <div>
              <label className={labelBase}>Marital Status</label>
              <select name="maritalStatus" onChange={handleChange} className={inputBase}>
                 <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>
          </div>
        </section>

        {/* 3. Professional & Educational (Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Professional Details */}
          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 font-bold mb-6 italic text-[#3B82F6]">
              <Briefcase size={20} /> Professional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelBase}>Designation</label>
                <input
                  type="text"
                  name="designation"
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="Teacher / PGT / TGT"
                />
              </div>
              <div>
                <label className={labelBase}>Subject Specialization</label>
                <input type="text" name="specialization" onChange={handleChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Joining Date</label>
                <input type="date" name="joiningDate" onChange={handleChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Employment Type</label>
                <select name="employmentType" onChange={handleChange} className={inputBase}>
                  <option value="">Select</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelBase}>Experience (Years)</label>
                <input type="number" name="experienceYears" onChange={handleChange} className={inputBase} />
              </div>
            </div>
          </section>

          {/* Educational Qualification */}
          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 font-bold mb-6 italic text-[#3B82F6]">
              <GraduationCap size={20} /> Educational Qualification
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelBase}>Highest Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="e.g. M.Sc B.Ed"
                />
              </div>
              <div>
                <label className={labelBase}>University / Institute</label>
                <input type="text" name="university" onChange={handleChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Passing Year</label>
                <input type="number" name="passingYear" onChange={handleChange} className={inputBase} />
              </div>
            </div>
          </section>
        </div>

        {/* 4. Contact & Residential */}
        <section className={sectionCard}>
          <h2 className="flex items-center gap-2 font-bold mb-6 italic text-[#3B82F6]">
            <MapPin size={20} /> Contact & Residential Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className={labelBase}>Mobile Number</label>
              <input type="tel" name="phone" onChange={handleChange} className={inputBase} required />
            </div>
            <div className="md:col-span-2">
              <label className={labelBase}>Email Address</label>
              <input type="email" name="email" onChange={handleChange} className={inputBase} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
              <label className={labelBase}>Full Address</label>
              <textarea
                rows="2"
                name="fullAddress"
                onChange={handleChange}
                className={`${inputBase} resize-none`}
                placeholder="House No, Street, Landmark..."
              ></textarea>
            </div>
            <div>
              <label className={labelBase}>City</label>
              <input type="text" name="city" onChange={handleChange} className={inputBase} />
            </div>
            <div>
              <label className={labelBase}>State</label>
              <input type="text" name="state" onChange={handleChange} className={inputBase} />
            </div>
            <div>
              <label className={labelBase}>Country</label>
              <input type="text" name="country" onChange={handleChange} className={inputBase} defaultValue="India" />
            </div>
            <div>
              <label className={labelBase}>Pincode</label>
              <input type="text" name="pincode" onChange={handleChange} className={inputBase} />
            </div>
          </div>
        </section>

        {/* 5. Salary & Bank Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 font-bold mb-6 italic text-[#3B82F6]">
              <IndianRupee size={20} /> Salary
            </h2>
            <label className={labelBase}>Basic Salary</label>
            <input type="number" name="salary" onChange={handleChange} className={inputBase} placeholder="₹ 0.00" />
            <p className="text-[10px] text-gray-400 mt-4 italic">
              Allowances & deductions can be set in Payroll module.
            </p>
          </section>

          <section className={`${sectionCard} lg:col-span-2`}>
            <h2 className="flex items-center gap-2 font-bold mb-6 italic text-[#3B82F6]">
              <Landmark size={20} /> Bank Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelBase}>Account Holder Name</label>
                <input type="text" name="accountHolder" onChange={handleChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Bank Name</label>
                <input type="text" name="bankName" onChange={handleChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Account Number</label>
                <input type="text" name="accountNumber" onChange={handleChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>IFSC Code</label>
                <input type="text" name="ifscCode" onChange={handleChange} className={inputBase} />
              </div>
            </div>
          </section>
        </div>

        {/* 6. Documents & ERP Access */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className={`${sectionCard} lg:col-span-2`}>
            <h2 className="flex items-center gap-2 font-bold mb-6 italic text-[#3B82F6]">
              <FileText size={20} /> Document Uploads
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Profile Photo", type: "image/*", name: "profilePhoto" },
                { label: "Aadhaar Card", type: ".pdf,image/*", name: "aadhaarCard" },
                { label: "Qualification", type: ".pdf,image/*", name: "qualification" },
                { label: "Experience", type: ".pdf,image/*", name: "experience" },
              ].map((doc, i) => (
                <div
                  key={i}
                  className="p-4 border-2 border-dashed border-gray-100 rounded-2xl text-center bg-gray-50 hover:bg-white transition cursor-pointer relative"
                >
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-2">
                    {doc.label}
                  </p>
                  <Upload size={14} className="mx-auto text-gray-600 mb-1" />
                  <span className="text-[9px] text-gray-600">
                    {formData[doc.name] ? "File Selected" : "Choose File"}
                  </span>

                  <input 
                    type="file" 
                    name={doc.name} 
                    accept={doc.type} 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                </div>
              ))}
            </div>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 font-bold mb-6 italic text-[#3B82F6]">
              <Key size={20} /> ERP Login
            </h2>
            <label className={labelBase}>Create Login Access?</label>
            <div className="flex gap-3">
              {["No", "Yes"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`flex-1 py-3 rounded-xl border font-bold text-xs transition ${opt === "No" ? "bg-gray-50 text-gray-400 border-gray-100" : "border-blue-100 bg-blue-50 text-blue-600"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-4 text-center">
              Login details will be sent to the teacher's email.
            </p>
          </section>
        </div>

        {/* 7. Action Button */}
        <div className="max-w-xs mx-auto pt-10">
          <LiquidButton
            type="submit"
            role="admin"
            label={loading ? "Registering..." : "Register Teacher"}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default TeacherRegistration;
