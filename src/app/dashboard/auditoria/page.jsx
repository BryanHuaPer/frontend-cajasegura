"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Sparkles, Loader2, FileText, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AuditoriaPage() {
  const [reporte, setReporte] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);
  const [generadoEn, setGeneradoEn] = useState(null); // timestamp del último reporte

  const generarAuditoria = async () => {
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
        setGeneradoEn(new Date());
      } else {
        setError(true);
        setReporte("No se pudo generar la auditoría. Verifica que haya movimientos registrados.");
      }

    } catch (err) {
      setError(true);
      setReporte("Error de red conectando con el servidor de Inteligencia Artificial.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">

      {/* CABECERA */}
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
      </div>

      {/* TARJETA DE ACCIÓN */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-2xl pointer-events-none"></div>

        <CardHeader className="relative z-10">
          <CardTitle className="text-xl dark:text-white">Generar Reporte de Análisis</CardTitle>
          <CardDescription className="dark:text-slate-400 text-base">
            El motor de Gemini leerá todos los ingresos y egresos de tu turno para encontrar patrones, detectar anomalías y brindarte 3 recomendaciones estratégicas.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Button
            onClick={generarAuditoria}
            disabled={cargando}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium h-12 px-8 shadow-md transition-all"
          >
            {cargando ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analizando bóveda financiera...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Ejecutar Auditoría con Gemini
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* SKELETON LOADER mientras Gemini trabaja */}
      {cargando && (
        <div className="space-y-4 animate-pulse">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
          </div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4 mt-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-purple-100 dark:bg-purple-900/20 rounded w-full"></div>
            <div className="h-4 bg-purple-100 dark:bg-purple-900/20 rounded w-5/6"></div>
            <div className="h-4 bg-purple-100 dark:bg-purple-900/20 rounded w-3/6"></div>
          </div>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
            ⏳ Gemini está analizando tu bóveda financiera...
          </p>
        </div>
      )}

      {/* ÁREA DE RESULTADOS (Empty State o Reporte) */}
      {!reporte && !cargando && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full mb-4">
            <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aún no hay reportes generados</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2">
            Haz clic en el botón superior para que la inteligencia artificial consolide tus datos financieros.
          </p>
        </div>
      )}

      {reporte && (
        <Card className={`mt-6 shadow-lg overflow-hidden border-t-4 ${error ? 'border-t-red-500 dark:bg-slate-900' : 'border-t-purple-600 dark:bg-slate-900 dark:border-slate-800'}`}>
          <CardHeader className={`${error ? 'bg-red-50 dark:bg-red-900/10' : 'bg-purple-50 dark:bg-purple-900/10'} border-b border-slate-100 dark:border-slate-800`}>
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 ${error ? 'text-red-700 dark:text-red-400' : 'text-purple-800 dark:text-purple-300'}`}>
                {error ? <AlertCircle className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
                {error ? "Fallo en el Análisis" : "Dictamen Financiero IA"}
              </CardTitle>
              {generadoEn && !error && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Generado a las {generadoEn.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {error ? (
              <p className="text-slate-700 dark:text-slate-300">{reporte}</p>
            ) : (
              /* ESTILOS TIPOGRÁFICOS PARA EL MARKDOWN DE GEMINI */
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
      )}
    </div>
  );
}