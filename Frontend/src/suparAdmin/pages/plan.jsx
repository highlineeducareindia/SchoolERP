import React, { useState, useEffect } from "react";
import {
  FaRupeeSign,
  FaUsers,
  FaPercent,
  FaArrowRight,
  FaRocket,
  FaRegCheckCircle,
  FaEdit,
} from "react-icons/fa";
import LiquidButton from "../../components/LiquidButton";

const SimplePlanCreator = () => {
  const [planName, setPlanName] = useState("");
  const [rate, setRate] = useState("");
  const [limit, setLimit] = useState("");
  const [billingCycle, setBillingCycle] = useState("Yearly");
  const [manualDiscount, setManualDiscount] = useState(5);

  const [total, setTotal] = useState(0);
  const [savedAmount, setSavedAmount] = useState(0);

  // Calculation Logic Fix
  useEffect(() => {
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
  }, [rate, billingCycle, manualDiscount]);

  // Teeno fields fill hone par hi preview dikhega
  const isReady = planName.trim() !== "" && rate !== "" && limit !== "";

  return (
    <div className="w-full bg-[#F8FAFC] min-h-[calc(100vh-64px)]  sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 pb-3 border-b border-gray-200 ">
          <h2 className="text-2xl font-bold uppercase text-slate-800 tracking-tight">
            Create Subscription Plan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure pricing, features, and billing cycle for your subscription
            plan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Left Side: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                <FaEdit /> Configuration
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Plus"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Monthly Rate (₹)
                    </label>
                    <div className="relative">
                      <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Student Limit
                    </label>
                    <div className="relative">
                      <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="number"
                        placeholder="Max Students"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-1 bg-slate-100 rounded-xl flex gap-1">
                  {["Monthly", "Yearly"].map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => setBillingCycle(cycle)}
                      className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                        billingCycle === cycle
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {cycle} Billing
                    </button>
                  ))}
                </div>

                {billingCycle === "Yearly" && (
                  <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 animate-in fade-in duration-300">
                    <div className="flex justify-between mb-4">
                      <label className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                        <FaPercent /> Annual Discount
                      </label>
                      <span className="text-indigo-600 font-bold">
                        {manualDiscount}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      className="w-full h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      value={manualDiscount}
                      onChange={(e) => setManualDiscount(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Preview */}
          <div className="lg:col-span-5 sticky top-4">
            {isReady ? (
              /* DASHBOARD MATCHING PREVIEW */
              <div className="bg-[#1E293B] rounded-[2rem] p-8 text-white shadow-2xl border border-white/5 animate-in zoom-in-95 duration-500">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <FaRocket className="text-indigo-400" size={20} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase bg-white/5 px-3 py-1 rounded-full">
                    Draft Preview
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-3xl font-bold tracking-tight mb-2 capitalize">
                    {planName}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    Limit: {parseInt(limit).toLocaleString()} Students
                  </div>
                </div>

                <div className="space-y-5 border-t border-white/5 pt-8 mb-10">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                      Total Payable
                    </span>
                    <div className="text-right">
                      <span className="text-4xl font-black tracking-tighter text-white">
                        ₹
                        {total.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                        per {billingCycle.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  {billingCycle === "Yearly" && savedAmount > 0 && (
                    <div className="flex items-center gap-3 bg-emerald-500/5 text-emerald-400 p-4 rounded-xl border border-emerald-500/10">
                      <FaRegCheckCircle size={14} />
                      <span className="text-xs font-bold tracking-wide">
                        Annual Savings: ₹{savedAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <LiquidButton label="Confirm & Create Plan" role="superadmin" type="submit"/>
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="h-[450px] border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-300">
                  <FaRocket size={24} />
                </div>
                <h4 className="text-slate-600 font-bold tracking-tight">
                  Generate Preview
                </h4>
                <p className="text-slate-400 text-xs mt-2 max-w-[200px] leading-relaxed">
                  Please enter <b>Plan Name</b>, <b>Monthly Rate</b> and{" "}
                  <b>Student Limit</b> to see the live summary.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePlanCreator;
