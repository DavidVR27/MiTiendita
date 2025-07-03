import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login/Login';
import Registro from './pages/Auth/Registro/Registro';
import Recuperar from './pages/Auth/Recuperar/Recuperar';
import CambiarContraseniaConCodigo from './pages/Auth/Cambiar-Contrasenia-Con-Codigo/CambiarContraseniaConCodigo';
import MisOrdenes from './pages/Tienda/Mis-Ordenes/MisOrdenes';
import Inicio from './pages/Tienda/Inicio/Inicio';
import Navbar from './pages/Tienda/Inicio/Navbar';
import CarritoPage from './pages/Tienda/Carrito/CarritoPage';
import DetalleProducto from './pages/Tienda/DetalleProducto/DetalleProducto';
import Categorias from './pages/Tienda/Categorias/Categorias';
import ListaProducto from './pages/Admin/ListaProducto/ListaProducto';
import EditarProducto from './pages/Admin/EditarProducto/EditarProducto';
import EliminarProducto from './pages/Admin/EliminarProducto/EliminarProducto';
import CrearCategoria from './pages/Admin/CrearCategoria/CrearCategoria';
import CrearProducto from './pages/Admin/CrearProducto/CrearProducto';
import Busqueda from './pages/Tienda/Busqueda/Busqueda';
import HistorialPedidos from './pages/Tienda/Checkout/HistorialPedidos';
import PerfilUsuario from './pages/Tienda/Perfil/PerfilUsuario';
import Dashboard from './pages/Admin/Dashboard';
import ListaCategoria from './pages/Admin/ListaCategoria';
import ListaUsuarios from './pages/Admin/ListaUsuarios';
import DetalleUsuario from './pages/Admin/DetalleUsuario';
import ProductosPorCategoria from './pages/Tienda/Categorias/ProductosPorCategoria';
import Direccion from './pages/Tienda/Checkout/Direccion';
import Pago from './pages/Tienda/Checkout/Pago';
import ConfirmacionOrden from './pages/Tienda/Checkout/ConfirmacionOrden';
import Footer from './Components/Footer';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="pt-16 flex-grow"> {/* Agregamos flex-grow para que el contenido ocupe el espacio disponible */}
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/recuperar" element={<Recuperar />} />
            <Route path="/cambiar-contrasenia-con-codigo" element={<CambiarContraseniaConCodigo />} />
            <Route path="/mis-ordenes" element={<MisOrdenes />} />
            <Route path="/carritopage" element={<CarritoPage />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/busqueda" element={<Busqueda />} />
            <Route path="/confirmacion-orden" element={<ConfirmacionOrden />} />
            <Route path="/historial-pedidos" element={<HistorialPedidos />} />
            <Route path="/perfil" element={<PerfilUsuario />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            {/* Rutas de administración */}
            <Route path="/admin/lista-producto" element={<ListaProducto />} />
            <Route path="/admin/editar-producto/:id" element={<EditarProducto />} />
            <Route path="/admin/eliminar-producto/:id" element={<EliminarProducto />} />
            <Route path="/admin/crear-categoria" element={<CrearCategoria />} />
            <Route path="/admin/crear-producto" element={<CrearProducto />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/lista-categorias" element={<ListaCategoria />} />
            <Route path="/admin/lista-usuarios" element={<ListaUsuarios />} />
            <Route path="/admin/detalle-usuario/:id" element={<DetalleUsuario />} />
            <Route path="/categoria/:nombreCategoria" element={<ProductosPorCategoria />} />
            <Route path="/tienda/checkout/direccion" element={<Direccion />} />
            <Route path="/tienda/checkout/pago" element={<Pago />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;