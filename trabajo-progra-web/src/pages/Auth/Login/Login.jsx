import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Boton from "../../../Components/Misagel/Boton";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.correo === email && u.password === password);
    
    if (usuario) {
      login(usuario);
      navigate("/");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
        </div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#FE624C] focus:border-[#FE624C] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Boton texto="Iniciar Sesión" onClick={handleSubmit} className="w-full" type="submit" />
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button type="button" onClick={() => navigate("/registro")} className="font-medium text-[#FE624C] hover:text-[#FE624C]">
              Regístrate
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
      </div>
    </div>
  );
};

export default Login;
