// Servicio para manejar la carga y gestión de productos
const PRODUCTOS_URL = '/productos.json';

export const cargarProductos = async () => {
  try {
    const response = await fetch(PRODUCTOS_URL);
    const data = await response.json();
    return data.productos;
  } catch (error) {
    console.error('Error al cargar productos:', error);
    return [];
  }
};

export const obtenerProductoPorId = async (id) => {
  const productos = await cargarProductos();
  return productos.find(p => p.id === parseInt(id));
};

export const buscarProductos = async (termino = '', categoria = '') => {
  const productos = await cargarProductos();
  return productos.filter(p => 
    (!termino || p.nombre.toLowerCase().includes(termino.toLowerCase())) &&
    (!categoria || p.categoria === categoria)
  );
}; 