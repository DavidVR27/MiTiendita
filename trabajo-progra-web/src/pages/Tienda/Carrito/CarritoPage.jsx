import React, { useState, useEffect } from 'react';
import Carrito from './Carrito';
import './CarritoPage.css';
import Boton from '../../../Components/Boton';
import { useNavigate } from 'react-router-dom';
import { carritoService } from '../../../services/carritoService';
import { FaShoppingCart, FaTruck, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

const CarritoPage = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  // variables de estado que se inicializan en 0
  const [total, setTotal] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalDescuento, setTotalDescuento] = useState(0);
  const [cantidadItems, setCantidadItems] = useState(0);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  // se ejecuta una sola vez al inicio
  useEffect(() => {
    const cargarCarrito = async () => {
      try {
        if (usuario && usuario.id) {
          // Obtener el carrito usando el servicio correcto
          const carrito = await carritoService.obtenerCarritoDesdeAPI(usuario.id);
          setCantidadItems(carrito.length);
        } else {
          // Si no hay usuario, el carrito está vacío
          setCantidadItems(0);
        }
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        setCantidadItems(0);
      } finally {
        setLoading(false);
      }
    };

    cargarCarrito();
  }, [usuario]);

  const handleProcederPago = () => {
    if (!usuario) {
      alert('Debes iniciar sesión para proceder con el pago');
      navigate('/login');
      return;
    }
    navigate('/tienda/checkout/direccion');
  };

  // Mostrar loading mientras se carga el carrito
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FE624C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Process Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center relative">
                <div className="rounded-full h-10 w-10 py-3 px-3 bg-[#FE624C] text-white font-bold border-2 border-[#FE624C]">
                  <FaShoppingCart className="h-full w-full" />
                </div>
                <div className="absolute top-0 left-0 mt-12 w-32 text-center text-sm font-medium text-[#FE624C]">
                  Carrito
                </div>
              </div>
              <div className="flex-auto border-t-2 border-[#FE624C] w-32"></div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center relative">
                <div className="rounded-full h-10 w-10 py-3 px-3 bg-gray-300 text-white font-bold border-2 border-gray-300">
                  <FaTruck className="h-full w-full" />
                </div>
                <div className="absolute top-0 left-0 mt-12 w-32 text-center text-sm font-medium text-gray-500">
                  Envío
                </div>
              </div>
              <div className="flex-auto border-t-2 border-gray-300 w-32"></div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center relative">
                <div className="rounded-full h-10 w-10 py-3 px-3 bg-gray-300 text-white font-bold border-2 border-gray-300">
                  <FaCreditCard className="h-full w-full" />
                </div>
                <div className="absolute top-0 left-0 mt-12 w-32 text-center text-sm font-medium text-gray-500">
                  Pago
                </div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Carrito de Compras</h1>
        <p className="text-gray-600 mb-6 text-xl">Tienes {cantidadItems} ítems</p>

        {/* Contenedor principal en fila siempre */}
        <div className="flex flex-row items-start gap-6">
          {/* Sección izquierda: Productos */}
          <div className="w-3/5">
            <div className="bg-white shadow-md rounded-lg p-4">
              <Carrito 
                actualizarTotal={setTotal} 
                actualizarTotalProductos={setTotalProductos}
                actualizarTotalDescuento={setTotalDescuento}
                actualizarCantidadItems={setCantidadItems}
              />
            </div>
          </div>

          {/* Sección derecha: Resumen del carrito */}
          <div className="w-2/5">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Resumen de la compra</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalProductos} Productos)</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Descuento</span>
                  <span className="text-red-500 font-bold">-S/ {totalDescuento.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Entrega</span>
                  <span className="text-green-500 font-bold">GRATIS</span>
                </div>
                <hr className="my-5 border-gray-200" />
                <div className="flex justify-between text-gray-800 font-semibold text-xl">
                  <span>TOTAL</span>
                  <span>S/ {(total - totalDescuento).toFixed(2)}</span>
                </div>
                <div className="mt-6">
                  <Boton
                    texto={usuario ? "Proceder al Pago" : "Iniciar sesión para continuar"}
                    onClick={handleProcederPago}
                    className="w-full py-3 text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarritoPage;