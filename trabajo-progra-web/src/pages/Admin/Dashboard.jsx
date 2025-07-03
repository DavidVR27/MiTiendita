import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    setOrdenes(JSON.parse(localStorage.getItem('ordenes') || '[]'));
    setUsuarios(JSON.parse(localStorage.getItem('usuarios') || '[]'));
  }, []);

  const ingresosTotales = ordenes.reduce((acc, orden) => acc + (orden.resumenCompra?.total || 0), 0);
  const usuariosNuevos = usuarios.length;
  const totalOrdenes = ordenes.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-3xl font-bold text-[#FE624C]">{totalOrdenes}</div>
          <div className="text-gray-600">Órdenes totales</div>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-3xl font-bold text-[#FE624C]">{usuariosNuevos}</div>
          <div className="text-gray-600">Usuarios registrados</div>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-3xl font-bold text-[#FE624C]">S/ {ingresosTotales.toFixed(2)}</div>
          <div className="text-gray-600">Ingresos totales</div>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Resumen rápido</h2>
        <ul className="list-disc pl-6">
          <li>Órdenes recientes: {ordenes.slice(-5).map((o, i) => <span key={i} className="ml-2">#{ordenes.length - i}</span>)}</li>
          <li>Usuarios nuevos: {usuariosNuevos}</li>
          <li>Ingresos del mes: S/ {ingresosTotales.toFixed(2)}</li>
        </ul>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/admin/lista-producto" className="px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600">Gestionar Productos</Link>
        <Link to="/admin/crear-categoria" className="px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600">Gestionar Categorías</Link>
        <Link to="/admin/lista-usuarios" className="px-6 py-3 bg-purple-500 text-white rounded shadow hover:bg-purple-600">Gestionar Usuarios</Link>
      </div>
    </div>
  );
};

export default Dashboard; 