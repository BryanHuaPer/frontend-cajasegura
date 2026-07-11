import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    // Se añade dark:bg-slate-950 para el fondo en modo oscuro
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Navbar de la Landing */}
      <header className="px-6 lg:px-14 h-16 flex items-center border-b dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm transition-colors duration-300">
        <h1 className="font-extrabold text-2xl text-blue-600 tracking-tight">CajaSegura</h1>
        <nav className="ml-auto flex gap-4 items-center">

          <Link href="/login">
            <Button className="font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              Iniciar Sesión
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 md:px-6 mt-16 md:mt-24">
        <BadgeBeta />
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white mt-6 max-w-4xl transition-colors duration-300">
          Controla tu <span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Caja Chica</span> con Inteligencia Artificial
        </h2>
        <p className="mx-auto max-w-[700px] text-slate-500 dark:text-slate-400 md:text-xl mt-6 transition-colors duration-300">
          El primer SaaS financiero diseñado para MyPES. Escanea comprobantes, detecta fugas de dinero y recibe auditorías automatizadas sin saber de contabilidad.
        </p>
        <div className="flex gap-4 mt-8">
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 shadow-lg text-white">
              Empezar ahora
            </Button>
          </Link>
        </div>

        {/* Tarjetas de Beneficios */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 mb-16 max-w-6xl w-full text-left">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 transition-colors duration-300">
            <CardHeader><CardTitle className="text-blue-600 dark:text-blue-400">OCR Multimodal</CardTitle></CardHeader>
            <CardContent><p className="text-slate-600 dark:text-slate-400">Sube fotos o pega textos de Yape/Plin. Nuestra IA extrae el monto y la categoría al instante.</p></CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 transition-colors duration-300">
            <CardHeader><CardTitle className="text-blue-600 dark:text-blue-400">Aislamiento Total</CardTitle></CardHeader>
            <CardContent><p className="text-slate-600 dark:text-slate-400">Arquitectura Multi-tenant estricta. Los datos de tu negocio están cifrados y separados del resto.</p></CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900 transition-colors duration-300">
            <CardHeader><CardTitle className="text-blue-600 dark:text-blue-400">Auditorías Predictivas</CardTitle></CardHeader>
            <CardContent><p className="text-slate-600 dark:text-slate-400">Detecta gastos hormiga y proyecta tu liquidez mensual con análisis impulsados por Gemini 1.5.</p></CardContent>
          </Card>
        </div>
      </main>

      {/* Footer corporativo */}
      <footer className="py-8 w-full shrink-0 border-t dark:border-slate-800 mt-auto bg-slate-900 dark:bg-black flex flex-col justify-center items-center px-4 transition-colors duration-300">
        <p className="text-sm text-slate-400">
          © 2026 CajaSegura SaaS. Proyecto de Ingeniería en Informática y Sistemas.
        </p>
      </footer>

      <div className="fixed bottom-6 left-6 z-50">
        <ThemeToggle />
      </div>

    </div>
  );
}

function BadgeBeta() {
  return (
    <span className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300 transition-colors duration-300">
      🚀 Versión 1.0 ya disponible
    </span>
  );
}