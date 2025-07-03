import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buscarProductos } from '../../../services/productos';
import ProductoCard from '../../../components/ProductoCard';
import './Busqueda.css';

const Busqueda = () => {
  const [searchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarResultados = async () => {
      try {
        setLoading(true);
        const termino = searchParams.get('q') || '';
        const categoria = searchParams.get('categoria') || '';
        const resultados = await buscarProductos(termino, categoria);
        setProductos(resultados);
        setError(null);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarResultados();
  }, [searchParams]);

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="busqueda-container">
      <h2>Resultados de búsqueda</h2>
      {productos.length === 0 ? (
        <p>No se encontraron productos</p>
      ) : (
        <div className="productos-grid">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Busqueda; 