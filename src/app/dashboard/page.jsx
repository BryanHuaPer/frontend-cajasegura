"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardPage() {
  const [textoTicket, setTextoTicket] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  
  // Estados para datos reales
  const [transacciones, setTransacciones] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [saldoInicial, setSaldoInicial] = useState(0);

  const [modalApertura, setModalApertura] = useState(false);
  const [montoApertura, setMontoApertura] = useState("");
  const [cargandoApertura, setCargandoApertura] = useState(false);

  // 1. Cargar datos reales al iniciar la pantalla
  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem("token_caja");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (!data.cash_session_id) {
        setModalApertura(true);
      } else {
        setModalApertura(false);
        setSessionId(data.cash_session_id);
        setSaldoInicial(data.opening_balance);
        setTransacciones(data.transactions);
      }
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  useEffect(() => {
    // Carga inicial inmediata
    cargarDatos();

    // Auto-refresco silencioso: Pregunta al servidor cada 5 segundos
    const intervalo = setInterval(() => {
      cargarDatos();
    }, 5000);

    // Limpieza cuando el usuario sale de la página
    return () => clearInterval(intervalo);
  }, []);

  const handleProcesarTicket = async () => {
    if (!textoTicket) return;
    setCargando(true);
    setMensaje("Enviando al servidor...");

    try {
      const token = localStorage.getItem("token_caja");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tickets/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ticket_text: textoTicket,
          cash_session_id: sessionId // <--- ¡Usamos el UUID real de la Base de Datos!
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("¡Éxito! " + data.message);
        setTimeout(() => {
          setModalAbierto(false); 
          setTextoTicket("");
          setMensaje("");
          // Refrescamos la tabla para ver el nuevo gasto
          cargarDatos(); 
        }, 2000);
      } else {
        setMensaje("Error: No se pudo procesar.");
      }
    } catch (error) {
      setMensaje("Error de red.");
    } finally {
      setCargando(false);
    }
  };

  const handleAbrirCaja = async () => {
    if (!montoApertura || isNaN(montoApertura)) return;
    setCargandoApertura(true);

    try {
      const token = localStorage.getItem("token_caja");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/open`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ opening_balance: parseFloat(montoApertura) }),
      });

      if (response.ok) {
        setMontoApertura("");
        cargarDatos(); // Recargamos para que quite el modal y muestre la tabla
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoApertura(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Caja Chica</h2>
          <p className="text-slate-500">Gestiona los ingresos y egresos de tu turno.</p>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setModalAbierto(true)}>
          + Escanear Ticket con IA
        </Button>

        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Procesar Comprobante</DialogTitle>
              <DialogDescription>
                Pega el texto del Yape, Plin o factura. La IA extraerá los datos.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea 
                placeholder="Ej: Yape de S/ 45.50 por pago de almuerzo..." 
                value={textoTicket}
                onChange={(e) => setTextoTicket(e.target.value)}
                rows={4}
              />
              {mensaje && <p className="text-sm font-medium text-blue-600">{mensaje}</p>}
            </div>
            <DialogFooter>
              <Button disabled={cargando} onClick={handleProcesarTicket}>
                {cargando ? "Procesando en cola..." : "Enviar a Gemini"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL DE APERTURA DE CAJA (Bloqueante) */}
        <Dialog open={modalApertura} onOpenChange={() => {}}>
          {/* El onOpenChange vacío evita que el usuario lo cierre haciendo clic afuera */}
          <DialogContent className="sm:max-w-[400px] [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="text-2xl text-blue-600">Apertura de Caja</DialogTitle>
              <DialogDescription>
                Para empezar tu turno, ingresa el dinero exacto con el que estás abriendo la caja física.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Monto base (Soles)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">S/</span>
                  <input 
                    type="number" 
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm pl-8 outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700"
                    placeholder="Ej: 150.00" 
                    value={montoApertura}
                    onChange={(e) => setMontoApertura(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button disabled={cargandoApertura || !montoApertura} onClick={handleAbrirCaja} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {cargandoApertura ? "Abriendo..." : "Confirmar Apertura"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Saldo Inicial</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {parseFloat(saldoInicial).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Transacciones Registradas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{transacciones.length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Últimos Movimientos Reales</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Descripción</TableHead><TableHead>Categoría</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader>
            <TableBody>
              {transacciones.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-6">No hay transacciones aún.</TableCell></TableRow>
              ) : (
                transacciones.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-slate-600">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell><Badge variant={t.type === "income" ? "outline" : "secondary"}>{t.category}</Badge></TableCell>
                    <TableCell className={`text-right font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                      {t.type === "income" ? "+" : "-"} S/ {parseFloat(t.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}