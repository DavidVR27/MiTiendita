import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PerfilUsuario = () => {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const [editando, setEditando] = useState(false);
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: ''
  });

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }
    setDatosUsuario(usuario);
  }, [usuario, navigate]);

  const handleChange = (e) => {
    setDatosUsuario({ ...datosUsuario, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    // Actualizar en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex(u => u.correo === usuario.correo);
    
    if (index !== -1) {
      usuarios[index] = { ...datosUsuario };
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    // Actualizar usuario actual
    login(datosUsuario);
    setEditando(false);
    alert('Datos actualizados correctamente');
  };

  const handleCambiarPassword = () => {
    if (nuevoPassword.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex(u => u.correo === usuario.correo);
    
    if (index !== -1) {
      const usuarioActualizado = { ...datosUsuario, password: nuevoPassword };
      usuarios[index] = usuarioActualizado;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      login(usuarioActualizado);
      setDatosUsuario(usuarioActualizado);
      setNuevoPassword('');
      alert('Contraseña actualizada correctamente');
    }
  };

  if (!usuario) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Mi Perfil</h1>
      <div className="bg-white rounded shadow p-6">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={datosUsuario.nombre}
            onChange={handleChange}
            disabled={!editando}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={datosUsuario.apellido}
            onChange={handleChange}
            disabled={!editando}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Correo:</label>
          <input
            type="email"
            name="correo"
            value={datosUsuario.correo}
            onChange={handleChange}
            disabled={!editando}
            className="w-full p-2 border rounded"
          />
        </div>
        {editando ? (
          <button 
            onClick={handleGuardar} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Guardar
          </button>
        ) : (
          <button 
            onClick={() => setEditando(true)} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Editar datos
          </button>
        )}
      </div>
      <div className="bg-white rounded shadow p-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Cambiar contraseña</h2>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevoPassword}
          onChange={e => setNuevoPassword(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button 
          onClick={handleCambiarPassword} 
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
        >
          Cambiar contraseña
        </button>
      </div>
    </div>
  );
};

export default PerfilUsuario; 