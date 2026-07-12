"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("juan@test.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Credenciales incorrectas. Verifica tu correo y contraseña.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token_caja", data.token);
      localStorage.setItem("usuario_nombre", data.user_name);
      localStorage.setItem("usuario_rol", data.user_role);
      router.push("/dashboard");

    } catch (err) {
      setError("Error de conexión. Verifica que el servidor esté en línea.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* =============================================
          IZQUIERDA — Formulario
      ============================================= */}
      <div className="login-left">

        {/* ── Barra superior: logo izq. / volver der. ── */}
        <div className="login-topbar">
          {/* Logo — esquina superior izquierda */}
          <Link href="/" className="login-logo">
            <div className="login-logo-icon">
              <i className="ri-shield-check-line"></i>
            </div>
            <span className="login-logo-text">
              Caja<span style={{ color: "var(--cs-primary-500)" }}>Segura</span>
            </span>
          </Link>

          {/* Volver — esquina superior derecha */}
          <Link href="/" className="login-back-link">
            <ArrowLeft style={{ width: "1rem", height: "1rem", marginRight: "0.4rem", flexShrink: 0 }} />
            Volver al inicio
          </Link>
        </div>

        {/* ── Formulario centrado verticalmente ── */}
        <div className="login-form-wrapper">
          <div className="login-heading">
            <h1 className="login-title">Bienvenido de nuevo</h1>
            <p className="login-subtitle">Ingresa tus credenciales para acceder a tu caja.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">

            {/* Email */}
            <div className="login-field">
              <Label htmlFor="login-email" className="login-label">
                Correo electrónico
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="juan@negocio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="login-input"
                style={{ height: "3rem" }}
              />
            </div>

            {/* Password con toggle ver/ocultar */}
            <div className="login-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Label htmlFor="login-password" className="login-label">
                  Contraseña
                </Label>
                <Link href="#" className="login-forgot">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Input wrapper con botón de ojo dentro */}
              <div className="login-password-wrapper">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="login-input login-password-input"
                  style={{ height: "3rem", paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="login-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <i className="ri-error-warning-line" style={{ flexShrink: 0 }}></i>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "3rem",
                fontSize: "1rem",
                fontWeight: 600,
                background: isLoading ? "#93c5fd" : "var(--cs-primary-500)",
                color: "white",
                border: "none",
                borderRadius: "0.625rem",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "background 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ width: "1.25rem", height: "1.25rem", animation: "spin 1s linear infinite" }} />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line"></i>
                  Entrar al Sistema
                </>
              )}
            </Button>
          </form>

          <p className="login-footer-text">
            ¿Tu negocio aún no usa CajaSegura?{" "}
            <Link href="/" className="login-footer-link">
              Crea una cuenta gratis
            </Link>
          </p>

          <div className="login-security-badge">
            <i className="ri-lock-2-line"></i>
            <span>Conexión segura · Cifrado TLS 1.3</span>
          </div>
        </div>
      </div>

      {/* =============================================
          DERECHA — Panel de marca (solo desktop)
      ============================================= */}
      <div className="login-right">
        <div className="login-right-bg"></div>
        <div className="login-right-overlay"></div>

        <div className="login-right-content">
          <div className="login-features">
            <div className="login-feature-card">
              <div className="login-feature-icon" style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}>
                <i className="ri-scan-2-line"></i>
              </div>
              <div>
                <div className="login-feature-title">OCR Inteligente</div>
                <div className="login-feature-desc">Escanea tus comprobantes en segundos</div>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon" style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}>
                <i className="ri-shield-check-line"></i>
              </div>
              <div>
                <div className="login-feature-title">Multi-tenant seguro</div>
                <div className="login-feature-desc">Tus datos aislados y cifrados</div>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="login-feature-icon" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                <i className="ri-bar-chart-2-line"></i>
              </div>
              <div>
                <div className="login-feature-title">Auditoría IA</div>
                <div className="login-feature-desc">Detecta gastos hormiga automáticamente</div>
              </div>
            </div>
          </div>

          <div className="login-right-text">
            <div className="login-right-badge">
              <div className="login-badge-dot"></div>
              <span>Potenciado con Gemini 2.5 Flash</span>
            </div>
            <h2 className="login-right-title">
              Tu caja chica,<br />bajo control total
            </h2>
            <p className="login-right-desc">
              Miles de pequeños negocios en el Perú ya confían en CajaSegura para
              mantener sus finanzas ordenadas y crecer con seguridad.
            </p>
          </div>

          <div className="login-stats">
            {[
              { value: "2 min", label: "Configuración" },
              { value: "99.9%", label: "Uptime" },
              { value: "S/ 0",  label: "Plan gratuito" },
            ].map((s, i) => (
              <div key={i} className="login-stat">
                <div className="login-stat-value">{s.value}</div>
                <div className="login-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}