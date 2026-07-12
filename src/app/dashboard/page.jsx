"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Wallet, TrendingUp, TrendingDown, Receipt, Sparkles, Loader2, Plus, Lock, Crown } from "lucide-react";

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

  const [modalManual, setModalManual] = useState(false);
  const [cargandoManual, setCargandoManual] = useState(false);
  const [formManual, setFormManual] = useState({
    type: "income",
    amount: "",
    category: "Ventas",
    description: ""
  });

  const [modalCierre, setModalCierre] = useState(false);
  const [montoCierre, setMontoCierre] = useState("");
  const [cargandoCierre, setCargandoCierre] = useState(false);

  const categoriasPermitidas = [
    "Ventas", "Mercadería", "Movilidad", "Alimentación",
    "Suministros de Oficina", "Servicios", "Planilla", "Varios"
  ];

  const [plan, setPlan] = useState("pro");
  const [creditos, setCreditos] = useState(5);

  useEffect(() => {
    const planGuardado = localStorage.getItem("cs_plan") || "pro";
    const creditosGuardados = localStorage.getItem("cs_creditos");

    setPlan(planGuardado);
    if (creditosGuardados !== null) setCreditos(parseInt(creditosGuardados));

    const handlePlanChange = () => {
      setPlan(localStorage.getItem("cs_plan") || "pro");
      const c = localStorage.getItem("cs_creditos");
      if (c !== null) setCreditos(parseInt(c));
    };
    window.addEventListener("planChanged", handlePlanChange);
    return () => window.removeEventListener("planChanged", handlePlanChange);
  }, []);

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
        setTransacciones(data.transactions || []);
      }
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(() => {
      cargarDatos();
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const handleProcesarTicket = async () => {
    if (!textoTicket) return;
    setCargando(true);
    setMensaje("Analizando comprobante con IA...");

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
          cash_session_id: sessionId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("¡Éxito! " + data.message);

        if (plan === "free") {
          const nuevosCreditos = creditos - 1;
          setCreditos(nuevosCreditos);
          localStorage.setItem("cs_creditos", nuevosCreditos);
        }

        setTimeout(() => {
          setModalAbierto(false);
          setTextoTicket("");
          setMensaje("");
          setCargando(false);
          cargarDatos();
        }, 1500);
      } else {
        setMensaje("Error: " + (data.message || "No se pudo procesar."));
        setCargando(false);
      }
    } catch (error) {
      setMensaje("Error de red. Verifica tu conexión.");
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
        cargarDatos();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoApertura(false);
    }
  };

  const handleGuardarManual = async () => {
    if (!formManual.amount || isNaN(formManual.amount)) return;
    setCargandoManual(true);
    try {
      const token = localStorage.getItem("token_caja");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          cash_session_id: sessionId,
          amount: parseFloat(formManual.amount),
          type: formManual.type,
          category: formManual.category,
          description: formManual.description || "Ingreso manual"
        }),
      });

      if (response.ok) {
        setModalManual(false);
        setFormManual({ type: "income", amount: "", category: "Ventas", description: "" });
        cargarDatos();
      }
    } catch (error) {
      console.error("Error guardando manual", error);
    } finally {
      setCargandoManual(false);
    }
  };

  const handleCerrarCaja = async () => {
    if (!montoCierre || isNaN(montoCierre)) return;
    setCargandoCierre(true);
    try {
      const token = localStorage.getItem("token_caja");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          cash_session_id: sessionId,
          final_balance: parseFloat(montoCierre)
        }),
      });

      if (response.ok) {
        setModalCierre(false);
        setMontoCierre("");
        // Al recargar datos, la API dirá que no hay caja abierta y mostrará el modal de apertura
        cargarDatos();
      }
    } catch (error) {
      console.error("Error cerrando caja", error);
    } finally {
      setCargandoCierre(false);
    }
  };

  // Cálculos matemáticos en tiempo real
  const ingresos = transacciones.filter(t => t.type === 'income').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const egresos = transacciones.filter(t => t.type === 'expense').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const saldoActual = parseFloat(saldoInicial) + ingresos - egresos;

  return (
    <div className="space-y-8">

      {/* CABECERA Y BOTÓN DE IA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Resumen de Turno</h2>
            {/* Indicador de actualización en vivo */}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              En vivo
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Gestiona los ingresos y egresos de tu caja en tiempo real.</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Button
            onClick={() => setModalManual(true)}
            variant="outline"
            className="flex-1 md:flex-none bg-white dark:bg-slate-900 dark:border-slate-700 h-11"
          >
            <Plus className="w-4 h-4 mr-2" /> Manual
          </Button>

          <Button
            onClick={() => setModalAbierto(true)}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-md font-medium h-11"
          >
            <Sparkles className="w-4 h-4 mr-2 text-blue-200" />
            <span className="hidden sm:inline">Procesar con </span>IA
            {plan === "free" && (
              <span className="ml-2 bg-blue-500 text-blue-100 text-xs font-bold px-1.5 py-0.5 rounded">{creditos}</span>
            )}
          </Button>

          <Button
            onClick={() => setModalCierre(true)}
            variant="destructive"
            className="flex-1 md:flex-none h-11 bg-red-500 hover:bg-red-600 text-white shadow-md"
          >
            <Lock className="w-4 h-4 mr-2" /> Cerrar Turno
          </Button>
        </div>
      </div>

      {/* TARJETAS DE KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Saldo Inicial</CardTitle>
            <Wallet className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">S/ {parseFloat(saldoInicial).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Ingresos Totales</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+ S/ {ingresos.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Egresos Totales</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">- S/ {egresos.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className={`border-none shadow-md text-white ${saldoActual >= parseFloat(saldoInicial)
          ? "bg-blue-600 dark:bg-blue-700"
          : "bg-rose-600 dark:bg-rose-700"
          }`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-80">Saldo Actual Neto</CardTitle>
            <Receipt className="w-4 h-4 opacity-60" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">S/ {saldoActual.toFixed(2)}</div>
            <p className="text-xs mt-1 opacity-75">
              {saldoActual >= parseFloat(saldoInicial) ? "▲" : "▼"} vs. S/ {parseFloat(saldoInicial).toFixed(2)} inicial
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TABLA DE TRANSACCIONES */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-slate-900 dark:text-white">Últimos Movimientos</CardTitle>
          {transacciones.length > 0 && (
            <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full">
              {transacciones.length} registros
            </span>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent dark:border-slate-800">
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Fecha y Hora</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Descripción</TableHead>
                  <TableHead className="font-semibold text-slate-600 dark:text-slate-400">Categoría</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600 dark:text-slate-400">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacciones.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="text-center py-16">
                      <Receipt className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                      <p className="text-lg font-medium text-slate-900 dark:text-slate-200">Aún no hay movimientos</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">Escanea tu primer comprobante con IA para empezar.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  transacciones.map((t) => (
                    <TableRow key={t.id} className="dark:border-slate-800 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell className="font-medium text-slate-500 dark:text-slate-400 text-sm">
                        {new Date(t.created_at).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.type === "income" ? "bg-emerald-500" : "bg-red-500"
                            }`}></span>
                          <span className="text-slate-900 dark:text-slate-200 text-sm">{t.description || "Sin descripción"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-medium text-xs ${t.type === "income"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                        >
                          {t.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        <span className={t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                          {t.type === "income" ? "+" : "-"} S/ {parseFloat(t.amount).toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* =========================================
          MODAL: ESCANEAR TICKET CON IA
      ========================================= */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="sm:max-w-[450px] dark:bg-slate-900 dark:border-slate-800">
          {plan === "free" && creditos <= 0 ? (
            /* VISTA DE BLOQUEO (PAYWALL) */
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-slate-400" />
              </div>
              <DialogTitle className="text-xl mb-2">Límite de IA Alcanzado</DialogTitle>
              <DialogDescription className="mb-6">
                Has agotado tus 5 escaneos gratuitos. Para seguir digitalizando tus comprobantes automáticamente, mejora tu plan.
              </DialogDescription>
              <Button onClick={() => setModalAbierto(false)} className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold w-full">
                <Crown className="w-5 h-5 mr-2" /> Mejorar a PyME IA
              </Button>
            </div>
          ) : (
            /* VISTA NORMAL DEL ESCÁNER */
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center text-xl justify-between w-full">
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                    Asistente de Registro
                  </div>
                  {/* Etiqueta de créditos restantes */}
                  {plan === "free" && (
                    <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                      {creditos} créditos IA
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Pega el texto del Yape, Plin o detalla el gasto. La Inteligencia Artificial lo ordenará por ti.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea
                  placeholder="Ej: Yape de S/ 45.50 por pago de movilidad..."
                  value={textoTicket}
                  onChange={(e) => setTextoTicket(e.target.value)}
                  rows={5}
                  className="resize-none dark:bg-slate-800 dark:border-slate-700 focus-visible:ring-blue-600"
                  disabled={cargando}
                />
                {mensaje && (
                  <p className={`text-sm font-medium p-3 rounded-md ${mensaje.includes("Error") ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"}`}>
                    {mensaje}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  disabled={cargando || !textoTicket.trim()}
                  onClick={handleProcesarTicket}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {cargando ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                  ) : (
                    "Extraer y Guardar"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* =========================================
          MODAL 2: INGRESO MANUAL
      ========================================= */}
      <Dialog open={modalManual} onOpenChange={setModalManual}>
        <DialogContent className="sm:max-w-[400px] dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl">Registro Manual</DialogTitle>
            <DialogDescription>Añade un ingreso o egreso sin usar la IA.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={formManual.type === "income" ? "default" : "outline"}
                onClick={() => setFormManual({ ...formManual, type: "income" })}
                className={formManual.type === "income" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                Ingreso
              </Button>
              <Button
                type="button"
                variant={formManual.type === "expense" ? "default" : "outline"}
                onClick={() => setFormManual({ ...formManual, type: "expense" })}
                className={formManual.type === "expense" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
              >
                Egreso
              </Button>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-bold">S/</span>
              <input
                type="number"
                placeholder="0.00"
                value={formManual.amount}
                onChange={(e) => setFormManual({ ...formManual, amount: e.target.value })}
                className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <select
              value={formManual.category}
              onChange={(e) => setFormManual({ ...formManual, category: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {categoriasPermitidas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <input
              type="text"
              placeholder="Descripción breve..."
              value={formManual.description}
              onChange={(e) => setFormManual({ ...formManual, description: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <DialogFooter>
            <Button disabled={cargandoManual || !formManual.amount} onClick={handleGuardarManual} className="w-full">
              {cargandoManual ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar Movimiento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================
          MODAL 3: CIERRE DE CAJA
      ========================================= */}
      <Dialog open={modalCierre} onOpenChange={setModalCierre}>
        <DialogContent className="sm:max-w-[400px] dark:bg-slate-900 dark:border-slate-800 border-t-4 border-t-red-500">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-red-600 dark:text-red-400">Cerrar Turno</DialogTitle>
            <DialogDescription className="text-center">
              Tu saldo teórico es de <strong>S/ {saldoActual.toFixed(2)}</strong>. <br />
              Cuenta el dinero en tu cajón e ingresa el monto real para calcular el descuadre.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-500 font-bold text-lg">S/</span>
              <input
                type="number"
                className="w-full h-14 pl-10 pr-4 text-lg font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
                placeholder={saldoActual.toFixed(2)}
                value={montoCierre}
                onChange={(e) => setMontoCierre(e.target.value)}
                disabled={cargandoCierre}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={cargandoCierre || !montoCierre}
              onClick={handleCerrarCaja}
              className="w-full h-12 text-lg font-medium bg-red-600 hover:bg-red-700 text-white"
            >
              {cargandoCierre ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirmar Cierre"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================
          MODAL: APERTURA DE CAJA (Bloqueante)
      ========================================= */}
      <Dialog open={modalApertura} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-[400px] [&>button]:hidden dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-2xl text-center text-slate-900 dark:text-white">Apertura de Caja</DialogTitle>
            <DialogDescription className="text-center">
              Para empezar tu turno, ingresa el dinero base en efectivo con el que abre la caja física.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative mt-2">
              <span className="absolute left-4 top-3 text-slate-500 font-bold text-lg">S/</span>
              <input
                type="number"
                className="w-full h-14 pl-10 pr-4 text-lg font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-600 transition-shadow"
                placeholder="0.00"
                value={montoApertura}
                onChange={(e) => setMontoApertura(e.target.value)}
                disabled={cargandoApertura}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={cargandoApertura || !montoApertura}
              onClick={handleAbrirCaja}
              className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              {cargandoApertura ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirmar Apertura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}