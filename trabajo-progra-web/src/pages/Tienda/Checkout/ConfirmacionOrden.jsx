import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import Boton from '../../../Components/Boton';
import { carritoService } from '../../../services/carritoService';
import { ordenService } from '../../../services/ordenService';

const ConfirmacionOrden = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        const crearOrden = async () => {
            const carrito = carritoService.obtenerCarritoDesdeAPI(usuario.id);
            const datosEnvio = JSON.parse(localStorage.getItem('datosEnvio') || '{}');
            const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

            if (!usuario || !usuario.id) {
                setError('Debes iniciar sesión para realizar un pedido.');
                return;
            }

            const total = carrito.reduce((acc, item) => {
                const precioConDescuento = item.descuento
                    ? item.precio * (1 - item.descuento)
                    : item.precio;
                return acc + (precioConDescuento * item.cantidad);
            }, 0);

            const nuevaOrden = {
                usuarioId: usuario.id,
                direccion: datosEnvio.direccion,
                ciudad: datosEnvio.ciudad,
                departamento: datosEnvio.departamento,
                codigoPostal: datosEnvio.codigoPostal,
                telefono: datosEnvio.telefono,
                items: carrito.map(item => ({
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    precio: parseFloat(item.Producto?.precio || 0),
                })),
                total,
            };

            try {
                await ordenService.crearOrden(nuevaOrden);
                carritoService.vaciarCarrito();
                localStorage.removeItem('datosEnvio');
                localStorage.removeItem('metodoPago');
                localStorage.removeItem('metodoEnvio');
            } catch (err) {
                setError('Hubo un error al procesar tu orden. Por favor, inténtalo de nuevo.');
                console.error(err);
            }
        };

        crearOrden();
    }, []);

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold mb-4 text-red-600">{error}</h1>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[#FE624C] hover:text-[#e5533d] font-medium mt-4"
                    >
                        Ir a iniciar sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">¡Pedido Confirmado!</h1>
                <p className="text-gray-600 mb-8">
                    Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
                    Te enviaremos un correo electrónico con los detalles de tu compra.
                </p>
                <div className="space-y-4">
                    <Boton
                        texto="Ver Historial de Pedidos"
                        onClick={() => navigate('/historial-pedidos')}
                    />
                    <button
                        onClick={() => navigate('/')}
                        className="text-[#FE624C] hover:text-[#e5533d] font-medium"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmacionOrden; 