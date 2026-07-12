"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Wallet, BrainCircuit, LogOut, LayoutDashboard } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // Para saber en qué página estamos y pintar el menú
  const [autorizado, setAutorizado] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token_caja");
    const nombre = localStorage.getItem("usuario_nombre");

    if (!token) {
      router.push("/login"); // Es mejor enviarlos a /login directamente
    } else {
      setAutorizado(true);
      if (nombre) setNombreUsuario(nombre);
    }
  }, [router]);

  if (!autorizado) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* NAVBAR SUPERIOR */}
      <nav className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm px-6 h-16 flex justify-between items-center transition-colors duration-300">

        {/* LOGO Y ENLACES PRINCIPALES */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500">
            <Wallet className="w-6 h-6" />
            <h1 className="text-xl font-extrabold tracking-tight">CajaSegura</h1>
          </div>

          <div className="hidden md:flex gap-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors ${pathname === "/dashboard"
                ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Caja Chica
            </Link>

            <Link
              href="/dashboard/auditoria"
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors ${pathname === "/dashboard/auditoria"
                ? "bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
            >
              <BrainCircuit className="w-4 h-4" /> Auditoría IA
            </Link>
          </div>
        </div>

        {/* ZONA DE USUARIO Y ACCIONES */}
        <div className="flex gap-3 items-center">

          <div className="hidden sm:flex items-center pl-4 border-l border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-3">
              Hola, {nombreUsuario}
            </span>
          </div>

          <button
            onClick={() => { localStorage.clear(); router.push("/login"); }}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}