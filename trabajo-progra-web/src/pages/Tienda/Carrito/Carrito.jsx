import React, { useState, useEffect } from 'react';
import Boton from '../../../Components/Boton';
import { carritoService } from '../../../services/carritoService';
import { useAuth } from '../../../context/AuthContext';
import { FaTrash, FaPlus, FaMinus, FaSave } from 'react-icons/fa';

const Carrito = ({ actualizarTotal, actualizarTotalProductos, actualizarTotalDescuento, actualizarCantidadItems }) => {
  const [productos, setProductos] = useState([]);
  const [guardados, setGuardados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useAuth();

  function formatearProducto(producto) {
    let imagen = producto.Producto?.imagen || 'https://via.placeholder.com/100';
    let nombre = producto.Producto?.nombre || 'Producto sin nombre';
    let precio = Number(producto.Producto?.precio || 0);
    let descuento = Number(producto.Producto?.descuento || 0);
    let precioConDescuento = precio * (1 - descuento);

    return {
      id: producto.id,
      itemCarritoId: producto.itemCarritoId || producto.id,
      checked: true,
      cantidad: producto.cantidad || 1,
      precio,
      descuento,
      precioConDescuento,
      imagen,
      nombre,
      descripcion: producto.Producto?.descripcion || '',
    };
  }

  const cargarDatos = async () => {
    if (!usuario) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const [productosCarrito, productosGuardados] = await Promise.all([
        carritoService.obtenerCarritoDesdeAPI(usuario.id),
        carritoService.obtenerGuardadosDesdeAPI(usuario.id)
      ]);

      const productosFormateados = productosCarrito.map(formatearProducto);
      setProductos(productosFormateados);
      
      const guardadosFormateados = productosGuardados.map(formatearProducto);
      setGuardados(guardadosFormateados);
      
    } catch (err) {
      console.error('Error completo al cargar carrito:', err);
      setError(err.message);
      setProductos([]);
      setGuardados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [usuario]);

  const handleActualizarCantidad = async (itemCarritoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    try {
      await carritoService.actualizarCantidadEnAPI(itemCarritoId, nuevaCantidad);
      const nuevosProductos = productos.map(p => 
        p.id === itemCarritoId ? { ...p, cantidad: nuevaCantidad } : p
      );
      setProductos(nuevosProductos);
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
    }
  };

  const handleEliminar = async (itemCarritoId) => {
    try {
      await carritoService.eliminarDeAPI(itemCarritoId);
      setProductos(productos.filter(p => p.id !== itemCarritoId));
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleGuardar = async (itemCarritoId) => {
    try {
      await carritoService.marcarComoGuardadoEnAPI(itemCarritoId);
      await cargarDatos(); // Recargar todo para reflejar los cambios
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  function calcularTotal() {
    return productos.reduce((acc, p) => p.checked ? acc + p.precioConDescuento * p.cantidad : acc, 0);
  }

  function calcularTotalProductos() {
    return productos.reduce((acc, p) => p.checked ? acc + p.cantidad : acc, 0);
  }

  function calcularTotalDescuento() {
    return productos.reduce((acc, p) => {
      if (p.checked) {
        let desc = (p.precio - p.precioConDescuento) * p.cantidad;
        return acc + desc;
      }
      return acc;
    }, 0);
  }

  useEffect(() => {
    if (!productos) return;
    const total = calcularTotal();
    const totalProductos = calcularTotalProductos();
    const totalDescuento = calcularTotalDescuento();
    const cantidadItems = productos.filter(p => p.checked).length;

    if (actualizarTotal) actualizarTotal(total);
    if (actualizarTotalProductos) actualizarTotalProductos(totalProductos);
    if (actualizarTotalDescuento) actualizarTotalDescuento(totalDescuento);
    if (actualizarCantidadItems) actualizarCantidadItems(cantidadItems);
  }, [productos]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando carrito...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">
          Carrito de compras ({productos.length} productos)
        </h2>
        {productos.length === 0 ? (
          <p className="text-gray-500">No hay productos en el carrito</p>
        ) : (
          <div className="space-y-4">
            {productos.map(producto => (
              <div key={producto.id} className="flex items-center space-x-4 p-4 border rounded-lg bg-white shadow">
                <img src={producto.imagen} alt={producto.nombre} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{producto.nombre}</h3>
                  <p className="text-gray-600 font-bold text-xl">S/ {producto.precioConDescuento.toFixed(2)}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Boton onClick={() => handleGuardar(producto.id)} texto="Guardar" className="text-sm" />
                    <Boton onClick={() => handleEliminar(producto.id)} texto="Eliminar" className="text-sm bg-red-500 hover:bg-red-600" />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => handleActualizarCantidad(producto.id, producto.cantidad - 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                    <FaMinus />
                  </button>
                  <span className="text-xl font-semibold">{producto.cantidad}</span>
                  <button onClick={() => handleActualizarCantidad(producto.id, producto.cantidad + 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">
          Guardado para después ({guardados.length} productos)
        </h2>
        {guardados.length === 0 ? (
          <p className="text-gray-500">No hay productos guardados</p>
        ) : (
          <div className="space-y-4">
            {guardados.map(producto => (
              <div key={producto.id} className="flex items-center space-x-4 p-4 border rounded-lg bg-white shadow">
                <img src={producto.imagen} alt={producto.nombre} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{producto.nombre}</h3>
                  <p className="text-gray-600 font-bold text-xl">S/ {producto.precioConDescuento.toFixed(2)}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Boton onClick={() => { /* Lógica para mover al carrito */ }} texto="Mover al carrito" className="text-sm" />
                    <Boton onClick={() => handleEliminar(producto.id)} texto="Eliminar" className="text-sm bg-red-500 hover:bg-red-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;