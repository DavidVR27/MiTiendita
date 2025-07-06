import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  useEffect(() => {
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const producto = productos.find(p => p.id === id);
    if (producto) {
      setNombre(producto.nombre);
      setPrecio(producto.precio);
    }
  }, [id]);

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!nombre || !precio) {
      alert('Completa todos los campos');
      return;
    }
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const nuevosProductos = productos.map(p =>
      p.id === id ? { ...p, nombre, precio: parseFloat(precio).toFixed(2) } : p
    );
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    alert('Producto actualizado correctamente');
    navigate('/admin/lista-producto');
  };

  const abrirModal = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/categorias');
      const data = await res.json();
      setCategorias(data);
      setMostrarModal(true);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const asignarCategoria = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/categorias/${categoriaSeleccionada}/agregar-producto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId: parseInt(id) }),
      });

      if (!res.ok) throw new Error('Fallo al asignar');

      alert('Producto asignado a la categoría correctamente');
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al asignar categoría:', error);
      alert('Error al asignar categoría');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Editar Producto</h1>
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar cambios</button>
      </form>

      <div className="mt-4 text-center">
        <button onClick={abrirModal} className="bg-purple-600 text-white px-4 py-2 rounded">
          Asignar a Categoría
        </button>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Selecciona una categoría</h2>
            <select
              className="w-full p-2 border rounded mb-4"
              value={categoriaSeleccionada}
              onChange={e => setCategoriaSeleccionada(e.target.value)}
            >
              <option value="">-- Selecciona --</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setMostrarModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancelar
              </button>
              <button onClick={asignarCategoria} className="bg-green-600 text-white px-4 py-2 rounded">
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarProducto;
