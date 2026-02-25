import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import apiClient from "../../api/api";
import { 
  FaTrash, FaEdit, FaRocket, FaUsers, 
  FaCalendarAlt, FaSpinner, FaPlus 
} from "react-icons/fa";

const ViewPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/superadmin/get-plans");
      const plansData = res.data.plans || res.data.data || [];
      setPlans(Array.isArray(plansData) ? plansData : []);
    } catch (error) {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this plan?")) return;
    const deleteToast = toast.loading("Processing...");
    try {
      const res = await apiClient.post(`/api/superadmin/delete-plan`, { id });
      if (res.data.success) {
        setPlans(plans.filter(p => p._id !== id));
        toast.success("Plan purged", { id: deleteToast });
      }
    } catch (err) {
      toast.error("Error", { id: deleteToast });
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen p-4 sm:p-8">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Subscription Vault</h2>
            <p className="text-sm text-slate-500 font-medium tracking-tight">Manage your live market pricing tiers.</p>
          </div>
          <button 
            onClick={() => navigate("/super-admin/plans")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:scale-105 transition-all"
          >
            <FaPlus /> Create New
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center"><FaSpinner className="animate-spin text-indigo-600 mb-4" size={30} /><p className="text-xs font-black text-slate-400 uppercase">Fetching Database...</p></div>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan._id} className="group bg-[#1E293B] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden transition-all hover:-translate-y-2 border border-white/5">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-indigo-400 transition-colors">
                    <FaRocket className="text-indigo-400" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate("/super-admin/plans", { state: { editPlan: plan } })}
                      className="p-3 bg-white/5 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl transition-all"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button onClick={() => handleDelete(plan._id)} className="p-3 bg-white/5 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl transition-all">
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-1 capitalize tracking-tight">{plan.name}</h3>
                <div className="flex gap-2 mb-8">
                  <span className="text-[9px] font-black px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 uppercase tracking-widest border border-indigo-500/20">
                    {plan.studentLimit} Students
                  </span>
                </div>
                
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 mb-8">
                  <div className="flex justify-between items-center">
                    <div><p className="text-[9px] font-black text-slate-500 uppercase">Monthly</p><p className="text-lg font-black">₹{plan.MonthlyPrice}</p></div>
                    <div className="h-8 w-[1px] bg-white/10"></div>
                    <div className="text-right"><p className="text-[9px] font-black text-slate-500 uppercase">Annual</p><p className="text-lg font-black text-indigo-400">₹{plan.AnnualPrice}</p></div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-400" size={12} />
                    <span className="text-[10px] font-black uppercase">{plan.duration} Days Window</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border-4 border-dashed border-slate-100 p-20 text-center">
             <p className="text-slate-400 font-black uppercase tracking-widest">No plans found in vault</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPlans;