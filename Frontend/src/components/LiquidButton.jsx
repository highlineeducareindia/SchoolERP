import React from "react";
import { FaArrowRight } from "react-icons/fa";

const LiquidButton = ({ label = "Create Plan", onClick, type = "submit", role = "superadmin", disabled = false }) => {
  
  // Role-based Color Mapping
  const theme = {
    superadmin: { color: "#7C3AED", border: "border-[#7C3AED]", bg: "bg-[#7C3AED]", textHover: "group-hover:text-[#7C3AED]" },
    admin:      { color: "#3B82F6", border: "border-[#3B82F6]", bg: "bg-[#3B82F6]", textHover: "group-hover:text-[#3B82F6]" },
    teacher:    { color: "#10B981", border: "border-[#10B981]", bg: "bg-[#10B981]", textHover: "group-hover:text-[#10B981]" },
    accountant: { color: "#F59E0B", border: "border-[#F59E0B]", bg: "bg-[#F59E0B]", textHover: "group-hover:text-[#F59E0B]" },
    librarian:  { color: "#6366F1", border: "border-[#6366F1]", bg: "bg-[#6366F1]", textHover: "group-hover:text-[#6366F1]" },
    transport:  { color: "#06B6D4", border: "border-[#06B6D4]", bg: "bg-[#06B6D4]", textHover: "group-hover:text-[#06B6D4]" },
  };

  // Default to superadmin if role doesn't match
  const currentTheme = theme[role] || theme.superadmin;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ 
        backgroundColor: disabled ? "#9CA3AF" : currentTheme.color, 
        borderColor: disabled ? "#9CA3AF" : currentTheme.color,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      className={`group relative px-8 py-3 w-auto font-bold text-sm uppercase tracking-widest overflow-hidden rounded-xl text-white transition-all duration-500 shadow-lg border-2 ${disabled ? 'border-gray-400' : currentTheme.border}`}
    >
      {/* Liquid Hover Effect - only when not disabled */}
      {!disabled && <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full"></span>}

      {/* Content */}
      <span className={`relative flex items-center justify-center gap-3 transition-colors duration-500 ${!disabled ? currentTheme.textHover : ''}`}>
        {label}
        {!disabled && <FaArrowRight className="text-xs transition-transform duration-500 group-hover:translate-x-2" />}
      </span>
    </button>
  );
};

export default LiquidButton;