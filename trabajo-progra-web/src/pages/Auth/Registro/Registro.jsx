import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Boton from "../../../Components/Misagel/Boton";
import Heading from "../../../Components/Misagel/Heading";
import { useAuth } from "../../../context/AuthContext";
import { usuarioService } from "../../../services/usuarioService";

const Registro = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // VALIDACIONES
      if (!nombreCompleto.trim() || !correoElectronico.trim() || !contrasenia) {
        setError("Todos los campos son obligatorios.");
        return;
      }
      const patronDeCorreoElectronico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!patronDeCorreoElectronico.test(correoElectronico)) {
        setError("Por favor, ingresa un correo electrónico válido.");
        return;
      }
      if (contrasenia.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
      }
      if (contrasenia !== confirmarContrasenia) {
        setError("Las contraseñas no coinciden");
        return;
      }

      const nombreArray = nombreCompleto.trim().split(' ');
      const nombre = nombreArray[0];
      const apellido = nombreArray.slice(1).join(' ');

      // 1. REGISTRAR AL USUARIO USANDO EL SERVICIO
      await usuarioService.register({
        nombre,
        apellido: apellido || nombre,
        email: correoElectronico,
        password: contrasenia,
      });

      // 2. INICIAR SESIÓN AUTOMÁTICAMENTE
      const loginData = await usuarioService.login({
        email: correoElectronico,
        password: contrasenia,
      });

      // 3. GUARDAR EL ESTADO DE AUTENTICACIÓN USANDO EL CONTEXTO
      login(loginData.usuario);

      alert("Registro exitoso. ¡Bienvenido!");
      navigate("/", { replace: true }); // Redirigir al inicio

    } catch (err) {
      console.error("Error durante el registro:", err);
      setError(err.message || "Hubo un error durante el registro. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <Heading texto="Crear cuenta" />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nombre" className="sr-only">
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#FE624C] focus:border-[#FE624C] focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
                value={nombreCompleto}
                onChange={(e) => {
                  setNombreCompleto(e.target.value);
                  setError("");
                }}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#FE624C] focus:border-[#FE624C] focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={correoElectronico}
                onChange={(e) => {
                  setCorreoElectronico(e.target.value);
                  setError("");
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
                placeholder="Contraseña"
                value={contrasenia}
                onChange={(e) => {
                  setContrasenia(e.target.value);
                  setError("");
                }}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#FE624C] focus:border-[#FE624C] focus:z-10 sm:text-sm"
                placeholder="Confirmar contraseña"
                value={confirmarContrasenia}
                onChange={(e) => {
                  setConfirmarContrasenia(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>

          <Boton texto="Registrarse" onClick={handleSubmit} className="w-full" type="submit" />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <button type="button" onClick={() => navigate("/login")} className="font-medium text-[#FE624C] hover:text-[#FE624C]">
                Inicia sesión
              </button>
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Olvidaste tu contraseña?{" "}
              <button type="button" onClick={() => navigate("/recuperar")} className="font-medium text-[#FE624C] hover:text-[#FE624C]">
                Recupérala aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
