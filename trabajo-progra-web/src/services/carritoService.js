import { setItem, getItem } from './localStorage';

const CARRITO_KEY = 'carrito';
const GUARDADOS_KEY = 'guardados';

export const carritoService = {
  // Obtener todos los productos del carrito
  obtenerCarrito: () => {
    return getItem(CARRITO_KEY) || [];
  },

  // Obtener productos guardados
  obtenerGuardados: () => {
    return getItem(GUARDADOS_KEY) || [];
  },

  // Agregar o actualizar producto en el carrito
  agregarProducto: (producto, cantidad) => {
    const carrito = carritoService.obtenerCarrito();
    const productoExistente = carrito.find(p => p.id === producto.id);

    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      carrito.push({ ...producto, cantidad });
    }

    setItem(CARRITO_KEY, carrito);
    return carrito;
  },

  // Eliminar producto del carrito
  eliminarProducto: (productoId) => {
    const carrito = carritoService.obtenerCarrito();
    const nuevoCarrito = carrito.filter(p => p.id !== productoId);
    setItem(CARRITO_KEY, nuevoCarrito);
    return nuevoCarrito;
  },

  // Actualizar cantidad de un producto
  actualizarCantidad: (productoId, cantidad) => {
    const carrito = carritoService.obtenerCarrito();
    const producto = carrito.find(p => p.id === productoId);
    
    if (producto) {
      producto.cantidad = cantidad;
      setItem(CARRITO_KEY, carrito);
    }
    return carrito;
  },

  // Vaciar el carrito
  vaciarCarrito: () => {
    setItem(CARRITO_KEY, []);
    return [];
  },

  // Mover producto a guardados
  moverAGuardados: (productoId) => {
    const carrito = carritoService.obtenerCarrito();
    const guardados = carritoService.obtenerGuardados();
    const producto = carrito.find(p => p.id === productoId);

    if (producto) {
      // Remover del carrito
      const nuevoCarrito = carrito.filter(p => p.id !== productoId);
      setItem(CARRITO_KEY, nuevoCarrito);

      // Agregar a guardados si no existe
      if (!guardados.find(p => p.id === productoId)) {
        guardados.push(producto);
        setItem(GUARDADOS_KEY, guardados);
      }
    }
    return { carrito: carritoService.obtenerCarrito(), guardados: carritoService.obtenerGuardados() };
  },

  // Devolver producto al carrito
  devolverAlCarrito: (productoId) => {
    const carrito = carritoService.obtenerCarrito();
    const guardados = carritoService.obtenerGuardados();
    const producto = guardados.find(p => p.id === productoId);

    if (producto) {
      // Remover de guardados
      const nuevosGuardados = guardados.filter(p => p.id !== productoId);
      setItem(GUARDADOS_KEY, nuevosGuardados);

      // Agregar al carrito si no existe
      if (!carrito.find(p => p.id === productoId)) {
        carrito.push(producto);
        setItem(CARRITO_KEY, carrito);
      }
    }
    return { carrito: carritoService.obtenerCarrito(), guardados: carritoService.obtenerGuardados() };
  },

  // Eliminar de guardados
  eliminarGuardado: (productoId) => {
    const guardados = carritoService.obtenerGuardados();
    const nuevosGuardados = guardados.filter(p => p.id !== productoId);
    setItem(GUARDADOS_KEY, nuevosGuardados);
    return nuevosGuardados;
  },

  // Obtener el total de productos en el carrito
  obtenerTotal: () => {
    const carrito = carritoService.obtenerCarrito();
    return carrito.reduce((total, producto) => {
      const precio = producto.descuento > 0 
        ? producto.precio * (1 - producto.descuento)
        : producto.precio;
      return total + (precio * producto.cantidad);
    }, 0);
  },

  // Obtener cantidad total de items
  obtenerCantidadItems: () => {
    const carrito = carritoService.obtenerCarrito();
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  }
};