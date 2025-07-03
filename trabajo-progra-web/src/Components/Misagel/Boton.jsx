import React from "react";

const Boton = ({ texto, onClick, className, type = "button" }) => {
  return (
    <button type={type} onClick={onClick} className={`${className} bg-[#FE624C] text-white font-semibold py-2  px-2 rounded cursor-pointer`}>
      {texto}
    </button>
  );
};

export default Boton;
