"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("juan@test.com"); // El cajero que creaste en Tinker
  const [password, setPassword] = useState("123456");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("Conectando con el servidor...");

    try {
      // 1. Apuntamos a tu API en Laravel Herd
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 2. Si el backend nos rebota...
      if (!response.ok) {
        setMensaje("Error: " + (data.message || "Credenciales incorrectas"));
        return;
      }

      // 3. Si el backend nos acepta, guardamos el Token
      localStorage.setItem("token_caja", data.token);
      localStorage.setItem("usuario_nombre", data.user_name);
      localStorage.setItem("usuario_rol", data.user_role);

      router.push("/dashboard");
      
    } catch (error) {
      setMensaje("Error de red. ¿Está encendido Herd?");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>CajaSegura</CardTitle>
          <CardDescription>Inicia sesión para registrar ventas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
            </div>
            
            {/* Mensaje de estado */}
            {mensaje && (
              <p className="mt-4 text-sm font-medium text-center text-blue-600">
                {mensaje}
              </p>
            )}

            <CardFooter className="flex justify-between mt-6 px-0 pb-0">
              <Button type="submit" className="w-full">Entrar al Sistema</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}