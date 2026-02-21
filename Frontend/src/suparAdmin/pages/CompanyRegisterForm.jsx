import  { useState, useEffect } from 'react';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import axios from 'axios';

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    country: null,
    state: null,
    city: null,
    pincode: '',
    contact: '',
    personName: '',
    personEmail: '', // New Field
    position: '',
    mob: '',
    companyEmail: '',
    companyMobile: '',
    planId: '',
    certificate: null
  });

  const [options, setOptions] = useState({
    countries: [],
    states: [],
    cities: []
  });

  // Load Countries on Mount
  useEffect(() => {
    const countryData = Country.getAllCountries().map(c => ({
      value: c.isoCode,
      label: `${c.flag} ${c.name}`,
      name: c.name
    }));
    setOptions(prev => ({ ...prev, countries: countryData }));
  }, []);

  // Handle Country Change
  const handleCountryChange = (selected) => {
    const stateData = State.getStatesOfCountry(selected.value).map(s => ({
      value: s.isoCode,
      label: s.name
    }));
    setFormData({ ...formData, country: selected, state: null, city: null });
    setOptions(prev => ({ ...prev, states: stateData, cities: [] }));
  };

  // Handle State Change
  const handleStateChange = (selected) => {
    const cityData = City.getCitiesOfState(formData.country.value, selected.value).map(ct => ({
      value: ct.name,
      label: ct.name
    }));
    setFormData({ ...formData, state: selected, city: null });
    setOptions(prev => ({ ...prev, cities: cityData }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const sendData = new FormData();

    sendData.append("companyName", formData.companyName);
    sendData.append("country", JSON.stringify(formData.country));
    sendData.append("state", JSON.stringify(formData.state));
    sendData.append("city", JSON.stringify(formData.city));
    sendData.append("pincode", formData.pincode);

    sendData.append("personName", formData.personName);
    sendData.append("personEmail", formData.personEmail);
    sendData.append("position", formData.position);
    sendData.append("mob", formData.mob);

    sendData.append("companyEmail", formData.companyEmail);
    sendData.append("companyMobile", formData.companyMobile);

    sendData.append("planId", formData.planId);

    if (formData.certificate) {
      sendData.append("certificate", formData.certificate);
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await axios.post(
      `${apiUrl}/api/company/register`,
      sendData
    );

    alert("Company Registered Successfully!");

    console.log(res.data);

  }
  catch (error) {

    console.log(error);

    alert("Registration Failed");

  }

};

  // Custom Styles for Searchable Select
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      padding: '2px',
      borderRadius: '0.5rem',
      borderColor: '#d1d5db',
      '&:hover': { borderColor: '#6366f1' }
    })
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Top Header Design */}
        <div className="bg-indigo-700 p-10 text-white relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight">Company Registration</h2>
            <p className="text-indigo-200 mt-2">Create a professional profile for your business</p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          
          {/* Section: Legal & Document */}
          <section>
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">1. Legal Document</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-32 border-2 border-indigo-200 border-dashed rounded-2xl hover:bg-indigo-50 hover:border-indigo-400 transition cursor-pointer group">
                <div className="flex flex-col items-center justify-center pt-7">
                  <svg className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  <p className="pt-1 text-sm text-gray-500">{formData.certificate ? formData.certificate.name : 'Click to upload Incorporation Certificate'}</p>
                </div>
                <input type="file" className="hidden" onChange={(e) => setFormData({...formData, certificate: e.target.files[0]})} />
              </label>
            </div>
          </section>

          {/* Section: Business Identity */}
          <section className="space-y-6">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">2. Business Address</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <input type="text" name="companyName" placeholder="Company Name *" required onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-gray-50" />
              </div>

              {/* Searchable Country */}
              <div>
                <Select
                  options={options.countries}
                  value={formData.country}
                  onChange={handleCountryChange}
                  placeholder="Search Country..."
                  styles={customSelectStyles}
                />
              </div>

              {/* Searchable State */}
              <div>
                <Select
                  options={options.states}
                  value={formData.state}
                  onChange={handleStateChange}
                  placeholder="Search State..."
                  isDisabled={!formData.country}
                  styles={customSelectStyles}
                />
              </div>

              {/* Searchable City */}
              <div>
                <Select
                  options={options.cities}
                  value={formData.city}
                  onChange={(selected) => setFormData({...formData, city: selected})}
                  placeholder="Search City..."
                  isDisabled={!formData.state}
                  styles={customSelectStyles}
                />
              </div>

              <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50" />
            </div>
          </section>

          {/* Section: Contact Person (Includes Personal Email) */}
          <section className="bg-indigo-50/50 p-8 rounded-3xl space-y-6 border border-indigo-100">
            <label className="block text-sm font-bold text-indigo-800 uppercase tracking-widest">3. Primary Contact Person</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input type="text" name="personName" placeholder="Full Name" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" />
              <input type="text" name="position" placeholder="Position/Role" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" />
              <input type="tel" name="mob" placeholder="Personal Mobile" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500" />
              
              <div className="md:col-span-3">
                <input type="email" name="personEmail" placeholder="Person's Email Address" onChange={handleChange} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 shadow-sm" />
              </div>
            </div>
          </section>

          {/* Section: Official Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <label className="block text-sm font-bold text-gray-700 ml-1">Official Company Email</label>
               <input type="email" name="companyEmail" placeholder="support@company.com" onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="space-y-4">
               <label className="block text-sm font-bold text-gray-700 ml-1">Company Mobile</label>
               <input type="tel" name="companyMobile" placeholder="+1-234-567-8900" onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="space-y-4 md:col-span-2">
               <label className="block text-sm font-bold text-gray-700 ml-1">Subscription Plan</label>
               <select name="planId" onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                 <option value="Basic">Basic (Free)</option>
                 <option value="Pro">Pro ($99/mo)</option>
                 <option value="Enterprise">Enterprise (Custom)</option>
               </select>
            </div>
          </section>

          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-200 transition-all transform active:scale-[0.98] uppercase tracking-widest">
            Register Company Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;