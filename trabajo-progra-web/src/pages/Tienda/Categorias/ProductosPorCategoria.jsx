import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductosPorCategoria = () => {
  const { nombreCategoria } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]');
    const filtrados = productosGuardados.filter(p => p.categoria === nombreCategoria);
    setProductos(filtrados);
  }, [nombreCategoria]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Productos de la categoría: {nombreCategoria}</h1>
      {productos.length === 0 ? (
        <div className="text-center text-gray-500">No hay productos en esta categoría.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productos.map((prod) => (
            <div key={prod.id} className="bg-white rounded shadow p-4 flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-2">{prod.nombre}</h2>
              <div className="mb-2">Precio: S/ {prod.precio}</div>
              <div className="mb-2">Categoría: {prod.categoria}</div>
              <Link to={`/detalle-producto/${prod.id}`} className="text-blue-600 hover:underline mt-2">Ver detalle</Link>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6">
        <Link to="/" className="text-[#FE624C] hover:underline">Volver al inicio</Link>
      </div>
    </div>
  );
};

export default ProductosPorCategoria; 