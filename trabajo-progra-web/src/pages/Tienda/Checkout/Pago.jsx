import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../../Components/Boton';
import { FaCreditCard, FaQrcode, FaShoppingCart, FaPaypal } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

import { ordenService } from "../../../services/ordenService";
import { carritoService } from "../../../services/carritoService";
import { useAuth } from '../../../context/AuthContext';

const Pago = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const procesandoRef = useRef(false); // ✅ Prevenir múltiples llamadas

  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [qrGenerado, setQrGenerado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [total, setTotal] = useState(0);
  const [totalDescuento, setTotalDescuento] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [carrito, setCarrito] = useState([]);

  const [formData, setFormData] = useState({
    numeroTarjeta: "",
    nombreTarjeta: "",
    fechaVencimiento: "",
    cvv: "",
  });

  useEffect(() => {
    const cargarCarrito = async () => {
      if (!usuario || !usuario.id) return;

      try {
        const data = await carritoService.obtenerCarritoDesdeAPI(usuario.id);
        setCarrito(data);

        const totalCarrito = data.reduce((acc, item) => {
          const precio = parseFloat(item.Producto?.precio || 0);
          return acc + precio * item.cantidad;
        }, 0);

        const descuentoCarrito = data.reduce((acc, item) => {
          const precio = parseFloat(item.Producto?.precio || 0);
          const descuento = parseFloat(item.Producto?.descuento || 0);
          return acc + precio * descuento * item.cantidad;
        }, 0);

        setTotal(totalCarrito);
        setTotalDescuento(descuentoCarrito);
        setTotalProductos(data.length);
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
      }
    };

    cargarCarrito();
  }, [usuario?.id]); // ✅ Mejor dependencia

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarFormulario = () => {
    if (metodoPago === "tarjeta") {
      const camposRequeridos = [
        "numeroTarjeta",
        "nombreTarjeta",
        "fechaVencimiento",
        "cvv",
      ];
      const camposFaltantes = camposRequeridos.filter((campo) => !formData[campo]);

      if (camposFaltantes.length > 0) {
        alert("Por favor complete todos los datos de la tarjeta");
        return false;
      }
    }
    return true;
  };

  const procesarPago = async () => {
    // ✅ Prevenir múltiples llamadas
    if (procesandoRef.current || isSubmitting) {
      console.log("Pago ya está siendo procesado");
      return;
    }

    procesandoRef.current = true;
    setIsSubmitting(true);

    try {
      const datosEnvio = JSON.parse(localStorage.getItem("datosEnvio") || "{}");

      // ✅ Validar que hay productos en el carrito
      if (!carrito || carrito.length === 0) {
        console.error("❌ [Pago] Error: Carrito vacío al intentar procesar el pago.");
        alert("No hay productos en el carrito para procesar el pago.");
        setIsSubmitting(false);
        procesandoRef.current = false;
        return;
      }

      // ✅ Calcular total correctamente
      const totalFinal = total - totalDescuento;

      // ✅ Estructura correcta para el backend
      const orden = {
        usuarioId: usuario.id,
        // ✅ Campos específicos que espera el backend
        direccion: datosEnvio.direccion || "",
        ciudad: datosEnvio.ciudad || "",
        departamento: datosEnvio.departamento || "",
        codigoPostal: datosEnvio.codigoPostal || "",
        telefono: datosEnvio.telefono || "",
        metodoPago: metodoPago,
        estado: 'Pendiente',
        total: totalFinal,
        items: carrito.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precio: parseFloat(item.Producto?.precio || 0),
        })),
      };

      console.log("📦 [Pago] Datos de la orden a enviar:", orden); // ✅ Debug detallado

      const resultado = await ordenService.crearOrden(orden);
      console.log("✅ [Pago] Orden creada exitosamente:", resultado); // ✅ Debug

      // ✅ Vaciar el carrito en el backend
      console.log("🗑️ [Pago] Intentando vaciar el carrito...");
      await carritoService.vaciarCarrito(usuario.id);
      console.log("✅ [Pago] Carrito vaciado exitosamente.");

      navigate("/confirmacion-orden");

    } catch (error) {
      console.error("❌ [Pago] Error al procesar el pago:", error);
      console.error("❌ [Pago] Detalles del error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      alert("Hubo un error al procesar su orden. Por favor, intente de nuevo.");
    } finally {
      setIsSubmitting(false);
      procesandoRef.current = false; // ✅ Resetear el flag
    }
  };

  const handlePagoTarjeta = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      procesarPago();
    }
  };

  const handlePagoQR = () => {
    setQrGenerado(true);
    // ✅ Usar setTimeout para evitar problemas de rendering
    setTimeout(() => {
      procesarPago();
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formulario de pago */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Método de Pago</h2>
            <div className="space-y-6">
              {/* Selector de método de pago */}
              <div className="flex gap-4">
                <button
                  className={`flex-1 p-4 border rounded-lg ${metodoPago === 'tarjeta' ? 'border-[#FE624C] bg-[#FE624C] text-white' : 'border-gray-300'}`}
                  onClick={() => setMetodoPago('tarjeta')}
                  disabled={isSubmitting}
                >
                  Tarjeta de Crédito/Débito
                </button>
                <button
                  className={`flex-1 p-4 border rounded-lg ${metodoPago === 'qr' ? 'border-[#FE624C] bg-[#FE624C] text-white' : 'border-gray-300'}`}
                  onClick={() => setMetodoPago('qr')}
                  disabled={isSubmitting}
                >
                  Pago con QR
                </button>
              </div>

              {metodoPago === 'tarjeta' ? (
                <form onSubmit={handlePagoTarjeta} className="space-y-6">
                  <div className="flex gap-6 mb-6">
                    <img src="/visa.png" alt="Visa" className="h-10" />
                    <img src="/mastercard.png" alt="Mastercard" className="h-10" />
                    <img src="/visa-electron.png" alt="Visa Electron" className="h-10" />
                    <FaPaypal className="text-blue-500 text-4xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Número de tarjeta</label>
                    <input
                      type="text"
                      name="numeroTarjeta"
                      value={formData.numeroTarjeta}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C] h-12 text-lg"
                      placeholder="1234 5678 9012 3456"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Nombre en la tarjeta</label>
                    <input
                      type="text"
                      name="nombreTarjeta"
                      value={formData.nombreTarjeta}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C] h-12 text-lg"
                      placeholder="JUAN PEREZ"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Fecha de vencimiento</label>
                      <input
                        type="text"
                        name="fechaVencimiento"
                        value={formData.fechaVencimiento}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C] h-12 text-lg"
                        placeholder="MM/AA"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FE624C] focus:ring-[#FE624C] h-12 text-lg"
                        placeholder="123"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <Boton
                    texto={isSubmitting ? "Procesando..." : "Confirmar Pago"}
                    type="submit"
                    disabled={isSubmitting}
                  />
                </form>
              ) : (
                <div className="text-center">
                  {!qrGenerado ? (
                    <button
                      onClick={handlePagoQR}
                      className="bg-[#FE624C] text-white px-6 py-3 rounded-lg hover:bg-[#e5533d] transition-colors disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Procesando..." : "Generar Código QR"}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <QRCodeSVG
                          value={`Pago de S/ ${(total - totalDescuento).toFixed(2)}`}
                          size={250}
                          className="mx-auto"
                        />
                      </div>
                      <p className="text-gray-600">
                        Escanea el código QR con tu aplicación de billetera móvil
                      </p>
                      {isSubmitting && (
                        <p className="text-[#FE624C] font-semibold">
                          Procesando pago...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resumen de la compra */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <FaShoppingCart className="text-[#FE624C] text-lg" />
              <h2 className="text-lg font-semibold">Resumen de la Compra</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalProductos} productos)</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Descuento</span>
                <span className="text-red-500">-S/ {totalDescuento.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-500">GRATIS</span>
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="flex justify-between font-semibold text-lg">
                <span>TOTAL</span>
                <span>S/ {(total - totalDescuento).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pago;