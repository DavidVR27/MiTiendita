import React, { useState, useEffect } from 'react';
import Boton from '../../../Components/Boton';
import { carritoService } from '../../../services/carritoService';
import { useAuth } from '../../../context/AuthContext'; 

const Carrito = ({ actualizarTotal, actualizarTotalProductos, actualizarTotalDescuento, actualizarCantidadItems }) => {
  const [productos, setProductos] = useState([]);
  const [guardados, setGuardados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useAuth();

  // 🔍 DEBUG: Verificar la importación
  console.log('carritoService:', carritoService);
  console.log('carritoService keys:', Object.keys(carritoService || {}));
  console.log('obtenerCarritoDesdeAPI:', carritoService?.obtenerCarritoDesdeAPI);
  console.log('tipo obtenerCarritoDesdeAPI:', typeof carritoService?.obtenerCarritoDesdeAPI);

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

  useEffect(() => {
    const cargarDatos = async () => {
      if (!usuario) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // 🔍 DEBUG: Verificar antes de llamar
        console.log('Intentando cargar datos para usuario:', usuario.id);
        console.log('carritoService disponible:', !!carritoService);
        console.log('obtenerCarritoDesdeAPI disponible:', !!carritoService?.obtenerCarritoDesdeAPI);
        
        // Verificación adicional
        if (!carritoService) {
          throw new Error('carritoService no está definido');
        }
        
        if (!carritoService.obtenerCarritoDesdeAPI) {
          throw new Error('obtenerCarritoDesdeAPI no está definido en carritoService');
        }
        
        if (typeof carritoService.obtenerCarritoDesdeAPI !== 'function') {
          throw new Error(`obtenerCarritoDesdeAPI no es una función, es: ${typeof carritoService.obtenerCarritoDesdeAPI}`);
        }
        
        // Cargar productos del carrito
        const productosCarrito = await carritoService.obtenerCarritoDesdeAPI(usuario.id);
        console.log('Productos carrito recibidos:', productosCarrito);
        
        const productosFormateados = productosCarrito.map(formatearProducto);
        setProductos(productosFormateados);
        
        // Cargar productos guardados
        if (carritoService.obtenerGuardadosDesdeAPI) {
          const productosGuardados = await carritoService.obtenerGuardadosDesdeAPI(usuario.id);
          console.log('Productos guardados recibidos:', productosGuardados);
          const guardadosFormateados = productosGuardados.map(formatearProducto);
          setGuardados(guardadosFormateados);
        }
        
      } catch (err) {
        console.error('Error completo al cargar carrito:', err);
        setError(err.message);
        setProductos([]);
        setGuardados([]);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [usuario]);

  // Resto de funciones...
  function actualizarProductoEnCarrito(productoId, cambios) {
    const nuevosProductos = productos.map(producto =>
      producto.id === productoId ? { ...producto, ...cambios } : producto
    );
    setProductos(nuevosProductos);
  }

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
              <div key={producto.id} className="flex items-center space-x-4 p-4 border rounded">
                <div className="flex-1">
                  <h3 className="font-semibold">{producto.nombre}</h3>
                  <p className="text-gray-600">${producto.precioConDescuento.toFixed(2)}</p>
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