import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import {
  FaBuilding,
  FaUserTie,
  FaMapMarkerAlt,
  FaGlobe,
  FaFileUpload,
  FaArrowRight,
} from "react-icons/fa";
import LiquidButton from "../../components/LiquidButton";

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    country: null,
    state: null,
    city: null,
    pincode: "",
    contact: "",
    personName: "",
    personEmail: "",
    position: "",
    mob: "",
    companyEmail: "",
    companyMobile: "",
    planId: "Basic",
    certificate: null,
  });

  const [options, setOptions] = useState({
    countries: [],
    states: [],
    cities: [],
  });

  // Load Countries
  useEffect(() => {
    const countryData = Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: `${c.flag} ${c.name}`,
      name: c.name,
    }));
    setOptions((prev) => ({ ...prev, countries: countryData }));
  }, []);

  const handleCountryChange = (selected) => {
    const stateData = State.getStatesOfCountry(selected.value).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
    setFormData({ ...formData, country: selected, state: null, city: null });
    setOptions((prev) => ({ ...prev, states: stateData, cities: [] }));
  };

  const handleStateChange = (selected) => {
    const cityData = City.getCitiesOfState(
      formData.country.value,
      selected.value,
    ).map((ct) => ({
      value: ct.name,
      label: ct.name,
    }));
    setFormData({ ...formData, state: selected, city: null });
    setOptions((prev) => ({ ...prev, cities: cityData }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sendData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (
          typeof formData[key] === "object" &&
          formData[key] !== null &&
          key !== "certificate"
        ) {
          sendData.append(key, JSON.stringify(formData[key]));
        } else {
          sendData.append(key, formData[key]);
        }
      });

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${apiUrl}/api/company/register`, sendData);
      alert("Company Registered Successfully!");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "5px",
      borderRadius: "0.75rem",
      border: "1px solid #E5E7EB",
      backgroundColor: "#F9FAFB",
      boxShadow: state.isFocused ? "0 0 0 2px #7C3AED" : "none",
      "&:hover": { borderColor: "#7C3AED" },
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: "14px",
      fontWeight: "600",
      color: "#9CA3AF",
    }),
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-10 px-4">
      <div className="max-w-5xl mx-auto shadow-purple-100 overflow-hidden border border-gray-100">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-[#1E293B] uppercase tracking-tight">
            Onboard New School
          </h1>
          <p className="text-gray-500 text-sm">Partner Onboarding Portal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 md:p-12 space-y-10 bg-white mt-8 rounded-[2rem] border border-gray-100"
        >
          {/* Section 1: Business Identity & Document */}
          <section className="space-y-6">
            <h3 className="text-[#7C3AED] font-bold flex items-center gap-2 italic">
              <FaFileUpload /> 1. Legal Identity & Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  label="Company Full Name *"
                  name="companyName"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                  Incorporation Certificate
                </label>
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-purple-50 hover:border-[#7C3AED] transition cursor-pointer group justify-center items-center bg-gray-50">
                  <FaFileUpload
                    className="text-gray-300 group-hover:text-[#7C3AED] mb-2 transition"
                    size={24}
                  />
                  <p className="text-[11px] font-bold text-gray-500">
                    {formData.certificate
                      ? formData.certificate.name
                      : "Click to upload PDF/JPG"}
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificate: e.target.files[0],
                      })
                    }
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Section 2: Business Address */}
          <section className="space-y-6">
            <h3 className="text-[#7C3AED] font-bold flex items-center gap-2 italic">
              <FaMapMarkerAlt /> 2. Business Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <InputField
                  label="Office Address"
                  name="address"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                  Country
                </label>
                <Select
                  options={options.countries}
                  value={formData.country}
                  onChange={handleCountryChange}
                  styles={customSelectStyles}
                  placeholder="Select..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                  State
                </label>
                <Select
                  options={options.states}
                  value={formData.state}
                  onChange={handleStateChange}
                  isDisabled={!formData.country}
                  styles={customSelectStyles}
                  placeholder="Select..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                  City
                </label>
                <Select
                  options={options.cities}
                  value={formData.city}
                  onChange={(s) => setFormData({ ...formData, city: s })}
                  isDisabled={!formData.state}
                  styles={customSelectStyles}
                  placeholder="Select..."
                />
              </div>
              <InputField
                label="Pincode"
                name="pincode"
                onChange={handleChange}
              />
              <InputField
                label="Official Email"
                name="companyEmail"
                type="email"
                onChange={handleChange}
              />
              <InputField
                label="Official Mobile"
                name="companyMobile"
                type="tel"
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Section 3: Contact Person */}
          <section className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-6">
            <h3 className="text-[#7C3AED] font-bold flex items-center gap-2 italic">
              <FaUserTie className="text-[#7C3AED]" /> 3. Primary Contact Person
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Full Name"
                name="personName"
                onChange={handleChange}
              />
              <InputField
                label="Position"
                name="position"
                onChange={handleChange}
              />
              <InputField
                label="Personal Mobile"
                name="mob"
                onChange={handleChange}
              />
              <div className="md:col-span-3">
                <InputField
                  label="Person's Email Address"
                  name="personEmail"
                  type="email"
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Subscription Selection */}
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
              Select Subscription Plan
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Basic", "Pro", "Enterprise"].map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setFormData({ ...formData, planId: plan })}
                  className={`py-4 rounded-xl border-2 font-black text-xs transition-all ${formData.planId === plan ? "border-[#7C3AED] bg-purple-50 text-[#7C3AED] shadow-inner" : "border-gray-100 text-gray-400 bg-white"}`}
                >
                  {plan.toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          <div className="max-w-md mx-auto pt-6">
            <LiquidButton
              label="Register Company Profile"
              role="superadmin"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Sub-Component
const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  onChange,
  required = false,
}) => (
  <div>
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#7C3AED] focus:bg-white transition font-bold text-gray-700 text-sm shadow-sm"
      onChange={onChange}
    />
  </div>
);

export default CompanyForm;
