import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import apiClient from "../../api/api";
import {
  FaRupeeSign, FaUsers, FaPercent, FaRocket, 
  FaRegCheckCircle, FaEdit, FaTrash, FaSpinner, 
  FaTimes, FaKeyboard, FaLayerGroup
} from "react-icons/fa";
import LiquidButton from "../../components/LiquidButton";

const SimplePlanCreator = () => {
  // Ref for auto-scroll to form top
  const topRef = useRef(null);

  // Form States
  const [planName, setPlanName] = useState("");
  const [rate, setRate] = useState("");
  const [limit, setLimit] = useState("");
  const [billingCycle, setBillingCycle] = useState("Yearly");
  const [manualDiscount, setManualDiscount] = useState(5);
  
  // Data States
  const [editingId, setEditingId] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [savedAmount, setSavedAmount] = useState(0);

  // Validation: Check if all primary fields are filled
  const isFormComplete = planName.trim() !== "" && rate !== "" && limit !== "";

  useEffect(() => {
    fetchPlans();
  }, []);

  // Calculation Logic (Runs only when fields are complete)
  useEffect(() => {
    if (isFormComplete) {
      const monthlyRate = parseFloat(rate) || 0;
      const discountPercent = parseFloat(manualDiscount) || 0;

      if (billingCycle === "Yearly") {
        const subTotal = monthlyRate * 12;
        const discount = (subTotal * discountPercent) / 100;
        setSavedAmount(discount);
        setTotal(subTotal - discount);
      } else {
        setSavedAmount(0);
        setTotal(monthlyRate);
      }
    }
  }, [rate, billingCycle, manualDiscount, planName, limit, isFormComplete]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/superadmin/get-plans");
      setPlans(res.data.plans || []);
    } catch (err) {
      toast.error("Failed to fetch database plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormComplete) return toast.error("Please fill all fields first");

    const loadingToast = toast.loading(editingId ? "Updating plan..." : "Creating plan...");
    try {
      const payload = {
        planId: editingId,
        name: planName,
        MonthlyPrice: parseFloat(rate),
        AnnualPrice: billingCycle === "Yearly" ? total : parseFloat(rate) * 12,
        duration: billingCycle === "Yearly" ? 365 : 30,
        studentLimit: parseInt(limit)
      };

      const url = editingId ? "/api/superadmin/edit-plan" : "/api/superadmin/create-plan";
      const res = await apiClient.post(url, payload);

      if (res.data.success) {
        toast.success(editingId ? "Database Updated!" : "New Plan Created!", { id: loadingToast });
        resetForm();
        fetchPlans();
      }
    } catch (error) {
      toast.error("Operation failed", { id: loadingToast });
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setPlanName(plan.name);
    setRate(plan.MonthlyPrice);
    setLimit(plan.studentLimit);
    setBillingCycle(plan.duration >= 365 ? "Yearly" : "Monthly");
    
    // Smooth scroll to top form
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this plan permanently?")) return;
    try {
      const res = await apiClient.post("/api/superadmin/delete-plan", { id });
      if(res.data.success) {
        toast.success("Plan Deleted");
        fetchPlans();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setPlanName("");
    setRate("");
    setLimit("");
    setBillingCycle("Yearly");
    setManualDiscount(5);
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen p-4 sm:p-8 font-sans transition-all">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto">
        
        {/* STICKY TOP HEADER */}
        <div ref={topRef} className="mb-8 pb-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <FaLayerGroup className="text-indigo-600" /> 
              {editingId ? "EDITING PLAN" : "PLAN CREATOR"}
            </h2>
            <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-widest">Superadmin Control Panel</p>
          </div>
          {editingId && (
            <button onClick={resetForm} className="flex items-center gap-2 text-xs font-bold text-rose-500 bg-rose-50 px-5 py-2.5 rounded-xl border border-rose-100 shadow-sm hover:bg-rose-500 hover:text-white transition-all active:scale-95">
              <FaTimes /> ABORT EDITING
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FORM CARD (LEFT) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 sm:p-10">
              <div className="space-y-7">
                {/* Plan Name */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">Full Plan Name</label>
                  <input type="text" placeholder="e.g. Enterprise Academic Plus" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700" value={planName} onChange={(e) => setPlanName(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rate */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">Monthly Rate (₹)</label>
                    <div className="relative">
                      <FaRupeeSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="number" placeholder="0.00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-5 py-4 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700" value={rate} onChange={(e) => setRate(e.target.value)} />
                    </div>
                  </div>
                  {/* Limit */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">Student Limit</label>
                    <div className="relative">
                      <FaUsers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="number" placeholder="Max students" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-5 py-4 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700" value={limit} onChange={(e) => setLimit(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Billing Selector */}
                <div className="p-1.5 bg-slate-100 rounded-2xl flex gap-1.5">
                  {["Monthly", "Yearly"].map((cycle) => (
                    <button key={cycle} onClick={() => setBillingCycle(cycle)} className={`flex-1 py-3.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${billingCycle === cycle ? "bg-white text-indigo-600 shadow-md scale-[1.02]" : "text-slate-500 hover:bg-slate-200"}`}>
                      {cycle} Cycle
                    </button>
                  ))}
                </div>

                {/* Discount Slider */}
                {billingCycle === "Yearly" && (
                  <div className="bg-indigo-50/50 p-6 rounded-2xl border-2 border-indigo-100/50 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-xs font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                        <FaPercent className="p-1 bg-indigo-200 rounded text-indigo-700" /> Annual Discount
                      </span>
                      <span className="text-xl font-black text-indigo-600">{manualDiscount}%</span>
                    </div>
                    <input type="range" min="0" max="50" className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={manualDiscount} onChange={(e) => setManualDiscount(e.target.value)} />
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-indigo-300 uppercase">
                      <span>0%</span>
                      <span>Max 50%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PREVIEW CARD (RIGHT) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            {isFormComplete ? (
              <div className="bg-[#0F172A] rounded-[3rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-white/10 animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                
                <div className="flex justify-between items-center mb-10">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <FaRocket className="text-indigo-400" size={24} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase bg-indigo-400/10 px-4 py-1.5 rounded-full border border-indigo-400/20">Active Draft</span>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-4xl font-black tracking-tighter mb-3 capitalize">{planName}</h3>
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    {parseInt(limit).toLocaleString()} Students Capacity
                  </div>
                </div>

                <div className="space-y-6 border-t border-white/5 pt-10 mb-10">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Total Investment</span>
                    <div className="text-right">
                      <span className="text-5xl font-black tracking-tighter">₹{total.toLocaleString()}</span>
                      <p className="text-[10px] text-slate-500 font-black uppercase mt-2 tracking-widest">Charged {billingCycle}</p>
                    </div>
                  </div>

                  {billingCycle === "Yearly" && savedAmount > 0 && (
                    <div className="flex items-center gap-4 bg-emerald-500/10 text-emerald-400 p-5 rounded-2xl border border-emerald-500/20 shadow-lg">
                      <div className="p-2 bg-emerald-500/20 rounded-lg"><FaRegCheckCircle size={18} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">Efficiency Savings</p>
                        <p className="text-sm font-black">₹{savedAmount.toLocaleString()} Saved Yearly</p>
                      </div>
                    </div>
                  )}
                </div>

                <div onClick={handleSubmit} className="relative z-10 active:scale-95 transition-transform">
                  <LiquidButton label={editingId ? "SYNC TO DATABASE" : "ACTIVATE NEW PLAN"} role="superadmin" type="button" />
                </div>
              </div>
            ) : (
              <div className="h-[450px] border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-10 text-center bg-white/40">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-8 text-slate-300 shadow-inner">
                  <FaKeyboard size={32} />
                </div>
                <h4 className="text-slate-700 font-black text-xl mb-3 tracking-tight">Setup Required</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[250px]">
                  Fill in the <span className="text-slate-600 font-bold underline decoration-indigo-300">Name</span>, <span className="text-slate-600 font-bold underline decoration-indigo-300">Rate</span>, and <span className="text-slate-600 font-bold underline decoration-indigo-300">Student Limit</span> to visualize your plan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- DATABASE TABLE (RESPONSIVE) --- */}
        <div className="mt-20 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-20">
          <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <h3 className="font-black text-slate-800 uppercase tracking-tighter text-xl">Existing Architecture</h3>
            <span className="text-[10px] bg-indigo-600 text-white px-5 py-2 rounded-full font-black tracking-widest shadow-lg shadow-indigo-200">LIVE PLANS: {plans.length}</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-6 py-6">Pricing Structure</th>
                  <th className="px-6 py-6">User Capacity</th>
                  <th className="px-6 py-6 text-center">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="4" className="py-24 text-center"><FaSpinner className="animate-spin mx-auto text-indigo-500" size={40} /></td></tr>
                ) : plans.length === 0 ? (
                  <tr><td colSpan="4" className="py-24 text-center text-slate-400 font-bold text-lg">No plans stored in database.</td></tr>
                ) : plans.map((p) => (
                  <tr key={p._id} className={`group hover:bg-indigo-50/50 transition-all ${editingId === p._id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}>
                    <td className="px-10 py-7">
                      <p className="font-black text-slate-800 text-lg capitalize tracking-tight">{p.name}</p>
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">{p.duration} Day Window</p>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly: ₹{p.MonthlyPrice?.toLocaleString()}</span>
                        <span className="text-base font-black text-indigo-600">Yearly: ₹{p.AnnualPrice?.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors text-slate-400"><FaUsers size={14} /></div>
                        <span className="font-black text-slate-700">{p.studentLimit?.toLocaleString()} Students</span>
                      </div>
                    </td>
                    <td className="px-6 py-7">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEdit(p)} className="flex items-center gap-2 px-5 py-3 bg-white text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] border border-slate-200 shadow-sm uppercase tracking-widest active:scale-90">
                          <FaEdit /> Modify
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="flex items-center gap-2 px-5 py-3 bg-white text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all font-black text-[10px] border border-slate-200 shadow-sm uppercase tracking-widest active:scale-90">
                          <FaTrash /> Purge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePlanCreator;