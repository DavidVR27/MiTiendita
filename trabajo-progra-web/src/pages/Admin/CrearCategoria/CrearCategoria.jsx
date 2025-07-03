import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearCategoria = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const navigate = useNavigate();

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!nombre || !descripcion) {
      alert('Completa todos los campos');
      return;
    }
    const categorias = JSON.parse(localStorage.getItem('categorias') || '[]');
    const nuevaCategoria = {
      id: Date.now().toString(),
      nombre,
      descripcion
    };
    categorias.push(nuevaCategoria);
    localStorage.setItem('categorias', JSON.stringify(categorias));
    window.dispatchEvent(new Event('categoriasActualizadas'));
    alert('Categoría creada correctamente');
    navigate('/admin/lista-categorias');
  };

  useEffect(() => {
    const categorias = JSON.parse(localStorage.getItem('categorias') || '[]');
    const categoriasPorDefecto = [
      { id: '1', nombre: 'Alimentos', descripcion: 'Productos alimenticios' },
      { id: '2', nombre: 'Bebidas', descripcion: 'Bebidas y refrescos' },
      { id: '3', nombre: 'Limpieza', descripcion: 'Productos de limpieza' }
    ];
    let actualizadas = false;
    categoriasPorDefecto.forEach(cat => {
      if (!categorias.some(c => c.nombre === cat.nombre)) {
        categorias.push(cat);
        actualizadas = true;
      }
    });
    if (actualizadas) {
      localStorage.setItem('categorias', JSON.stringify(categorias));
      window.dispatchEvent(new Event('categoriasActualizadas'));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear Categoría</h1>
      <form onSubmit={handleGuardar} className="bg-white rounded shadow p-6">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Nombre de la categoría:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Descripción:</label>
          <input
            type="text"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Guardar categoría</button>
      </form>
    </div>
  );
};

export default CrearCategoria;
