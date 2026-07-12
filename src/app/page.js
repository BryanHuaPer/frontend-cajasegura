"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* =========================================
          NAVBAR
      ========================================= */}
      <nav className="cs-navbar" id="navbar">
        <div className="cs-container">
          <div className="cs-navbar-content">
            {/* Brand */}
            <a href="#" className="cs-brand">
              <div className="cs-brand-icon">
                <i className="ri-shield-check-line"></i>
              </div>
              <span className="cs-brand-text">
                Caja<span className="cs-brand-highlight">Segura</span>
              </span>
            </a>

            {/* Desktop nav links */}
            <div className="cs-nav-links">
              <a href="#quienes-somos" className="cs-nav-link">Quiénes Somos</a>
              <a href="#antes-despues" className="cs-nav-link">Cómo Funciona</a>
              <a href="#beneficios" className="cs-nav-link">Beneficios</a>
              <a href="#clientes" className="cs-nav-link">Clientes</a>
              <a href="#planes" className="cs-nav-link">Planes</a>
            </div>

            {/* Actions */}
            <div className="cs-nav-actions">
              <Link href="/login" className="cs-btn cs-btn-primary cs-btn-sm cs-desktop-only">
                Empezar Gratis
              </Link>
              <button
                className="cs-mobile-toggle"
                id="mobile-menu-button"
                aria-label="Abrir menú"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <i className={mobileMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`cs-mobile-menu ${mobileMenuOpen ? "" : "cs-mobile-menu-hidden"}`}>
            <a href="#quienes-somos" className="cs-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Quiénes Somos</a>
            <a href="#antes-despues" className="cs-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Cómo Funciona</a>
            <a href="#beneficios" className="cs-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Beneficios</a>
            <a href="#clientes" className="cs-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Clientes</a>
            <a href="#planes" className="cs-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Planes</a>
            <Link href="/login" className="cs-btn cs-btn-primary cs-btn-full" style={{ marginTop: "0.75rem" }}>
              Empezar Gratis
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* =========================================
            HERO
        ========================================= */}
        <section className="cs-hero" id="inicio">
          <div className="cs-hero-bg">
            <div className="cs-hero-overlay"></div>
          </div>

          <div className="cs-container cs-hero-content">
            {/* Text side */}
            <div className="cs-hero-text">
              <div className="cs-hero-badge">
                <div className="cs-badge-dot"></div>
                <span>Potenciado con IA · Gemini 2.5 Flash</span>
              </div>

              <h1 className="cs-hero-title">
                Controla tu Caja Chica con{" "}
                <span className="cs-text-accent">Inteligencia Artificial</span>
              </h1>

              <p className="cs-hero-desc">
                El primer SaaS financiero que escanea tus comprobantes, detecta gastos
                hormiga y te audita la caja en segundos. Sin saber de contabilidad.
              </p>

              <div className="cs-hero-actions">
                <a href="#planes" className="cs-btn cs-btn-accent cs-btn-lg">
                  Empezar Gratis <i className="ri-arrow-right-line"></i>
                </a>
                <a href="#planes" className="cs-btn cs-btn-outline-light cs-btn-lg">
                  Ver Planes <i className="ri-price-tag-3-line"></i>
                </a>
              </div>

              <div className="cs-hero-features">
                <div className="cs-feature-item">
                  <i className="ri-checkbox-circle-fill"></i>
                  <span>Sin tarjeta</span>
                </div>
                <div className="cs-feature-item">
                  <i className="ri-checkbox-circle-fill"></i>
                  <span>Plan gratuito</span>
                </div>
                <div className="cs-feature-item">
                  <i className="ri-checkbox-circle-fill"></i>
                  <span>Configuración en 2 min</span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────
                MOCKUP DE LA APP — Reemplaza con tu captura
                ─────────────────────────────────────────────
                Para cambiar la imagen:
                  1. Agrega tu captura a /public/app-screenshot.png
                  2. Reemplaza el bloque <div className="cs-mockup-screen">...
                     por: <img src="/app-screenshot.png" alt="CajaSegura app" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ───────────────────────────────────────────── */}
            <div className="cs-hero-mockup" data-replace="app-screenshot">
              <div className="cs-mockup-container">
                <div className="cs-mockup-frame">
                  {/* PLACEHOLDER — reemplaza con tu <img> real */}
                  <img
                    src="/app-screenshot.png"
                    alt="Vista de la app CajaSegura en móvil"
                    className="cs-app-screenshot"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="cs-scroll-indicator">
            <a href="#quienes-somos" className="cs-scroll-link">
              <span>Descubre más</span>
              <i className="ri-arrow-down-s-line"></i>
            </a>
          </div>
        </section>

        {/* =========================================
            QUIÉNES SOMOS
        ========================================= */}
        <section className="cs-about" id="quienes-somos">
          <div className="cs-container">
            <div className="cs-about-grid">
              <div>
                <span className="cs-section-badge">Quiénes Somos</span>
                <h2 className="cs-section-title">CajaSegura SaaS</h2>
                <p className="cs-about-text">
                  Nacimos al observar la alta tasa de mortalidad de los pequeños negocios en el
                  Perú. Detectamos que el problema no era la falta de ventas, sino el{" "}
                  <strong>desorden en la caja chica</strong> y el{" "}
                  <strong>"gasto hormiga"</strong> no registrado que silenciosamente drena las
                  ganancias.
                </p>
                <p className="cs-about-text">
                  Nuestra misión es democratizar la inteligencia artificial financiera.
                  Convertimos el control de ingresos y egresos diarios en un proceso automático,
                  brindando <strong>herramientas de grado corporativo</strong> a los
                  emprendedores que mueven la economía local.
                </p>
                <Link href="/login" className="cs-btn cs-btn-primary">
                  Conoce la plataforma <i className="ri-arrow-right-line"></i>
                </Link>
              </div>

              <div>
                <div className="cs-stats-grid">
                  <div className="cs-stat-card">
                    <div className="cs-stat-value">+2M</div>
                    <div className="cs-stat-label">PyMES en el Perú sin control financiero</div>
                  </div>
                  <div className="cs-stat-card">
                    <div className="cs-stat-value">68%</div>
                    <div className="cs-stat-label">Cierran antes de los 5 años por mala gestión</div>
                  </div>
                  <div className="cs-stat-card">
                    <div className="cs-stat-value">S/847</div>
                    <div className="cs-stat-label">Pérdida promedio mensual por gastos no rastreados</div>
                  </div>
                  <div className="cs-stat-card">
                    <div className="cs-stat-value">2 min</div>
                    <div className="cs-stat-label">Para configurar tu primera caja con CajaSegura</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            ANTES / DESPUÉS
        ========================================= */}
        <section className="cs-comparison" id="antes-despues">
          <div className="cs-container">
            <div className="cs-section-header">
              <span className="cs-section-badge">Cómo Funciona</span>
              <h2 className="cs-section-title">Tu negocio, antes y después</h2>
              <p className="cs-section-desc">
                Así de radical es el cambio cuando dejas de gestionar tu caja a mano y
                automatizas con inteligencia artificial.
              </p>
            </div>

            <div className="cs-comparison-grid">
              {/* BEFORE card */}
              <div className="cs-comp-card cs-before">
                <span className="cs-comp-badge cs-badge-before">Antes</span>
                <ul className="cs-comp-list">
                  {[
                    { icon: "ri-close-circle-line", text: "Cuadernos de papel que se pierden o se mojan" },
                    { icon: "ri-close-circle-line", text: "Diferencias de caja que nadie puede explicar" },
                    { icon: "ri-close-circle-line", text: "Gastos pequeños que se olvidan de registrar" },
                    { icon: "ri-close-circle-line", text: "Horas revisando recibos al final del mes" },
                    { icon: "ri-close-circle-line", text: "Sin saber realmente si el negocio genera ganancia" },
                  ].map((item, i) => (
                    <li key={i} className="cs-comp-item">
                      <div className="cs-item-icon cs-icon-before">
                        <i className={item.icon}></i>
                      </div>
                      <p>{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divider */}
              <div className="cs-comp-divider">
                <span>VS</span>
              </div>

              {/* AFTER card */}
              <div className="cs-comp-card cs-after">
                <span className="cs-comp-badge cs-badge-after">Con CajaSegura</span>
                <ul className="cs-comp-list">
                  {[
                    { icon: "ri-checkbox-circle-line", text: "Control digital en la nube, accesible desde cualquier celular" },
                    { icon: "ri-checkbox-circle-line", text: "Cuadre automático con auditoría de IA en tiempo real" },
                    { icon: "ri-checkbox-circle-line", text: "OCR escanea tus comprobantes y registra solo" },
                    { icon: "ri-checkbox-circle-line", text: "Reportes financieros generados en segundos" },
                    { icon: "ri-checkbox-circle-line", text: "Dashboard claro para ver tus ganancias reales" },
                  ].map((item, i) => (
                    <li key={i} className="cs-comp-item">
                      <div className="cs-item-icon cs-icon-after">
                        <i className={item.icon}></i>
                      </div>
                      <p>{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            BENEFICIOS
        ========================================= */}
        <section className="cs-benefits" id="beneficios">
          <div className="cs-container">
            <div className="cs-section-header">
              <span className="cs-section-badge">Beneficios</span>
              <h2 className="cs-section-title">Todo lo que necesitas, nada de lo que no</h2>
              <p className="cs-section-desc">
                Funcionalidades diseñadas específicamente para bodegas, minimarkets,
                ferreterías y restaurantes del Perú.
              </p>
            </div>

            <div className="cs-benefits-grid">
              {[
                {
                  iconClass: "cs-icon-accent",
                  icon: "ri-scan-2-line",
                  title: "Escaneo OCR Inteligente",
                  desc: "Sube una foto de tu boleta o ticket. La IA extrae monto, fecha y categoría automáticamente. Compatible con Yape y Plin.",
                },
                {
                  iconClass: "cs-icon-primary",
                  icon: "ri-shield-check-line",
                  title: "Aislamiento Multi-Tenant",
                  desc: "Arquitectura segura que mantiene los datos de tu negocio completamente separados y cifrados. Solo tú tienes acceso.",
                },
                {
                  iconClass: "cs-icon-purple",
                  icon: "ri-bar-chart-2-line",
                  title: "Auditorías Predictivas",
                  desc: "Gemini 2.5 Flash analiza tus patrones de gasto y proyecta tu liquidez mensual antes de que sea un problema.",
                },
                {
                  iconClass: "cs-icon-green",
                  icon: "ri-alarm-warning-line",
                  title: "Alertas de Gastos Hormiga",
                  desc: "Detecta automáticamente pequeños gastos recurrentes que individualmente parecen insignificantes pero suman mucho.",
                },
              ].map((b, i) => (
                <div key={i} className="cs-benefit-card">
                  <div className={`cs-benefit-icon ${b.iconClass}`}>
                    <i className={b.icon}></i>
                  </div>
                  <h3 className="cs-benefit-title">{b.title}</h3>
                  <p className="cs-benefit-desc">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            TESTIMONIOS
        ========================================= */}
        <section className="cs-testimonials" id="clientes">
          <div className="cs-container">
            <div className="cs-section-header">
              <span className="cs-section-badge">Clientes</span>
              <h2 className="cs-section-title">Lo que dicen nuestros usuarios</h2>
              <p className="cs-section-desc">
                Negocios reales que transformaron su control financiero con CajaSegura.
              </p>
            </div>

            <div className="cs-testimonials-grid">
              {[
                {
                  initials: "MR",
                  name: "María Quispe",
                  role: "Propietaria · Bodega San Martín, Tacna",
                  quote:
                    "Antes terminaba el día sin saber cuánto había ganado. Ahora CajaSegura me da el resumen en segundos. ¡Ya no me falta plata a fin de mes!",
                  result: "Ahorró S/ 320 el primer mes detectando gastos hormiga",
                },
                {
                  initials: "JV",
                  name: "Jorge Vargas",
                  role: "Dueño · Minimarket El Progreso, Arequipa",
                  quote:
                    "El lector de comprobantes es increíble. Saco foto a la boleta y listo, ya está registrado. Mis empleados ya no pueden hacer trampa con la caja.",
                  result: "Redujo diferencias de caja de S/ 150 a menos de S/ 5",
                },
                {
                  initials: "LP",
                  name: "Lucía Paredes",
                  role: "Administradora · Restaurante Don Ceviche, Lima",
                  quote:
                    "Los reportes financieros me ayudaron a negociar mejor con mis proveedores. Ahora sé exactamente cuánto puedo comprometer cada semana.",
                  result: "Mejoró su margen de ganancia en un 18% en 3 meses",
                },
              ].map((t, i) => (
                <div key={i} className="cs-testimonial-card">
                  <div className="cs-testimonial-header">
                    <div className="cs-testimonial-avatar">{t.initials}</div>
                    <div>
                      <div className="cs-author-name">{t.name}</div>
                      <div className="cs-author-role">{t.role}</div>
                    </div>
                  </div>
                  <div className="cs-testimonial-body">
                    <i className="ri-double-quotes-l cs-quote-icon"></i>
                    <p className="cs-testimonial-quote">{t.quote}</p>
                  </div>
                  <div className="cs-testimonial-result">
                    <i className="ri-sparkling-fill"></i>
                    <span>{t.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            PLANES / PRECIOS
        ========================================= */}
        <section className="cs-pricing" id="planes">
          <div className="cs-container">
            <div className="cs-section-header">
              <span className="cs-section-badge">Planes</span>
              <h2 className="cs-section-title">Planes diseñados para tu crecimiento</h2>
              <p className="cs-section-desc">
                Comienza gratis y escala cuando tu negocio lo necesite. Sin sorpresas.
              </p>
            </div>

            <div className="cs-pricing-grid">
              {/* Emprendedor */}
              <div className="cs-pricing-card">
                <div className="cs-pricing-content">
                  <div className="cs-pricing-name">Emprendedor</div>
                  <div className="cs-pricing-desc">Para comenzar a ordenar tu caja</div>
                  <div className="cs-pricing-price">
                    <span className="cs-price-amount">S/ 0</span>
                    <span className="cs-price-period">/mes</span>
                  </div>
                  <ul className="cs-pricing-features">
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> 1 Usuario (Cajero)</li>
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> Control de caja básico</li>
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> Historial de 30 días</li>
                    <li className="cs-feat-disabled"><i className="ri-close-circle-line"></i> Auditoría IA</li>
                    <li className="cs-feat-disabled"><i className="ri-close-circle-line"></i> Escaneo OCR</li>
                  </ul>
                  <Link href="/login" className="cs-btn cs-btn-primary cs-btn-full">
                    Empezar Gratis
                  </Link>
                </div>
              </div>

              {/* PyME IA — featured */}
              <div className="cs-pricing-card cs-pricing-card-featured">
                <div className="cs-pricing-badge">RECOMENDADO</div>
                <div className="cs-pricing-content">
                  <div className="cs-pricing-name">PyME IA</div>
                  <div className="cs-pricing-desc">Para negocios que quieren crecer con datos</div>
                  <div className="cs-pricing-price">
                    <span className="cs-price-amount">S/ 39</span>
                    <span className="cs-price-period">/mes</span>
                    <div className="cs-price-note">Facturado anualmente</div>
                  </div>
                  <ul className="cs-pricing-features">
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> Usuarios ilimitados</li>
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> Auditoría IA (Gemini 2.5)</li>
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> Lector OCR de facturas</li>
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> Alertas gastos hormiga</li>
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> Soporte prioritario</li>
                  </ul>
                  <Link href="/login" className="cs-btn cs-btn-accent cs-btn-full">
                    Adquirir Plan Pro
                  </Link>
                </div>
              </div>

              {/* Corporativo */}
              <div className="cs-pricing-card">
                <div className="cs-pricing-content">
                  <div className="cs-pricing-name">Corporativo</div>
                  <div className="cs-pricing-desc">Para cadenas con múltiples sucursales</div>
                  <div className="cs-pricing-price">
                    <span className="cs-price-amount">S/ 120</span>
                    <span className="cs-price-period">/mes</span>
                  </div>
                  <ul className="cs-pricing-features">
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> Todo lo del plan Pro</li>
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> Múltiples sucursales</li>
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> API de integración</li>
                    <li className="cs-feat-included"><i className="ri-checkbox-circle-fill"></i> Gerente de cuenta dedicado</li>
                    <li className="cs-feat-disabled"><i className="ri-time-line"></i> Facturación SUNAT — Próximamente</li>
                  </ul>
                  <button className="cs-btn cs-btn-primary cs-btn-full" style={{ opacity: 0.7, cursor: "not-allowed" }} disabled>
                    Contactar Ventas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CTA FINAL
        ========================================= */}
        <section className="cs-cta">
          <div className="cs-container">
            <div className="cs-cta-card">
              <div className="cs-cta-bg">
                <div className="cs-cta-circle cs-cta-circle-top"></div>
                <div className="cs-cta-circle cs-cta-circle-bottom"></div>
              </div>
              <div className="cs-cta-content">
                <h2 className="cs-cta-title">
                  ¿Listo para tomar el control de tu caja?
                </h2>
                <p className="cs-cta-desc">
                  Únete a cientos de negocios peruanos que ya confían en CajaSegura.
                  Empieza gratis hoy, sin tarjeta de crédito.
                </p>
                <div className="cs-cta-form">
                  <div className="cs-form-group">
                    <input
                      type="email"
                      className="cs-form-input"
                      placeholder="tu@correo.com"
                      id="cta-email"
                      autoComplete="email"
                    />
                    <Link href="/login" className="cs-btn cs-btn-accent">
                      Empezar Gratis <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                  <p className="cs-form-disclaimer">
                    Sin spam. Puedes cancelar cuando quieras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================
          FOOTER
      ========================================= */}
      <footer className="cs-footer">
        <div className="cs-container">
          <div className="cs-footer-grid">
            {/* Brand column */}
            <div style={{ gridColumn: "span 2" }}>
              <div className="cs-footer-brand" style={{ marginBottom: "1rem" }}>
                <div className="cs-footer-brand-icon">
                  <i className="ri-shield-check-line"></i>
                </div>
                <span className="cs-footer-brand-text">CajaSegura</span>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--cs-fg-500)", maxWidth: "20rem", lineHeight: 1.6 }}>
                Democratizando el acceso a la inteligencia artificial financiera
                para los pequeños negocios del Perú.
              </p>
            </div>

            {/* Producto */}
            <div>
              <div className="cs-footer-title">Producto</div>
              <div className="cs-footer-links">
                <a href="#beneficios" className="cs-footer-link">Características</a>
                <a href="#planes" className="cs-footer-link">Precios</a>
                <a href="#" className="cs-footer-link">Actualizaciones</a>
                <a href="#" className="cs-footer-link">Roadmap</a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <div className="cs-footer-title">Legal</div>
              <div className="cs-footer-links">
                <a href="#" className="cs-footer-link">Términos de servicio</a>
                <a href="#" className="cs-footer-link">Privacidad</a>
                <a href="#" className="cs-footer-link">Contacto</a>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="cs-footer-bottom">
            <div className="cs-footer-copyright">
              © 2026 CajaSegura SaaS · Proyecto de Ingeniería en Informática y Sistemas — UNJBG
            </div>
            <div className="cs-footer-social">
              <a href="#" className="cs-social-link" aria-label="Facebook">
                <i className="ri-facebook-fill"></i>
              </a>
              <a href="#" className="cs-social-link" aria-label="Instagram">
                <i className="ri-instagram-line"></i>
              </a>
              <a href="#" className="cs-social-link" aria-label="LinkedIn">
                <i className="ri-linkedin-fill"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}