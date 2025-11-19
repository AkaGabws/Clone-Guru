import React from "react";
import { Button } from "../../components/ui/button";
import { Menu } from "lucide-react";
import { logoGuru } from "../../constants/assets";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 w-full bg-blue-900/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoGuru} alt="Programa de Mentoria - Guru de Negócios" />
          <span className="font-heading text-3xl font-bold text-white">Guru de Negócios</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button className="rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 px-4">Cadastre-se</Button>
          <Button className="rounded-lg  text-neutral-900 hover:bg-slate-100 shadow px-4">Entrar</Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-blue-800">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div className="h-0.5 w-full bg-yellow-400" />
      <div className="container mx-auto px-20">
        <nav className="flex items-center justify-center gap-20 py-4">
          <a href="#sobre" className="text-white/90 hover:text-white transition-colors">Sobre</a>
          <a href="#historia" className="text-white/90 hover:text-white transition-colors">Nossa História</a>
          <a href="#participar" className="text-white/90 hover:text-white transition-colors">Como Fazer Parte</a>
          <a href="#contato" className="text-white/90 hover:text-white transition-colors">Contato</a>
          <Link to="/mentorias" className="text-white/90 hover:text-white transition-colors">Mentorias</Link>
          <Link to="/crm" className="text-white/90 hover:text-white transition-colors">Admin</Link>
        </nav>
      </div>
    </header>
  );
}


