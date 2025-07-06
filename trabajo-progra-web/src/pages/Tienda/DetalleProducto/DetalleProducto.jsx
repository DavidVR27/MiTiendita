import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productoService } from '../../../services/productoService';
import { carritoService } from '../../../services/carritoService';
import { useAuth } from '../../../context/AuthContext';
import './DetalleProducto.css';


const DetalleProducto = () => {
  const { usuario } = useAuth();//Agregado por David Ed
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true);
        const data = await productoService.obtenerProductoPorId(id);
        if (data) {
          setProducto(data);
          setError(null);
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);
  //Arregle esto -- David E
  const agregarAlCarrito = async () => {
  if (!usuario) {
    alert("Debes iniciar sesión para agregar productos al carrito");
    return;
  }
  try {
    await carritoService.agregarProducto(producto, cantidad, usuario.id);
    alert('Producto agregado al carrito');
  } catch (err) {
    alert('Hubo un error al agregar el producto');
    console.error(err);
  }
};


  if (loading) {
    return <div className="loading">Cargando producto...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!producto) {
    return <div className="error">Producto no encontrado</div>;
  }

  const precioValido = typeof producto.precio === 'number' || (typeof producto.precio === 'string' && !isNaN(parseFloat(producto.precio)));
  const precio = precioValido ? parseFloat(producto.precio) : 0;

  const precioConDescuento = producto.descuento > 0
    ? precio * (1 - producto.descuento / 100)
    : precio;

  return (
    <div className="detalle-producto">
      <div className="producto-imagen">
        <img src={producto.imagen} alt={producto.nombre} />
      </div>
      <div className="producto-info">
        <h1>{producto.nombre}</h1>
        <p className="descripcion">{producto.descripcion}</p>
        <div className="precio">
          {producto.descuento > 0 ? (
            <>
              <span className="precio-original">S/ {precio.toFixed(2)}</span>
              <span className="precio-descuento">
                S/ {precioConDescuento.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="precio-normal">S/ {precio.toFixed(2)}</span>
          )}
        </div>
        <div className="cantidad">
          <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
          <span>{cantidad}</span>
          <button onClick={() => setCantidad(cantidad + 1)}>+</button>
        </div>
        <button className="agregar-carrito" onClick={agregarAlCarrito}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default DetalleProducto;
