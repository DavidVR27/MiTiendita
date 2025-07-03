import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    setUsuarios(usuariosGuardados);
  }, []);

  const handleEliminarUsuario = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const usuariosActualizados = usuarios.filter(u => u.id !== id);
      localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
      setUsuarios(usuariosActualizados);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
      {usuarios.length === 0 ? (
        <div className="text-center text-gray-500">No hay usuarios registrados.</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Correo</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="py-2 px-4 border-b">{u.nombre} {u.apellido}</td>
                <td className="py-2 px-4 border-b">{u.correo}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <button onClick={() => navigate(`/admin/detalle-usuario/${u.id}`)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Ver detalle</button>
                  <button onClick={() => handleEliminarUsuario(u.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaUsuarios; 