import React, { useState } from "react";
import { Header } from "../components/sections/Header";
import { Footer } from "../components/sections/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MentoriaDetalhe } from "../components/mentorias/MentoriaDetalhe";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  MessageCircle,
  CheckCircle,
  ChevronRight,
  Filter,
  Search,
  Bell,
  Settings,
  Plus,
  Star,
  Download,
  ArrowRight,
  Info
} from "lucide-react";

export default function MentoriasPage() {
  const [activeTab, setActiveTab] = useState("novas");
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<any>(null);
  const navigate = useNavigate();

  const irParaAcompanhamento = (solicitacao: any) => {
    
    const mentoria = {
      tipo: solicitacao.tipo,
      nome: solicitacao.nome,
      desafio: solicitacao.desafio,
      negocio: solicitacao.negocio ?? "—",
      area: solicitacao.area ?? "—",
      sobreEmpreendedor: solicitacao.sobreEmpreendedor ?? "—",
      cursos: Array.isArray(solicitacao.cursos) ? solicitacao.cursos : [],
      dataInscricao: solicitacao.data ?? "—",
      whatsapp: solicitacao.whatsapp,
    };
    navigate("/mentoria-acompanhamento", { state: {mentoria }});
  };
  
  const treinamentos = [
    {
      nome: "Mentoria Gratuita",
      concluido: true
    },
    {
      nome: "Mentoria Meu Negócio é Meu País",
      concluido: true
    },
    {
      nome: "Mentoria Negócio Raiz",
      concluido: true
    }
  ];

  const solicitacoes = {
    novas: [
      {
        id: 1,
        tipo: "MENTORIA NEGÓCIO RAIZ > COMPORTAMENTO EMPREENDEDOR",
        nome: "ARIADNA MIRANDA LACERDA",
        desafio: "Não tenho rotina específica com meu negócio, acho que a memória pode trazer a maturidade que preciso para organizar melhor.",
        data: "14/08/2025",
        negocio: "Ramo musical, faço musica a 15 anos e não sou mais um artista, mas ainda sou um musico, e quero me tornar um artista.",
        area: "Musica",
        sobreEmpreendedor: "Sou um artista, mas não sou um musico, e quero me tornar um musico.",
        cursos: ["Curso de Musica"],
        dataInscricao: "14/08/2025",
      },
      {
        id: 6,
        tipo: "Mentoria Meu Negócio é Meu País > PRECIFICAÇÃO DE ROTINA",
        nome: "JOÃO BATISTA",
        desafio: "Não tenho rotina específica com meu negócio, acho que a memória pode trazer a maturidade que preciso para organizar melhor.",
        data: "15/08/2025",
        negocio: "Carpinteiro, sou um carpinteiro, mas não sou um carpinteiro, e quero me tornar um carpinteiro.",
        area: "Carpinteiro",
        sobreEmpreendedor: "Sou um carpinteiro, mas não sou um carpinteiro, e quero me tornar um carpinteiro.",
        cursos: ["Curso de Carpinteiro"],
        dataInscricao: "15/08/2025",
        whatsapp: "5511948464703"
      },
      {
        id: 7,
        tipo: "MENTORIA NEGÓCIO RAIZ > COMPORTAMENTO EMPREENDEDOR",
        nome: "ALEXANDRE BATISTA",
        desafio: "Não tenho rotina específica com meu negócio, acho que a memória pode trazer a maturidade que preciso para organizar melhor.",
        data: "14/08/2025",
        negocio:"magico de carpinteiro, sou um carpinteiro, mas não sou um carpinteiro, e quero me tornar um carpinteiro.",
        area: "Carpinteiro",
        sobreEmpreendedor: "Sou um carpinteiro, mas não sou um carpinteiro, e quero me tornar um carpinteiro.",
        cursos: ["Curso de Carpinteiro"],
        dataInscricao: "14/08/2025",
      }
    ],
    andamento: [
      {
        id: 3,
        tipo: "MENTORIA GRATUITA > PROBLEMAS DE PERSONALIDADE",
        nome: "Francisco Oceano",
        desafio: "Faz Anos que não lanço um album novo.",
        data: "14/08/2025",
        progresso: 80,
        negocio: "Ramo musical, faço musica a 15 anos e não sou mais um artista, mas ainda sou um musico, e quero me tornar um artista.",
        area: "Musica",
        sobreEmpreendedor: "Sou um artista, mas não sou um musico, e quero me tornar um musico.",
        cursos: ["Curso de Musica"],
        dataInscricao: "14/08/2025",
        whatsapp: "5511948464703"
      },
      {
        id: 10,
        tipo: "MENTORIA GRATUITA > PROBLEMAS DE PERSONALIDADE",
        nome: "Francisco Oceano",
        desafio: "Faz Anos que não lanço um album novo.",
        data: "14/08/2025",
        progresso: 100,
        negocio: "Ramo musical, faço musica a 15 anos e não sou mais um artista, mas ainda sou um musico, e quero me tornar um artista.",
        area: "Musica",
        sobreEmpreendedor: "Sou um artista, mas não sou um musico, e quero me tornar um musico.",
        cursos: ["Curso de Musica"],
        dataInscricao: "14/08/2025",
        whatsapp: "5511948464703"
        
      },
      {
        id: 120,
        tipo: "MENTORIA GRATUITA > PROBLEMAS DE PERSONALIDADE",
        nome: "Francisco Oceano",
        desafio: "Faz Anos que não lanço um album novo.",
        data: "14/08/2025",
        progresso: 10,
        negocio: "Ramo musical, faço musica a 15 anos e não sou mais um artista, mas ainda sou um musico, e quero me tornar um artista.",
        area: "Musica",
        sobreEmpreendedor: "Sou um artista, mas não sou um musico, e quero me tornar um musico.",
        cursos: ["Curso de Musica"],
        dataInscricao: "14/08/2025",
      },

    ],
    finalizadas: [
      {
        id: 5,
        tipo: "MENTORIA GRATUITA > PROBLEMAS DE PERSONALIDADE",
        nome: "Caio Oceano",
        desafio: "Lançar Musica.",
        data: "14/08/2025",
        negocio: "Ramo musical, faço musica a 15 anos e não sou mais um artista, mas ainda sou um musico, e quero me tornar um artista.",
        area: "Musica",
        sobreEmpreendedor: "Sou um artista, mas não sou um musico, e quero me tornar um musico.",
        cursos: ["Curso de Musica"],
        dataInscricao: "14/08/2025",
        whatsapp: "5511948464703"
      },
       {
        id: 255,
        tipo: "MENTORIA GRATUITA > PROBLEMAS DE PERSONALIDADE",
        nome: "MARIA OCEANO",
        desafio: "Lançar Musica.",
        data: "14/08/2025" ,
        negocio: "Ramo musical, faço musica a 15 anos e não sou mais um artista, mas ainda sou um musico, e quero me tornar um artista.",
        area: "Musica",
        sobreEmpreendedor: "Sou um artista, mas não sou um musico, e quero me tornar um musico.",
        cursos: ["Curso de Musica"],
        dataInscricao: "14/08/2025",
        whatsapp: "5511948464703"
      },

    ]
  };

  

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />
      
      {/* Conteúdo principal */}
      <main className="max-w-[980px] mx-auto px-6 py-8 pb-12">
        {/* Header da página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003D74] mb-4">Mentorias</h1>
          <p className="text-gray-700 text-base leading-relaxed">
            Mentores e mentoras dedicam seu tempo e conhecimento para trocar experiências com microempreendedores. 
            Para participar, é obrigatório concluir o treinamento do Programa de Mentoria e manter-se sempre atualizado. 
            Acompanhe seu status:
          </p>
        </div>

        {/* Status do Treinamento - Card Branco */}
        <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Azul com cantos arredondados no topo */}
          <div className="bg-[#003D74] rounded-t-lg px-8 py-4">
            <div className="flex items-center gap-4">
              {/* Ícone circular amarelo com checkmark */}
              <div className="w-10 h-10 bg-[#FFD400] rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="text-[#003D74] w-6 h-6" strokeWidth={3} />
              </div>
              <h2 className="text-[#FFD400] font-bold text-base uppercase tracking-wide">
                Treinamento(s) Concluído(s)
              </h2>
            </div>
          </div>
          
          {/* Conteúdo Branco com cantos arredondados na parte inferior */}
          <div className="bg-white rounded-b-lg px-8 py-6">
            <ul className="space-y-0">
              {treinamentos.map((treinamento, index) => (
                <li key={index} className="flex items-center justify-between gap-4 py-3 border-b border-gray-200 last:border-0">
                  <span className="text-gray-900 text-sm font-medium">{treinamento.nome}</span>
                  <button className="bg-[#FFD400] text-[#003D74] font-bold text-xs px-6 py-2 rounded-full shadow-md hover:bg-yellow-500 transition whitespace-nowrap">
                    Rever
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      <section className="bg-blue-900 rounded-2xl shadow-lg px-10 py-10 text-white mb-8">
        {/* Cards de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Novas Solicitações */}
          <button
            onClick={() => setActiveTab("novas")}
            className={`relative rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
              activeTab === "novas" 
                ? "bg-white scale-105" 
                : "bg-[#FFD400] hover:scale-102"
            }`}
          >
            {/* Ícone 'i' no canto superior direito */}
            <div className="absolute top-2 right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <Info className="w-3 h-3 text-white" />
            </div>
      
            {/* Conteúdo do card */}
            <div className="p-6 flex flex-col items-center text-center">
              <Bell className="w-10 h-10 text-[#003D74] mb-3" />
              <h3 className="text-[#003D74] font-bold text-sm uppercase">
                NOVAS SOLICITAÇÕES
              </h3>
            </div>
          </button>

          {/* Card Em Andamento */}
          <button
            onClick={() => setActiveTab("andamento")}
            className={`relative rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
              activeTab === "andamento" 
                ? "bg-white scale-105" 
                : "bg-[#FFD400] hover:scale-102"
            }`}
          >
            {/* Ícone 'i' no canto superior direito */}
            <div className="absolute top-2 right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <Info className="w-3 h-3 text-white" />
            </div>
            
            {/* Conteúdo do card */}
            <div className="p-6 flex flex-col items-center text-center">
              <Clock className="w-10 h-10 text-[#003D74] mb-3" />
              <h3 className="text-[#003D74] font-bold text-sm uppercase">
                EM ANDAMENTO
              </h3>
            </div>
          </button>

          {/* Card Finalizadas */}
          <button
            onClick={() => setActiveTab("finalizadas")}
            className={`relative rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
              activeTab === "finalizadas" 
                ? "bg-white scale-105" 
                : "bg-[#FFD400] hover:scale-102"
            }`}
          >
            {/* Ícone 'i' no canto superior direito */}
            <div className="absolute top-2 right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <Info className="w-3 h-3 text-white" />
            </div>
            
            {/* Conteúdo do card */}
            <div className="p-6 flex flex-col items-center text-center">
              <CheckCircle className="w-10 h-10 text-[#003D74] mb-3" />
              <h3 className="text-[#003D74] font-bold text-sm uppercase">
                FINALIZADAS
              </h3>
            </div>
          </button>
        </div>
      
      
     
      <section className="bg-[#003D74] rounded-2xl rounded-b-lg shadow-lg px-10 py-10 text-white mb-8">
        {/* Conteúdo das Novas Solicitações */}
        {activeTab === "novas" && solicitacoes.novas.length > 0 && (
          <div className="space-y-6 bg-[#003D74] -mx-10 -mb-10 px-10 pb-10 pt-6">
            {solicitacoes.novas.map((solicitacao) => (
              <div key={solicitacao.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Barra amarela com tipo de mentoria */}
                <div className="bg-[#FFD400] px-6 py-3">
                  <h3 className="text-[#003D74] font-bold text-2x1 uppercase">
                    {solicitacao.tipo}
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Nome do empreendedor */}
                  <h4 className="text-xl font-bold text-[#003D74] mb-4">
                    {solicitacao.nome}
                  </h4>
                  
                  {/* Desafios */}
                  <div className="mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-bold text-gray-900 text-base">Os principais desafios são:</span>
                      <br />
                      <span className="text-gray-600">{solicitacao.desafio}</span>
                    </p>
                  </div>
                  
                  {/* Rodapé com data e botão */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-gray-600 text-xs">
                      Solicitado em: <strong>{solicitacao.data}</strong>
                    </span>
                    <button
                      onClick={() => setSolicitacaoSelecionada(solicitacao)}
                      className="bg-[#FFD400] text-[#003D74] font-bold text-xs px-6 py-2 rounded-full shadow-md hover:bg-yellow-500 transition uppercase"
                    >
                      Conheça mais
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      
        {/* Conteúdo Em Andamento */}
        {activeTab === "andamento" && solicitacoes.andamento.length > 0 && (
          <div className="space-y-6 bg-[#003D74] -mx-10 -mb-10 px-10 pb-10 pt-6">
            {solicitacoes.andamento.map((solicitacao) => (
              <div 
                key={solicitacao.id} 
                onClick={() => irParaAcompanhamento(solicitacao)}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
              >
                {/* Barra amarela com tipo de mentoria */}
                <div className="bg-[#FFD400] px-6 py-3">
                  <h3 className="text-[#003D74] font-bold text-2x1 uppercase">
                    {solicitacao.tipo}
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Nome do empreendedor */}
                  <h4 className="text-xl font-bold text-[#003D74] mb-4">
                    {solicitacao.nome}
                  </h4>
                  
                  {/* Desafios */}
                  <div className="mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-bold text-gray-900 text-base">Os principais desafios são:</span>
                      <br />
                      <span className="text-gray-600">{solicitacao.desafio}</span>
                    </p>
                  </div>
                  
                  {/* Barra de progresso circular */}
                  <div className="relative w-[60px] h-[60px] ml-auto">
                    <ProgressBar progress={solicitacao.progresso} size={60} strokeWidth={5} />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">
                      {solicitacao.progresso}%
                    </span>
                  </div>
                  
                  {/* Rodapé com data */}
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-gray-600 text-xs">
                      Solicitado em: <strong>{solicitacao.data}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conteúdo Finalizadas */}
        {activeTab === "finalizadas" && solicitacoes.finalizadas.length > 0 && (
          <div className="space-y-6 bg-[#003D74] -mx-10 -mb-10 px-10 pb-10 pt-6">
            {solicitacoes.finalizadas.map((solicitacao) => (
              <div key={solicitacao.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Barra amarela com tipo de mentoria */}
                <div className="bg-[#FFD400] px-6 py-3">
                  <h3 className="text-[#003D74] font-bold uppercase text-2x1">
                    {solicitacao.tipo}
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Nome do empreendedor */}
                  <h4 className="text-xl font-bold text-[#003D74] mb-4">
                    {solicitacao.nome}
                  </h4>
                  
                  {/* Desafios */}
                  <div className="mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-bold text-gray-900 text-base">Os principais desafios foram:</span>
                      <br />
                      <span className="text-gray-600">{solicitacao.desafio}</span>
                    </p>
                  </div>
                  
                  {/* Badge de conclusão */}
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      Mentoria Concluída
                    </span>
                  </div>
                  
                  {/* Rodapé com data */}
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-gray-600 text-xs">
                      Finalizada em: <strong>{solicitacao.data}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {((activeTab === "novas" && solicitacoes.novas.length === 0) ||
          (activeTab === "andamento" && solicitacoes.andamento.length === 0) ||
          (activeTab === "finalizadas" && solicitacoes.finalizadas.length === 0)) && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center -mx-10 -mb-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#003D74] mb-2">
              Nenhuma {activeTab === "novas" ? "solicitação nova" : activeTab === "andamento" ? "mentoria em andamento" : "mentoria finalizada"}
            </h3>
            <p className="text-gray-600 text-sm">
              {activeTab === "novas" 
                ? "Você ainda não recebeu novas solicitações de mentoria."
                : activeTab === "andamento"
                  ? "Você não possui mentorias em andamento no momento."
                  : "Nenhuma mentoria foi finalizada ainda."
              }
            </p>
          </div>
        )}
        </section>
        </section>
      </main>
      
      <MentoriaDetalhe
        solicitacao={solicitacaoSelecionada}
        onClose={() => setSolicitacaoSelecionada(null)}
      />
      
      <Footer />
    </div>
  );
}
