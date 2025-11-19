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
  ArrowRight
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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Conteúdo principal */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header da página */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-6">Mentorias</h1>
          <p className="text-gray-800 text-xl leading-relaxed max-w-5xl">
            Mentores e mentoras dedicam seu tempo e conhecimento para trocar experiências com microempreendedores. 
            Para participar, é obrigatório concluir o treinamento do Programa de Mentoria e manter-se sempre atualizado. 
            Acompanhe seu status:
          </p>
        </div>

        {/* Status do Treinamento */}
        <div className="mb-12 bg-white border-black text-black rounded-x80 p-1 shadow-lg pb-5">
          <div className="flex items-center bg-blue-900 rounded-t-lg px-20 py-4 gap-4 mb-6">
            <CheckCircle className=" text-yellow-400 w-8 h-8" />
            <h2 className=" text-yellow-400 font-bold text-lg" >TREINAMENTO(S) CONCLUÍDO(S)</h2>
          </div>
          <div className="space-y-6">
            {treinamentos.map((treinamento, index) => (
              <div key={index} className="flex items-center justify-between gap-2 py-1">
                <span className="text-black text-lg">{treinamento.nome}</span>
                <Button className=" bg-yellow-400 text-blue-900 font-medium text-sm h-8 px-8 py-1 mb-1 bpr  rounded-full shadow-md hover:bg-yellow-500 transition">
                   Rever
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        
   

 
        {/* Tabs de Solicitações */}
        <div className="flex border-b-4 border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("novas")}
            className={`flex items-center gap-15 px-8 py-4 font-bold text-xl border-b-4 transition-all duration-200 ${
              activeTab === "novas"
                ? "border-yellow-400 text-blue-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Star className={`h-6 w-6 ${activeTab === "novas" ? "text-yellow-400" : "text-gray-400"}`} />
            NOVAS SOLICITAÇÕES ({solicitacoes.novas.length})
          </button>
          <button
            onClick={() => setActiveTab("andamento")}
            className={`flex items-center gap-15 px-8 py-4 font-bold text-xl border-b-4 transition-all duration-200 ${
              activeTab === "andamento"
                ? "border-yellow-400 text-blue-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <CheckCircle className={`h-6 w-6 ${activeTab === "andamento" ? "text-yellow-400" : "text-gray-400"}`} />
            EM ANDAMENTO ({solicitacoes.andamento.length})
          </button>
          <button
            onClick={() => setActiveTab("finalizadas")}
            className={`flex items-center gap-22 px-8 py-4 font-bold text-xl border-b-4 transition-all duration-200 ${
              activeTab === "finalizadas"
                ? "border-yellow-400 text-blue-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Download className={`h-6 w-6 ${activeTab === "finalizadas" ? "text-yellow-400" : "text-gray-400"}`} />
            FINALIZADAS ({solicitacoes.finalizadas.length})
          </button>
        </div>
      
      
     
          
        {/* Conteúdo das Solicitações */}
        {activeTab === "novas" && solicitacoes.novas.length > 0 && (
          <div className="space-y-8">
            {solicitacoes.novas.map((solicitacao) => (
              <div key={solicitacao.id} className="bg-white border-4 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Barra amarela com tipo de mentoria */}
                <div className="bg-yellow-400 text-blue-900 px-6 py-4 font-bold text-lg">
                  {solicitacao.tipo}
                </div>
                
                <div className="p-8">
                  {/* Nome do empreendedor */}
                  <h3 className="text-2xl font-bold text-blue-900 mb-6">
                    {solicitacao.nome}
                  </h3>
                  
                  {/* Desafios */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">
                      Desafios que o empreendedor enfrenta:
                    </h4>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {solicitacao.desafio}
                    </p>
                  </div>
                  {/* Data da solicitação */}
                  <div className="flex items-center justify-between py-2">
                     <div className="text-right">
                    <span className="text-gray-600 text-base font-medium">
                      Solicitado em: {solicitacao.data}
                    </span>
                  </div>
                  {/* Botão Conheça mais */}
                    <button
                      onClick={() => setSolicitacaoSelecionada(solicitacao)}
                      className=" bg-yellow-400 text-blue-900 font-medium text-sm h-8 px-15 py-2 rounded-full shadow-md hover:bg-yellow-500 transition"
                    >
                      Conheça mais
                    </button>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      
        {/* Conteúdo das Solicitações */}
        {activeTab === "andamento" && solicitacoes.andamento.length > 0 && (
          <div className="space-y-8">
            
            {solicitacoes.andamento.map((solicitacao) => (
              <div key={solicitacao.id} className="bg-white border-4 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Barra amarela com tipo de mentoria */}
                <div className="bg-yellow-400 text-blue-900 px-6 py-4 font-bold text-lg">
                  {solicitacao.tipo}
                </div>
                <div className="p-8" onClick={() => irParaAcompanhamento(solicitacao)}>
                  {/* Nome do empreendedor */}
                  <h3 className="text-2xl font-bold text-blue-900 mb-6">
                    {solicitacao.nome}
                  </h3>
                  
                  {/* Desafios */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">
                      Desafios que o empreendedor enfrenta:
                    </h4>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {solicitacao.desafio}
                    </p>
                  </div>
                  <div className="flex flex-col items-end-safe mb-4">
                    <ProgressBar progress={solicitacao.progresso ?? 0} size={40}/>
                  </div>
                  {/* Data da solicitação */}
                  <div className="text-right">
                    <span className="text-gray-600 text-base font-medium">
                      Solicitado em: {solicitacao.data}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conteúdo das Solicitações */}
        {activeTab === "finalizadas" && solicitacoes.finalizadas.length > 0 && (
          <div className="space-y-8">
            {solicitacoes.finalizadas.map((solicitacao) => (
              <div key={solicitacao.id} className="bg-white border-4 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Barra amarela com tipo de mentoria */}
                <div className="bg-yellow-400 text-blue-900 px-6 py-4 font-bold text-lg">
                  {solicitacao.tipo}
                </div>
                
                <div className="p-8">
                  {/* Nome do empreendedor */}
                  <h3 className="text-2xl font-bold text-blue-900 mb-6">
                    {solicitacao.nome}
                  </h3>
                  
                  {/* Desafios */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">
                      Desafios que o empreendedor enfrenta:
                    </h4>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {solicitacao.desafio}
                    </p>
                  </div>
                  
                  {/* Data da solicitação */}
                  <div className="text-right">
                    <span className="text-gray-600 text-base font-medium">
                      Solicitado em: {solicitacao.data}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado vazio para outras abas */}
        {((activeTab === "andamento" && solicitacoes.andamento.length === 0) ||
          (activeTab === "finalizadas" && solicitacoes.finalizadas.length === 0)) && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nenhuma solicitação {activeTab === "andamento" ? "em andamento" : "finalizada"}
            </h3>
            <p className="text-gray-600 text-lg">
              {activeTab === "andamento" 
                ? "Você não possui mentorias em andamento no momento."
                : "Nenhuma mentoria foi finalizada ainda."
              }
            </p>
          </div>
    
        )}
        
      </main>
        <MentoriaDetalhe
          solicitacao={solicitacaoSelecionada}
          onClose={() => setSolicitacaoSelecionada(null)}
        />
      <Footer />
    </div>
  );
}
