import React from 'react';

const Boton = ({ texto, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#FE624C] text-white font-semibold py-2 px-2 rounded"
    >
      {texto}
    </button>
  );
};

export default Boton;