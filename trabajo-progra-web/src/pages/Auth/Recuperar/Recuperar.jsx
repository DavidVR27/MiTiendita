import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../../Components/Misagel/Heading";
import Boton from "../../../Components/Misagel/Boton";

const Recuperar = () => {
  const navigate = useNavigate();

  const [correoElectronico, setCorreoElectronico] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // VALIDAR QUE EL CORREO SEA UN CORREO VALIDO
    const patronDeCorreoElectronico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patronDeCorreoElectronico.test(correoElectronico)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuario = usuarios.find((usuario) => usuario.correo === correoElectronico);
    if (usuario === undefined) {
      alert("El correo no está registrado.");
      return;
    }

    const codigo = Math.floor(Math.random() * 1000000);

    const token = {
      correo: correoElectronico,
      codigo: codigo,
    };

    localStorage.setItem("token", JSON.stringify(token));

    alert(`Tu código de recuperación es: ${codigo}, apuntalo para cambiar tu contraseña`);

    navigate("/cambiar-contrasenia-con-codigo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <Heading texto="Recuperar cuenta" />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#FE624C] focus:border-[#FE624C] focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={correoElectronico}
                onChange={(e) => {
                  setCorreoElectronico(e.target.value);
                }}
              />
            </div>
          </div>

          <Boton texto="Recuperar" onClick={handleSubmit} className="w-full" type="submit" />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <button type="button" onClick={() => navigate("/registro")} className="font-medium text-[#FE624C] hover:text-[#FE624C]">
                Regístrate
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Recuperar;
