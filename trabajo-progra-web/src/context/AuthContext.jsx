import React, { createContext, useState, useContext, useEffect } from 'react';
import { carritoService } from '../services/carritoService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Busca el usuario en el localStorage
  useEffect(() => {
    const cargarUsuario = () => {
      try {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
          setUsuario(JSON.parse(usuarioGuardado));
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, []);

  // Guarda la informacion del usuario en el localStorage
  const login = (usuarioData) => {
    try {
      setUsuario(usuarioData);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  // Elimina el usuario del localStorage
  const logout = () => {
    try {
      setUsuario(null);
      localStorage.removeItem('usuario');
      carritoService.vaciarCarrito();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  const value = {
    usuario,
    cargando,
    login,
    logout
  };

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 