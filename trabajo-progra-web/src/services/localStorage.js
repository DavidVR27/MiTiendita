/**
 * Servicio para manejar el almacenamiento local
 */

// Guardar datos en localStorage
export const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
    return false;
  }
};

// Obtener datos del localStorage
export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error al obtener de localStorage:', error);
    return null;
  }
};

// Eliminar datos del localStorage
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error al eliminar de localStorage:', error);
    return false;
  }
};

// Limpiar todo el localStorage
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
    return false;
  }
};

// Verificar si existe una clave en localStorage
export const hasKey = (key) => {
  return localStorage.getItem(key) !== null;
};

// Obtener todas las claves almacenadas
export const getAllKeys = () => {
  return Object.keys(localStorage);
};

const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

const agregarAlCarrito = (e) => {
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const productoEnCarrito = carrito.find(p => p.id === producto.id);
  
  if (productoEnCarrito) {
    productoEnCarrito.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }
  
  localStorage.setItem('carrito', JSON.stringify(carrito));
};