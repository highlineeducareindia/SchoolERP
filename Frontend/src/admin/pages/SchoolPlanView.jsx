import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import apiClient from "../../api/api";
import { 
  FaRocket, FaUsers, FaCalendarAlt, FaSpinner, FaCheckCircle 
} from "react-icons/fa";

const SchoolPlanView = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen p-4 sm:p-8 font-sans">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <div className=" border-b border-slate-200 pb-4 mb-12">
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tighter">
            Subscription Plans
          </h2>
          <p className="text-sm text-slate-500 font-medium tracking-tight mt-1">
            Explore available pricing tiers for your institution.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center">
            <FaSpinner className="animate-spin text-indigo-600 mb-4" size={30} />
            <p className="text-xs font-black text-slate-400 uppercase">Fetching Plans...</p>
          </div>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan._id} className="group bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-indigo-100 hover:-translate-y-1 relative overflow-hidden">
                
                {/* Visual Accent */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-all"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <FaRocket className="text-white" size={20} />
                  </div>
                  {/* Status Badge */}
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">
                    Active
                  </span>
                </div>

                <h3 className="text-2xl font-black mb-1 capitalize tracking-tight text-slate-800">
                  {plan.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-8">
                  <FaUsers className="text-slate-400" size={14}/>
                  <span className="text-sm font-bold text-slate-500">
                    Up to {plan.studentLimit?.toLocaleString()} Students
                  </span>
                </div>
                
                {/* Pricing Box - School Admin Theme (Lighter) */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Monthly</p>
                      <p className="text-2xl font-black text-slate-800">₹{plan.MonthlyPrice?.toLocaleString()}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-slate-200"></div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Annual Save</p>
                      <p className="text-2xl font-black text-indigo-600">₹{plan.AnnualPrice?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Features List for Admin */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <FaCheckCircle className="text-emerald-500" /> Full System Access
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <FaCheckCircle className="text-emerald-500" /> Dedicated Support
                  </li>
                </ul>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-slate-400" size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {plan.duration} Days Validity
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center">
             <p className="text-slate-400 font-black uppercase tracking-widest">No subscription plans available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolPlanView;