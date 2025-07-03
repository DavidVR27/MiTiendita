import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ListaProducto = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]');
    // Si algún producto no tiene categoría, asignar aleatoriamente
    const categorias = ['Alimentos', 'Bebidas', 'Limpieza'];
    let actualizados = false;
    const productosConCategoria = productosGuardados.map(prod => {
      if (!prod.categoria) {
        actualizados = true;
        return { ...prod, categoria: categorias[Math.floor(Math.random() * categorias.length)] };
      }
      return prod;
    });
    if (actualizados) {
      localStorage.setItem('productos', JSON.stringify(productosConCategoria));
    }
    setProductos(productosConCategoria);
  }, []);

  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      const nuevosProductos = productos.filter(p => p.id !== id);
      setProductos(nuevosProductos);
      localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Productos</h1>
      <div className="mb-4">
        <Link to="/admin/crear-producto" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Crear nuevo producto</Link>
      </div>
      {productos.length === 0 ? (
        <div className="text-center text-gray-500">No hay productos registrados.</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Precio</th>
              <th className="py-2 px-4 border-b">Categoría</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td className="py-2 px-4 border-b">{prod.nombre}</td>
                <td className="py-2 px-4 border-b">S/ {prod.precio}</td>
                <td className="py-2 px-4 border-b">{prod.categoria}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <button onClick={() => navigate(`/admin/editar-producto/${prod.id}`)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                  <button onClick={() => handleEliminar(prod.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaProducto;
