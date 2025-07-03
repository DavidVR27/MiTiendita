import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../../../Components/Misagel/Heading";
import Boton from "../../../Components/Misagel/Boton";

const CambiarContraseniaConCodigo = () => {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState("");
  const [nuevaContrasenia, setNuevaContrasenia] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert("No hay un código de recuperación.");
      return;
    }
    if (token.codigo !== Number(codigo)) {
      alert("El código es incorrecto.");
      return;
    }

    // VALIDAR QUE LA NUEVA CONTRASEÑA TENGA AL MENOS 8 CARACTERES
    if (nuevaContrasenia.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const nuevaListaDeUsuarios = usuarios.map((usuario) => {
      if (usuario.correo === token.correo) {
        return {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          password: nuevaContrasenia,
        };
      }
      return usuario;
    });

    localStorage.setItem("usuarios", JSON.stringify(nuevaListaDeUsuarios));

    localStorage.removeItem("token");

    alert("Tu contraseña ha sido cambiada.");

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <Heading texto="Coloca el código y tu nueva contraseña" />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="codigo" className="sr-only">
                Código
              </label>
              <input
                id="codigo"
                name="codigo"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#FE624C] focus:border-[#FE624C] focus:z-10 sm:text-sm"
                placeholder="Ingresa tu código"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#FE624C] focus:border-[#FE624C] focus:z-10 sm:text-sm"
                placeholder="Nueva contraseña"
                value={nuevaContrasenia}
                onChange={(e) => {
                  setNuevaContrasenia(e.target.value);
                }}
              />
            </div>
          </div>

          <Boton texto="Cambiar contraseña" onClick={handleSubmit} className="w-full" type="submit" />

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

export default CambiarContraseniaConCodigo;
