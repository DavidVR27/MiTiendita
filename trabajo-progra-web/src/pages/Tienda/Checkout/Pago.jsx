import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Boton from '../../../Components/Boton';
import { FaCreditCard, FaQrcode, FaShoppingCart, FaCheck, FaTruck, FaPaypal } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

const Pago = () => {
    const navigate = useNavigate();
    const [metodoPago, setMetodoPago] = useState('tarjeta');
    const [qrGenerado, setQrGenerado] = useState(false);
    const [total, setTotal] = useState(0);
    const [totalDescuento, setTotalDescuento] = useState(0);
    const [totalProductos, setTotalProductos] = useState(0);
    const [formData, setFormData] = useState({
        numeroTarjeta: '',
        nombreTarjeta: '',
        fechaVencimiento: '',
        cvv: ''
    });

    useEffect(() => {
        // Obtener datos del carrito
        const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
        const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const descuentoCarrito = carrito.reduce((acc, item) => {
            if (item.descuento) {
                return acc + (item.precio * item.descuento * item.cantidad);
            }
            return acc;
        }, 0);
        
        setTotal(totalCarrito);
        setTotalDescuento(descuentoCarrito);
        setTotalProductos(carrito.length);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validarFormulario = () => {
        if (metodoPago === 'tarjeta') {
            const camposRequeridos = ['numeroTarjeta', 'nombreTarjeta', 'fechaVencimiento', 'cvv'];
            const camposFaltantes = camposRequeridos.filter(campo => !formData[campo]);
            
            if (camposFaltantes.length > 0) {
                alert('Por favor complete todos los datos de la tarjeta');
                return false;
            }
        }
        return true;
    };

    const handlePagoTarjeta = (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            // Aquí iría la lógica de procesamiento del pago con tarjeta
            navigate('/confirmacion-orden');
        }
    };

    const handlePagoQR = () => {
        setQrGenerado(true);
        // Simulamos un tiempo de espera para el pago con QR
        setTimeout(() => {
            navigate('/confirmacion-orden');
        }, 3000);
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
                                    className={`flex-1 p-4 border rounded-lg ${
                                        metodoPago === 'tarjeta'
                                            ? 'border-[#FE624C] bg-[#FE624C] text-white'
                                            : 'border-gray-300'
                                    }`}
                                    onClick={() => setMetodoPago('tarjeta')}
                                >
                                    Tarjeta de Crédito/Débito
                                </button>
                                <button
                                    className={`flex-1 p-4 border rounded-lg ${
                                        metodoPago === 'qr'
                                            ? 'border-[#FE624C] bg-[#FE624C] text-white'
                                            : 'border-gray-300'
                                    }`}
                                    onClick={() => setMetodoPago('qr')}
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
                                            />
                                        </div>
                                    </div>
                                    <Boton
                                        texto="Confirmar Pago"
                                        type="submit"
                                    />
                                </form>
                            ) : (
                                <div className="text-center">
                                    {!qrGenerado ? (
                                        <button
                                            onClick={handlePagoQR}
                                            className="bg-[#FE624C] text-white px-6 py-3 rounded-lg hover:bg-[#e5533d] transition-colors"
                                        >
                                            Generar Código QR
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
                            <div className="mt-6">
                                <Boton
                                    texto="Confirmar Pago"
                                    onClick={metodoPago === 'tarjeta' ? handlePagoTarjeta : handlePagoQR}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pago;
