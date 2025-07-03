import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ListaCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const categoriasGuardadas = JSON.parse(localStorage.getItem('categorias') || '[]');
    setCategorias(categoriasGuardadas);
  }, []);

  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
      const nuevasCategorias = categorias.filter(c => c.id !== id);
      setCategorias(nuevasCategorias);
      localStorage.setItem('categorias', JSON.stringify(nuevasCategorias));
      window.dispatchEvent(new Event('categoriasActualizadas'));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Categorías</h1>
      <div className="mb-4">
        <Link to="/admin/crear-categoria" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Crear nueva categoría</Link>
      </div>
      {categorias.length === 0 ? (
        <div className="text-center text-gray-500">No hay categorías registradas.</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Descripción</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td className="py-2 px-4 border-b">{cat.nombre}</td>
                <td className="py-2 px-4 border-b">{cat.descripcion}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  {/* Aquí podrías agregar edición en el futuro */}
                  <button onClick={() => handleEliminar(cat.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaCategoria; 