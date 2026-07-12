"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Wallet, BrainCircuit, LogOut, LayoutDashboard, Menu, X } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [autorizado, setAutorizado] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");

  // Nuevo estado para controlar el menú en celulares
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token_caja");
    const nombre = localStorage.getItem("usuario_nombre");

    if (!token) {
      router.push("/login");
    } else {
      setAutorizado(true);
      if (nombre) setNombreUsuario(nombre);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!autorizado) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* NAVBAR SUPERIOR */}
      <nav className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="px-4 sm:px-6 h-16 flex justify-between items-center max-w-7xl mx-auto">

          {/* LOGO (Visible en todas las pantallas) */}
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500">
            <Wallet className="w-6 h-6" />
            <h1 className="text-xl font-extrabold tracking-tight">CajaSegura</h1>
          </div>

          {/* ENLACES CENTRALES (Ocultos en móvil, visibles en PC) */}
          <div className="hidden md:flex gap-2">
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

          {/* ZONA DE USUARIO Y SALIR (Oculta en móvil, visible en PC) */}
          <div className="hidden md:flex gap-4 items-center">
            <div className="flex items-center pl-4 border-l border-slate-200 dark:border-slate-700">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-4">
                Hola, {nombreUsuario}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>

          {/* BOTÓN MENÚ HAMBURGUESA (Solo visible en móviles) */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="text-slate-500 hover:text-blue-600 dark:text-slate-400 p-2"
            >
              {menuMovilAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* =========================================
            MENÚ DESPLEGABLE PARA MÓVILES
        ========================================= */}
        {menuMovilAbierto && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1 shadow-lg">

            {/* Saludo en Móvil */}
            <div className="px-3 py-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Cajero Activo</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{nombreUsuario}</p>
            </div>

            <Link
              href="/dashboard"
              onClick={() => setMenuMovilAbierto(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-md font-medium text-base transition-colors ${pathname === "/dashboard"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
            >
              <LayoutDashboard className="w-5 h-5" /> Caja Chica
            </Link>

            <Link
              href="/dashboard/auditoria"
              onClick={() => setMenuMovilAbierto(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-md font-medium text-base transition-colors ${pathname === "/dashboard/auditoria"
                  ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
            >
              <BrainCircuit className="w-5 h-5" /> Auditoría IA
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-3 py-3 mt-2 rounded-md font-medium text-base text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/10 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}