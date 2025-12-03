import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Menu, X } from "lucide-react";
import { logoGuru } from "../../constants/assets";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { UserProfileCard } from "../ui/UserProfileCard";

export function Header() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoggedIn, login, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    // Para o protótipo, faz login direto como admin
    login();
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-blue-900/95 backdrop-blur-sm">
        {/* Header quando logado - igual ao admin */}
        {isLoggedIn ? (
          <>
            <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
              {/* Logo à esquerda */}
              <Link to="/" className="flex items-center gap-4">
                <img src={logoGuru} alt="Guru de Negócios" className="w-24 h-24" />
                <span className="text-white font-bold text-3xl">Guru de Negócios</span>
              </Link>

              {/* UserProfileCard à direita */}
              <UserProfileCard 
                name={user?.nome || "Usuário"} 
                role="SAIR" 
                onLogout={handleLogout}
              />
            </div>

            {/* Linha amarela */}
            <div className="h-0.5 w-full bg-yellow-400" />

            {/* Barra de navegação */}
            <div className="container mx-auto px-20">
              <nav className="flex items-center justify-center gap-20 py-4">
                <a href="/#sobre" className="text-white/90 hover:text-white transition-colors">Sobre</a>
                <a href="/#historia" className="text-white/90 hover:text-white transition-colors">Nossa História</a>
                <a href="/#participar" className="text-white/90 hover:text-white transition-colors">Como Fazer Parte</a>
                <a href="/#contato" className="text-white/90 hover:text-white transition-colors">Contato</a>
                <Link to="/mentorias" className="text-white/90 hover:text-white transition-colors">Mentorias</Link>
                {isAdmin && (
                  <Link to="/crm" className="text-white/90 hover:text-white transition-colors">Admin</Link>
                )}
              </nav>
            </div>
          </>
        ) : (
          /* Header quando NÃO logado - header original */
          <>
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <img src={logoGuru} alt="Programa de Mentoria - Guru de Negócios" />
                <span className="font-heading text-3xl font-bold text-white">Guru de Negócios</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-3">
                <>
                  <Button className="rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 px-4">
                    Cadastre-se
                  </Button>
                  <Button 
                    onClick={() => setShowLoginModal(true)}
                    className="rounded-lg text-neutral-900 hover:bg-slate-100 shadow px-4"
                  >
                    Entrar
                  </Button>
                </>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-white hover:bg-blue-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            
            <div className="h-0.5 w-full bg-yellow-400" />
            
            {/* Menu Desktop */}
            <div className="container mx-auto px-20 hidden md:block">
              <nav className="flex items-center justify-center gap-20 py-4">
                <a href="#sobre" className="text-white/90 hover:text-white transition-colors">Sobre</a>
                <a href="#historia" className="text-white/90 hover:text-white transition-colors">Nossa História</a>
                <a href="#participar" className="text-white/90 hover:text-white transition-colors">Como Fazer Parte</a>
                <a href="#contato" className="text-white/90 hover:text-white transition-colors">Contato</a>
                <Link to="/mentorias" className="text-white/90 hover:text-white transition-colors">Mentorias</Link>
              </nav>
            </div>
          </>
        )}

        {/* Menu Mobile - apenas quando NÃO estiver logado */}
        {!isLoggedIn && mobileMenuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-700">
            <nav className="flex flex-col px-4 py-4 gap-3">
              <a href="#sobre" className="text-white/90 hover:text-white transition-colors py-2">Sobre</a>
              <a href="#historia" className="text-white/90 hover:text-white transition-colors py-2">Nossa História</a>
              <a href="#participar" className="text-white/90 hover:text-white transition-colors py-2">Como Fazer Parte</a>
              <a href="#contato" className="text-white/90 hover:text-white transition-colors py-2">Contato</a>
              <Link to="/mentorias" className="text-white/90 hover:text-white transition-colors py-2">Mentorias</Link>
              <div className="border-t border-blue-700 pt-3 mt-2">
                <div className="flex flex-col gap-2">
                  <Button className="rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 px-4 w-full">
                    Cadastre-se
                  </Button>
                  <Button 
                    onClick={() => setShowLoginModal(true)}
                    className="rounded-lg text-neutral-900 hover:bg-slate-100 shadow px-4 w-full"
                  >
                    Entrar
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowLoginModal(false)} />
          <div className="relative z-[101] bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Botão fechar */}
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>

            <div className="p-8 pt-10">
              {/* Topo - Cadastre-se */}
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  Não possui uma conta?{" "}
                  <button className="text-orange-500 font-semibold hover:text-orange-600 uppercase tracking-wide">
                    Cadastre-se
                  </button>
                </p>
              </div>

              <div className="border-t border-gray-200 mb-6" />

              {/* Título */}
              <h2 className="text-center text-blue-900 font-bold text-lg uppercase tracking-wide mb-6">
                Como deseja acessar a sua conta?
              </h2>

              {/* Botão Login Google / Admin */}
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    AD
                  </div>
                  <div className="text-left">
                    <p className="text-gray-800 font-medium text-sm">Fazer login como Administrador</p>
                    <p className="text-gray-500 text-xs">admin@gurudenegocios.com.br</p>
                  </div>
                </div>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>

              {/* Divisor OU */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-gray-400 text-sm font-medium">OU</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* Campo de Email */}
              <div className="mb-6">
                <input 
                  type="email" 
                  placeholder="E-mail"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              {/* Botão Receber Link */}
              <button
                onClick={handleLogin}
                className="w-full py-4 rounded-full text-white font-bold uppercase tracking-wide"
                style={{
                  background: "linear-gradient(90deg, #f97316 0%, #ef4444 100%)"
                }}
              >
                Receber Link de Acesso
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}


