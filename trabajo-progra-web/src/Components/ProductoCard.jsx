import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { carritoService } from '../services/carritoService';
import { useAuth } from '../context/AuthContext';
import './ProductoCard.css';

const ProductoCard = ({ producto }) => {
  const [cantidad, setCantidad] = useState(1);
  const [mostrarCantidad, setMostrarCantidad] = useState(false);
  const { usuario } = useAuth();
  const navigate = useNavigate();

  // Defensive check for price
  const precioValido = typeof producto.precio === 'number' || (typeof producto.precio === 'string' && !isNaN(parseFloat(producto.precio)));
  const precio = precioValido ? parseFloat(producto.precio) : 0;

  const precioConDescuento = producto.descuento > 0
    ? precio * (1 - producto.descuento)
    : precio;

  const agregarAlCarrito = async (e) => {
    e.preventDefault();
    if (!usuario) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      navigate('/login');
      return;
    }

    try {
      await carritoService.agregarProducto(producto, cantidad, usuario.id);
      alert('Producto agregado al carrito');
      setCantidad(1);
      setMostrarCantidad(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const iniciarAgregarAlCarrito = (e) => {
    e.preventDefault();
    setMostrarCantidad(true);
  };

  return (
    <div className="producto-card">
      <Link to={`/detalle-producto/${producto.id}`} className="producto-link">
        <div className="producto-imagen">
          <img src={producto.imagen} alt={producto.nombre} className="w-24 h-24 object-cover" />
          {producto.descuento > 0 && (
            <span className="descuento-badge">-{Math.round(producto.descuento * 100)}%</span>
          )}
        </div>
        <div className="producto-info">
          <h3 className="producto-nombre">{producto.nombre}</h3>
          <p className="producto-descripcion">{producto.descripcion}</p>
          {producto.categoria && (
            <span className="producto-categoria">{producto.categoria}</span>
          )}
          <div className="producto-precio">
            {producto.descuento > 0 ? (
              <>
                <span className="precio-original">S/ {precio.toFixed(2)}</span>
                <span className="precio-descuento">S/ {precioConDescuento.toFixed(2)}</span>
              </>
            ) : (
              <span className="precio-normal">S/ {precio.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
      <div className="producto-acciones">
        {mostrarCantidad ? (
          <div className="cantidad-controls">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
            <span>{cantidad}</span>
            <button onClick={() => setCantidad(cantidad + 1)}>+</button>
            <button className="confirmar-cantidad" onClick={agregarAlCarrito}>
              Ok
            </button>
          </div>
        ) : (
          <button 
            className="agregar-carrito-btn"
            onClick={iniciarAgregarAlCarrito}
          >
            Añadir al carrito
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductoCard; 