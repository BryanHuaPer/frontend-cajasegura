"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuditoriaPage() {
  const [reporte, setReporte] = useState("");
  const [cargando, setCargando] = useState(false);

  const generarAuditoria = async () => {
    setCargando(true);
    setReporte("Gemini está analizando toda la base de datos financiera... esto puede tomar unos segundos.");
    
    try {
      const token = localStorage.getItem("token_caja");
      const res = await fetch("${process.env.NEXT_PUBLIC_BACKEND_URL}/api/audits/generate", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      
      setReporte(data.audit_report);
    } catch (error) {
      setReporte("Error conectando con el servidor de IA.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Auditoría Predictiva IA</h2>
        <p className="text-slate-500">Analiza tus operaciones para detectar fugas de dinero.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generar Reporte Mensual</CardTitle>
          <CardDescription>
            La IA leerá todos tus ingresos y egresos para encontrar patrones y darte recomendaciones estratégicas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generarAuditoria} disabled={cargando} className="bg-purple-600 hover:bg-purple-700">
            {cargando ? "Analizando bóveda..." : "Generar Auditoría con Gemini"}
          </Button>
        </CardContent>
      </Card>

      {reporte && (
        <Card className="mt-6 border-purple-200 shadow-md">
          <CardHeader className="bg-purple-50 rounded-t-lg border-b border-purple-100">
            <CardTitle className="text-purple-800">Resultado del Análisis</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700">
              {reporte}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}