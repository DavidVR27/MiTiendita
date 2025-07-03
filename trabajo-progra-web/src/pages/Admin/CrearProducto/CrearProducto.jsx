import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearProducto = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cats = JSON.parse(localStorage.getItem('categorias') || '[]');
    setCategorias(cats);
  }, []);

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!nombre || !precio || !categoria) {
      alert('Completa todos los campos');
      return;
    }
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const nuevoProducto = {
      id: Date.now().toString(),
      nombre,
      precio: parseFloat(precio).toFixed(2),
      categoria
    };
    productos.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productos));
    alert('Producto creado correctamente');
    navigate('/admin/lista-producto');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear Producto</h1>
      <form onSubmit={handleGuardar} className="bg-white rounded shadow p-6">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Nombre del producto:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Precio:</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Categoría:</label>
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Guardar producto</button>
      </form>
    </div>
  );
};

export default CrearProducto;
