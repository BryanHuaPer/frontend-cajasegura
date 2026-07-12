import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";
import Image from "next/image";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "CajaSegura — Controla tu Caja Chica con Inteligencia Artificial",
  description:
    "CajaSegura es el primer SaaS financiero que escanea tus comprobantes, detecta gastos hormiga y te audita la caja en segundos. Sin saber de contabilidad. Para bodegas, minimarkets, ferreterías y restaurantes.",
  keywords:
    "control de caja, caja chica, SaaS financiero, PyME, inteligencia artificial, OCR, gastos hormiga, Perú, negocio pequeño",
  openGraph: {
    title: "CajaSegura — Controla tu Caja Chica con IA",
    description:
      "El primer SaaS financiero que escanea tus comprobantes, detecta gastos hormiga y te audita la caja en segundos.",
    type: "website",
    url: "https://cajasegura.pe",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: "CajaSegura — Controla tu Caja Chica con IA",
    description:
      "Escanea comprobantes, detecta gastos hormiga y audita tu caja en segundos.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css"
        />
        <meta name="geo.region" content="PE" />
        <meta name="geo.placename" content="Perú" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://cajasegura.pe" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          {/* Botón de tema flotante — visible en TODAS las páginas (landing, login, dashboard…) */}
          <div
            style={{
              position: "fixed",
              bottom: "1.5rem",
              left: "1.5rem",
              zIndex: 9999,
            }}
          >
            <ThemeToggle floating />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
