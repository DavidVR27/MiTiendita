import React from "react";
import Boton from "../../../components/Misagel/Boton";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../../../Components/Misagel/Tabla";

const ordenes = [
  {
    numeroDeOrden: "#1111",
    usuario: "Juan Perez",
    fechaDeOrden: "20/01/2025",
    total: 199,
    estado: "Entregado",
  },
  {
    numeroDeOrden: "#1112",
    usuario: "Juan Perez",
    fechaDeOrden: "20/01/2025",
    total: 199,
    estado: "Por entregar",
  },
  {
    numeroDeOrden: "#1113",
    usuario: "Juan Perez",
    fechaDeOrden: "20/01/2025",
    total: 199,
    estado: "Entregado",
  },
  {
    numeroDeOrden: "#1114",
    usuario: "Juan Perez",
    fechaDeOrden: "20/01/2025",
    total: 199,
    estado: "Por entregar",
  },
  {
    numeroDeOrden: "#1115",
    usuario: "Juan Perez",
    fechaDeOrden: "20/01/2025",
    total: 199,
    estado: "Entregado",
  },
];

export default function MisOrdenes() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <div className="p-4">
      <h2 className="font-bold text-2xl mt-4">Hola {usuario.nombre} !</h2>
      <div className="px-4 mt-4">
        <div className="flex justify-between">
          <div className="border w-[318px] h-[157px]">
            <div className="text-sm flex flex-col justify-center gap-2 px-4 h-full">
              <p className="font-bold text-base">Datos personales</p>
              <p>
                <span className="font-semibold">Nombre:</span> {usuario.nombre}
              </p>
              <p>
                <span className="font-semibold">Correo:</span> <span className="underline">{usuario.correo}</span>
              </p>
              <p>
                <span className="font-semibold">Fecha de registro:</span> 20/01/2025
              </p>
            </div>
          </div>
          <div className="border w-[318px] h-[157px]">
            <div className="text-sm flex flex-col justify-center gap-2 px-4 h-full">
              <p className="font-bold text-base">Dirección de envío</p>
              <p>Av la molina 12334</p>
              <p>Lima - Lima</p>
              <p>Celular de contacto: 99089213</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-[246px] h-[72px] flex items-center justify-between px-4 bg-red-600 text-white rounded-md">
              <span>Ordenes</span>
              <span className="font-bold text-xl">12</span>
            </div>
            <div className="w-[246px] h-[72px] flex items-center justify-between px-4 bg-red-600 text-white rounded-md">
              <span>Monto ahorrado</span>
              <span className="font-bold text-xl">S/129</span>
            </div>
          </div>
          <img
            src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyZmlsfGVufDB8fDB8fHww"
            className="size-[146px] rounded-full object-cover"
            alt="Perfil de usuario"
          />
        </div>

        <p className="font-bold text-xl mt-4">Tus órdenes</p>

        <div className="flex gap-4 mt-4">
          <input type="search" placeholder="Buscar una orden..." className="border border-black/50 w-full px-4 py-2 rounded-md" />
          <Boton texto="Buscar" className="px-8" />
        </div>

        <div className="border rounded-xl mt-4 border-black/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">#ORDEN</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Fecha de órden</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenes.map((orden) => (
                <TableRow key={orden.numeroDeOrden}>
                  <TableCell className="text-red-500 font-extrabold">{orden.numeroDeOrden}</TableCell>
                  <TableCell>{orden.usuario}</TableCell>
                  <TableCell>{orden.fechaDeOrden}</TableCell>
                  <TableCell className="text-right">S/{orden.total}</TableCell>
                  <TableCell className={`text-center font-bold ${orden.estado === "Entregado" ? "text-green-600" : "text-red-500"}`}>
                    {orden.estado}
                  </TableCell>
                  <TableCell className="text-right">
                    <Boton texto="Ver detalle" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
