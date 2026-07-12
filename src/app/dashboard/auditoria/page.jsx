"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Sparkles, Loader2, FileText, AlertCircle, Lock, Crown, PieChartIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function AuditoriaPage() {
  const [reporte, setReporte] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);

  // Estados comerciales y de datos
  const [plan, setPlan] = useState("pro");
  const [creditos, setCreditos] = useState(5);
  const [transacciones, setTransacciones] = useState([]);

  // Colores profesionales para el gráfico
  const COLORES = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

  useEffect(() => {
    // 1. Cargar el plan y los créditos del LocalStorage
    const planGuardado = localStorage.getItem("cs_plan") || "pro";
    const creditosGuardados = localStorage.getItem("cs_creditos");

    setPlan(planGuardado);
    if (creditosGuardados !== null) {
      setCreditos(parseInt(creditosGuardados));
    }

    // 2. Escuchar los cambios del "Botón Secreto" del Layout
    const handlePlanChange = () => {
      setPlan(localStorage.getItem("cs_plan") || "pro");
    };
    window.addEventListener("planChanged", handlePlanChange);

    // 3. Traer los datos limpios de Laravel para los gráficos
    cargarDatosParaGraficos();

    return () => window.removeEventListener("planChanged", handlePlanChange);
  }, []);

  const cargarDatosParaGraficos = async () => {
    try {
      const token = localStorage.getItem("token_caja");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.transactions) {
        setTransacciones(data.transactions);
      }
    } catch (error) {
      console.error("Error al cargar datos para gráficos:", error);
    }
  };

  const generarAuditoria = async () => {
    // Bloqueo Freemium
    if (plan === "free" && creditos <= 0) {
      return; // El botón estará deshabilitado, pero protegemos la función
    }

    setCargando(true);
    setError(false);

    try {
      const token = localStorage.getItem("token_caja");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audits/generate`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok && data.audit_report) {
        setReporte(data.audit_report);

        // Restar un crédito si es plan Free
        if (plan === "free") {
          const nuevosCreditos = creditos - 1;
          setCreditos(nuevosCreditos);
          localStorage.setItem("cs_creditos", nuevosCreditos);
        }
      } else {
        setError(true);
        setReporte(data.audit_report || data.message || "Error desconocido al procesar la auditoría.");
      }
    } catch (err) {
      setError(true);
      setReporte("Error de red conectando con tu servidor backend de Laravel.");
    } finally {
      setCargando(false);
    }
  };

  // Preparar datos matemáticos para el gráfico de torta (Solo Egresos)
  const gastosPorCategoria = transacciones
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});

  const datosGrafico = Object.keys(gastosPorCategoria).map((key) => ({
    name: key,
    value: gastosPorCategoria[key]
  }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">

      {/* CABECERA Y MEDIDOR DE CRÉDITOS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            Auditoría Predictiva IA
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Analiza tus operaciones para detectar fugas de dinero y proyectar tu liquidez.
          </p>
        </div>

        {/* Indicador de Plan / Créditos */}
        {plan === "free" ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Créditos IA:</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-4 rounded-sm ${i < creditos ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white ml-1">{creditos}/5</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
            <Crown className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Auditorías Ilimitadas</span>
          </div>
        )}
      </div>

      {/* RENDERIZADO CONDICIONAL: PAYWALL VS PANEL DE ACCIÓN */}
      {plan === "free" && creditos <= 0 ? (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-none shadow-xl overflow-hidden relative text-center py-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          <CardContent className="flex flex-col items-center pt-6">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-inner">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Límite Mensual Alcanzado</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-8 text-base">
              Has agotado tus 5 auditorías gratuitas del mes. Mejora tu cuenta para desbloquear a Gemini 2.5 de forma ilimitada y acceder a los gráficos interactivos.
            </p>
            <Button className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold h-12 px-8">
              <Crown className="w-5 h-5 mr-2" />
              Mejorar a PyME IA (S/39/mes)
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-2xl pointer-events-none"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl dark:text-white">Generar Reporte de Análisis</CardTitle>
            <CardDescription className="dark:text-slate-400 text-base">
              Gemini leerá tus ingresos y egresos para encontrar patrones, detectar anomalías y brindarte recomendaciones estratégicas.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button
              onClick={generarAuditoria}
              disabled={cargando}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium h-12 px-8 shadow-md transition-all"
            >
              {cargando ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Analizando bóveda financiera...</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" />Ejecutar Auditoría con Gemini</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ÁREA DE RESULTADOS */}
      {reporte && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* PANEL IZQUIERDO: EL GRÁFICO (Solo visible en plan Pro) */}
          {plan === "pro" && datosGrafico.length > 0 && (
            <Card className="lg:col-span-1 shadow-lg border-t-4 border-t-blue-500 dark:bg-slate-900 dark:border-slate-800">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-base">
                  <PieChartIcon className="w-5 h-5 text-blue-500" />
                  Distribución de Gastos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col items-center justify-center">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={datosGrafico}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {datosGrafico.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `S/ ${value.toFixed(2)}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PANEL DERECHO: EL REPORTE DE GEMINI */}
          <Card className={`shadow-lg overflow-hidden border-t-4 ${plan === "pro" ? 'lg:col-span-2' : 'lg:col-span-3'} ${error ? 'border-t-red-500 dark:bg-slate-900' : 'border-t-purple-600 dark:bg-slate-900 dark:border-slate-800'}`}>
            <CardHeader className={`${error ? 'bg-red-50 dark:bg-red-900/10' : 'bg-purple-50 dark:bg-purple-900/10'} border-b border-slate-100 dark:border-slate-800`}>
              <CardTitle className={`flex items-center gap-2 ${error ? 'text-red-700 dark:text-red-400' : 'text-purple-800 dark:text-purple-300'}`}>
                {error ? <AlertCircle className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
                {error ? "Fallo en el Análisis" : "Dictamen Financiero IA"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {error ? (
                <p className="text-slate-700 dark:text-slate-300">{reporte}</p>
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none 
                  prose-headings:text-purple-900 dark:prose-headings:text-purple-300 
                  prose-h2:text-2xl prose-h2:font-bold prose-h2:border-b prose-h2:pb-2 prose-h2:border-slate-200 dark:prose-h2:border-slate-800
                  prose-h3:text-xl prose-h3:font-semibold
                  prose-strong:text-slate-900 dark:prose-strong:text-white
                  prose-ul:list-disc prose-li:marker:text-purple-500
                  text-slate-700 dark:text-slate-300">
                  <ReactMarkdown>{reporte}</ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}