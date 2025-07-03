import React, { useState, useEffect } from 'react';
import Boton from '../../../Components/Boton';
import { carritoService } from '../../../services/carritoService';

// Componente Carrito - Maneja la lista de productos en el carrito y los guardados
const Carrito = ({ actualizarTotal, actualizarTotalProductos, actualizarTotalDescuento, actualizarCantidadItems }) => {
  // Estados para guardar los productos
  const [productos, setProductos] = useState([]);
  const [guardados, setGuardados] = useState([]);

  // Función para dar formato a un producto
  function formatearProducto(producto) {
    // Si no hay imagen, usar una imagen por defecto
    let imagen = producto.imagen;
    if (!imagen) {
      imagen = 'https://via.placeholder.com/100';
    }

    // Si no hay nombre, usar un nombre por defecto
    let nombre = producto.nombre;
    if (!nombre) {
      nombre = 'Producto sin nombre';
    }

    // Calcular el precio con descuento
    let precioConDescuento = producto.precio;
    if (producto.descuento) {
      precioConDescuento = producto.precio * (1 - producto.descuento);
    }

    // Retornar el producto formateado
    return {
      ...producto,
      checked: producto.checked === undefined ? true : producto.checked,
      cantidad: producto.cantidad || 1,
      precio: producto.precio || 0,
      descuento: producto.descuento || 0,
      precioConDescuento: precioConDescuento,
      imagen: imagen,
      nombre: nombre,
      descripcion: producto.descripcion || ''
    };
  }

    // Cargar los productos cuando el componente se inicia
    useEffect(() => {
      // Obtener productos del carrito
      const productosCarrito = carritoService.obtenerCarrito();
      const productosGuardados = carritoService.obtenerGuardados();
      
      // Dar formato a los productos
      const productosFormateados = productosCarrito.map(formatearProducto);
      const guardadosFormateados = productosGuardados.map(formatearProducto);

      // Guardar en el estado
      setProductos(productosFormateados);
      setGuardados(guardadosFormateados);
    }, []);

  // Función para actualizar un producto en el carrito
  function actualizarProductoEnCarrito(productoId, cambios) {
    // Crear una nueva lista de productos
    let nuevosProductos = [];
    
    // Recorrer todos los productos
    for (let i = 0; i < productos.length; i++) {
      let producto = productos[i];
      
      // Si es el producto que queremos actualizar
      if (producto.id === productoId) {
        // Crear una copia del producto con los cambios
        producto = { ...producto, ...cambios };
      }
      
      // Agregar el producto a la nueva lista
      nuevosProductos.push(producto);
    }

    // Actualizar el carrito en el almacenamiento
    carritoService.vaciarCarrito();
    for (let producto of nuevosProductos) {
      carritoService.agregarProducto(producto, producto.cantidad);
    }

    // Actualizar el estado
    setProductos(nuevosProductos);
  }

  // Calcular el total del carrito
  function calcularTotal() {
    let total = 0;
    for (let producto of productos) {
      if (producto.checked) {
        total = total + (producto.precioConDescuento * producto.cantidad);
      }
    }
    return total;
  }

  // Calcular el total de productos
  function calcularTotalProductos() {
    let total = 0;
    for (let producto of productos) {
      if (producto.checked) {
        total = total + producto.cantidad;
      }
    }
    return total;
  }

  // Calcular el total de descuentos
  function calcularTotalDescuento() {
    let total = 0;
    for (let producto of productos) {
      if (producto.checked) {
        let descuento = (producto.precio - producto.precioConDescuento) * producto.cantidad;
        total = total + descuento;
      }
    }
    return total;
  }

  // Actualizar los totales cuando cambian los productos
  useEffect(() => {
    const total = calcularTotal();
    const totalProductos = calcularTotalProductos();
    const totalDescuento = calcularTotalDescuento();
    const cantidadItems = productos.filter(p => p.checked).length;

    // Enviar los totales al componente padre
    if (actualizarTotal) actualizarTotal(total); // total
    if (actualizarTotalProductos) actualizarTotalProductos(totalProductos); // productos totales
    if (actualizarTotalDescuento) actualizarTotalDescuento(totalDescuento); // total descuento
    if (actualizarCantidadItems) actualizarCantidadItems(cantidadItems); // items total
  }, [productos]);

  // Función para marcar/desmarcar un producto para el guardado despues
  function toggleCheck(id) {
    // Buscar el producto
    const producto = productos.find(p => p.id === id);
    if (producto) {
      // Cambiar el estado de checked
      actualizarProductoEnCarrito(id, { checked: !producto.checked });
    }
  }

  // Función para aumentar la cantidad
  function incrementarCantidad(id) {
    // Busca en el arreglo productos el que tenga el id igual al que se pasó a la función
    const producto = productos.find(p => p.id === id);
    // Si el producto existe y está marcado como checked
    if (producto && producto.checked) {
      // Actualiza la cantidad del producto
      actualizarProductoEnCarrito(id, { cantidad: producto.cantidad + 1 });
    }
  }

  // Función para disminuir la cantidad
  function disminuirCantidad(id) {
    const producto = productos.find(p => p.id === id);
    if (producto && producto.checked && producto.cantidad > 1) {
      actualizarProductoEnCarrito(id, { cantidad: producto.cantidad - 1 });
    }
  }

  // Función para eliminar un producto
  function eliminarProducto(id) {
    // Filtrar el producto a eliminar
    const nuevosProductos = productos.filter(p => p.id !== id);
    
    // Actualizar el carrito en el almacenamiento
    carritoService.vaciarCarrito();
    for (let producto of nuevosProductos) {
      carritoService.agregarProducto(producto, producto.cantidad);
    }

    // Actualizar el estado
    setProductos(nuevosProductos);
  }
 
  // Función para mover un producto a guardados
  function moverAGuardados(id) {
    // Obtener el producto que queremos mover
    const productoAMover = productos.find(p => p.id === id);
    if (!productoAMover) return;

    // Filtrar el producto del carrito
    const nuevosProductos = productos.filter(p => p.id !== id);
    
    // Agregar el producto a guardados
    const nuevosGuardados = [...guardados, productoAMover];

    // Actualizar el carrito en el almacenamiento
    carritoService.vaciarCarrito();
    for (let producto of nuevosProductos) {
      carritoService.agregarProducto(producto, producto.cantidad);
    }

    // Actualizar los estados
    setProductos(nuevosProductos);
    setGuardados(nuevosGuardados);

    // Actualizar el servicio
    carritoService.moverAGuardados(id);
  }

  // Función para devolver un producto al carrito
  function devolverAlCarrito(id) {
    // Obtener el producto que queremos devolver
    const productoADevolver = guardados.find(p => p.id === id);
    if (!productoADevolver) return;

    // Filtrar el producto de guardados
    const nuevosGuardados = guardados.filter(p => p.id !== id);
    
    // Agregar el producto al carrito
    const nuevosProductos = [...productos, productoADevolver];

    // Actualizar el carrito en el almacenamiento
    carritoService.vaciarCarrito();
    for (let producto of nuevosProductos) {
      carritoService.agregarProducto(producto, producto.cantidad);
    }

    // Actualizar los estados
    setProductos(nuevosProductos);
    setGuardados(nuevosGuardados);

    // Actualizar el servicio
    carritoService.devolverAlCarrito(id);
  }

  // Función para eliminar un producto guardado
  function eliminarGuardado(id) {
    const nuevosGuardados = carritoService.eliminarGuardado(id);
    setGuardados(nuevosGuardados);
  }

  return (
    <div className="flex flex-col space-y-8">
      {/* Carrito */}
      <div>
        <h2 className="text-xl font-bold mb-2">Carrito de compras</h2>
        {/* Si el carrito está vacío */}
        {productos.length === 0 ? (
          <div className="text-center text-gray-500">El carrito está vacío.</div>
        ) : ( 
          // Si el carrito no está vacío, se muestran los productos
          productos.map((producto) => ( // Para cada producto se aplica el siguiente estilo:
            <div
              key={producto.id}
              className="bg-white shadow-md rounded-lg p-4 flex items-start w-full mb-2"
            >
              <div className="flex items-center mr-4">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-[#6B6B6B] mr-2 accent-[#6B6B6B] checked:bg-[#6B6B6B] checked:border-[#6B6B6B]"
                  checked={producto.checked}
                  onChange={() => toggleCheck(producto.id)}
                />
                <img src={producto.imagen} alt={producto.nombre} className="w-24 h-24 object-cover rounded-md" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-lg font-bold">{producto.nombre}</h2>
                  <div className="text-right">
                    {producto.descuento ? (
                      <>
                        <p className="text-gray-400 line-through text-sm">S/ {Number(producto.precio).toFixed(2)}</p>
                        <div className="flex items-center justify-end gap-2">
                          <p className="text-red-500 font-bold text-xl">S/ {producto.precioConDescuento.toFixed(2)}</p>
                          <p className="text-red-500 text-sm bg-red-100 px-2 py-1 rounded">-{Math.round(producto.descuento * 100)}%</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 font-bold text-xl">S/ {Number(producto.precio).toFixed(2)}</p>
                    )}
                  </div>
                </div>
                <p className="text-gray-600">{producto.descripcion}</p>
                {producto.llegada && <p className="text-[#FE624C] font-bold">{producto.llegada}</p>}
                <div className="flex items-center mt-4 justify-end gap-2">
                  <div className="flex items-center">
                    <span className="mr-4">Cantidad</span>
                    <Boton
                      onClick={() => disminuirCantidad(producto.id)}
                      disabled={!producto.checked || producto.cantidad <= 1}
                      texto={"-"}
                      className="px-3 py-1 mr-2"
                    />
                    <span className="mx-3">{producto.cantidad}</span>
                    <Boton 
                      onClick={() => incrementarCantidad(producto.id)}
                      disabled={!producto.checked}
                      texto={"+"}
                      className="px-3 py-1 ml-2"
                    />
                  </div>
                  <Boton
                    onClick={() => moverAGuardados(producto.id)}
                    texto={"Guardar para después"}
                    className="ml-2 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white"
                  />
                  <button
                    onClick={() => eliminarProducto(producto.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Guardados para después */}
      <div>
        <h2 className="text-xl font-bold mb-2">Guardados para después</h2>
        {guardados.length === 0 ? ( // Si no hay productos guardados para después:
          <div className="text-center text-gray-500">No hay productos guardados para después.</div>
        ) : (
          guardados.map((producto) => (
            <div
              key={producto.id}
              className="bg-gray-100 shadow rounded-lg p-4 flex items-start w-full mb-2"
            >
              <img src={producto.imagen} alt={producto.nombre} className="w-24 h-24 object-cover rounded-md mr-4" />
              <div className="flex-grow">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-lg font-bold">{producto.nombre}</h2>
                  <div className="text-right">
                    {producto.descuento ? ( // Si el producto tiene descuento:
                      <>
                        <p className="text-gray-400 line-through text-sm">S/ {Number(producto.precio).toFixed(2)}</p>
                        <div className="flex items-center justify-end gap-2">
                          <p className="text-red-500 font-bold text-xl">S/ {producto.precioConDescuento.toFixed(2)}</p>
                          <p className="text-red-500 text-sm bg-red-100 px-2 py-1 rounded">-{Math.round(producto.descuento * 100)}%</p>
                        </div>
                      </>
                    ) : ( // Si el producto no tiene descuento:
                      <p className="text-gray-600 font-bold text-xl">S/ {Number(producto.precio).toFixed(2)}</p>
                    )}
                  </div>
                </div>
                <p className="text-gray-600">{producto.descripcion}</p>
                {producto.llegada && <p className="text-[#FE624C] font-bold">{producto.llegada}</p>}
                <div className="flex items-center mt-4 gap-2">
                  <Boton
                    onClick={() => devolverAlCarrito(producto.id)}
                    texto={"Regresar al carrito"}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white"
                  />
                  <button
                    onClick={() => eliminarGuardado(producto.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Carrito;
