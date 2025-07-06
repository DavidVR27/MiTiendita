import React from "react";

const Boton = ({ texto, onClick, type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#FE624C] hover:bg-[#e5533d]"
      }`}
    >
      {texto}
    </button>
  );
};

export default Boton;
