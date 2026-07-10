"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState(""); 

  useEffect(() => {
    const token = localStorage.getItem("token_caja");
    const nombre = localStorage.getItem("usuario_nombre"); 

    if (!token) {
      router.push("/");
    } else {
      setAutorizado(true);
      if (nombre) setNombreUsuario(nombre);
    }
  }, [router]);

  if (!autorizado) return null; 

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">CajaSegura</h1>
        <div className="flex gap-4 items-center">
          <a href="/dashboard" className="hover:text-blue-400 font-medium">Caja Chica</a>
          <a href="/dashboard/auditoria" className="hover:text-blue-400 font-medium">Auditoría IA</a>
          
          {/* Mostramos el nombre aquí */}
          <span className="text-slate-400 ml-4 border-l border-slate-700 pl-4">
            Hola, {nombreUsuario}
          </span>

          <button 
            onClick={() => { localStorage.clear(); router.push("/"); }} 
            className="text-red-400 hover:text-red-300 font-medium ml-4"
          >
            Salir
          </button>
        </div>
      </nav>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}