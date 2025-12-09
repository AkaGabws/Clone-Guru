import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/sections/Header";
import { Footer } from "../components/sections/Footer";

type MentoriaProps = {
  tipo: string;
  nome: string;
  desafio: string;
  negocio: string;
  area: string;
  sobreEmpreendedor: string;
  cursos: string[];
  dataInscricao: string;
  whatsapp?: string;
};

export default function MentoriaAcompanhamento() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: any };

  // Aceita state.mentoria OU state direto
  const mentoria = (location.state?.mentoria ?? location.state) as MentoriaProps | undefined;

  if (!mentoria) {
    return <div className="min-h-screen flex items-center justify-center p-6 text-red-600">Mentoria não encontrada</div>;
  } 

  const tipo = mentoria?.tipo ?? "MENTORIA GRATUITA";
  const subtitulo = tipo.includes(">") ? tipo.split(">").slice(1).join(">").trim() : "GESTÃO DE PESSOAS";
  const nome = mentoria?.nome ?? "—";
  const desafio = mentoria?.desafio ?? "—";
  const negocio = mentoria?.negocio ?? "—";
  const area = mentoria?.area ?? "—";
  const sobreEmpreendedor = mentoria?.sobreEmpreendedor ?? "—";
  const cursos = Array.isArray(mentoria?.cursos) ? mentoria!.cursos : [];
  const dataInscricao = mentoria?.dataInscricao ?? "dd/mm/ano";
  const whatsapp = mentoria?.whatsapp;

  const metaMinutos = 210;
  const [concluidos] = useState(0);
  const faltam = useMemo(() => Math.max(metaMinutos - concluidos, 0), [metaMinutos, concluidos]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header />
      
      {/* Botão Voltar */}
      <div className="bg-white">
        <div className="max-w-[980px] mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#003D74] hover:text-[#0B3D6D] transition font-semibold"
          >
            <ArrowLeft size={20} />
            <span className="text-sm uppercase tracking-wider">Voltar</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Principal - Card Branco */}
      <div className="max-w-[980px] mx-auto px-6 py-8 pb-12">
        <section className="bg-white rounded-b-lg shadow-lg px-8 py-10 space-y-8">
          
          {/* Título da Mentoria */}
          <div className="pb-4 border-b-2 border-gray-100">
            <h1 className="text-xl font-bold text-[#003D74] uppercase tracking-wide">
              {tipo.split(">")[0]?.trim() || "MENTORIA GRATUITA"}
              {" "}
              <span className=" text-lg  normal-case text-[#03569e] ml-2">{subtitulo}</span>
            </h1>
          </div>

          {/* Nome e Sobrenome */}
          <div className="space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#003D74] text-[#FFD400]">
              Nome e Sobrenome
            </span>
            <p className="text-sm leading-relaxed text-gray-700">{nome}</p>
          </div>

          {/* Desafios */}
          <div className="space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#003D74] text-[#FFD400]">
              Desafios que o(a) empreendedor(a) enfrenta
            </span>
            <p className="text-sm leading-relaxed text-gray-700">{desafio}</p>
          </div>

          {/* Sobre o negócio */}
          <div className="space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#003D74] text-[#FFD400]">
              Sobre o negócio
            </span>
            <p className="text-sm leading-relaxed text-gray-700">{negocio}</p>
          </div>

          {/* Área de atuação */}
          <div className="space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#003D74] text-[#FFD400]">
              Área de atuação
            </span>
            <div className="flex flex-wrap gap-2">
              <Chip color="blue">Setor</Chip>
              <Chip color="yellow">{area}</Chip>
            </div>
          </div>
      
          {/* Sobre o empreendedor */}
          <div className="space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#003D74] text-[#FFD400]">
              Sobre o(a) empreendedor(a)
            </span>
            <p className="text-sm leading-relaxed text-gray-700">{sobreEmpreendedor}</p>
          </div>

          {/* Cursos */}
          <div className="space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#003D74] text-[#FFD400]">
              Cursos que o(a) empreendedor(a) já fez no Tamo Junto
            </span>
            {cursos.length ? (
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                {cursos.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm italic text-gray-500">Não há cursos concluídos</p>
            )}
          </div>

          {/* Data de inscrição */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Chip color="blue">Inscrito(a) desde</Chip>
              <Chip color="yellow">{dataInscricao}</Chip>
            </div>
          </div>
        </section>

        {/* Botão WhatsApp - Separador entre sections */}
        {whatsapp && (
          <div className="flex justify-center py-8">
            <button 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm shadow-lg hover:bg-[#20BA5A] hover:shadow-xl transition-all" 
              onClick={() => window.open(`https://wa.me/${whatsapp}`, "_blank")}
            >
              Clique para acessar o contato via WhatsApp
            </button>
          </div>
        )}
      {/* Seção Azul - Acompanhamento */}
        <section className="bg-[#003D74] rounded-2xl shadow-lg px-10 py-10 text-white">
          {/* Título Principal */}
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#FFD400] mb-4">
            Acompanhe sua mentoria
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-white/95 mb-10">
            <p>
              A mentoria que você selecionou tem duração total de <strong className="font-bold text-white">{metaMinutos} minutos</strong>, 
              dos quais você já completou <strong className="font-bold text-white">{concluidos} minutos</strong>.
            </p>
            <p>
              Certifique-se de registrar cada encontro e acompanhar o progresso do(a) mentorado(a) para gerar a carga
              horária necessária e a emissão do certificado ao final da mentoria.
            </p>
          </div>

          {/* Formulário de Encontro */}
          <div className="mt-10">
            <h3 className="text-base font-bold uppercase tracking-wide text-[#FFD400] mb-2">
              Como foi a experiência desse encontro?
            </h3>
            <p className="text-sm text-white/90 mb-6">
              <strong>Encontro 1:</strong> Descreva como foi esse momento, os principais pontos discutidos e combinados e próximos passos
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Encontro salvo com sucesso!");
              }}
              className="space-y-5"
            >
              {/* Textarea */}
              <div>
                <textarea
                  className="w-full h-48 rounded-xl bg-white text-gray-900 p-4 text-sm outline-none
                             border-2 border-transparent focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/30 transition-all"
                  placeholder="Descreva como foi o encontro"
                />
              </div>

              {/* Campos de Duração e Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-xs uppercase tracking-wider text-white/90 font-semibold">
                    Duração do Encontro (em minutos)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={240}
                    className="w-full rounded-lg bg-white text-gray-900 px-4 py-3 text-sm outline-none
                               border-2 border-transparent focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/30 transition-all"
                    placeholder="Informe o tempo em minutos do encontro"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs uppercase tracking-wider text-white/90 font-semibold">
                    Data do Encontro
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg bg-white text-gray-900 px-4 py-3 text-sm outline-none
                               border-2 border-transparent focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/30 transition-all"
                  />
                </div>
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 text-sm text-white/95 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded" />
                <span>Não houve próximo encontro. Quero salvar</span>
              </label>

              {/* Botões */}
              <div className="flex flex-col items-center gap-4 pt-6">
                <button
                  type="submit"
                  className="px-10 py-3 rounded-full font-bold text-sm uppercase tracking-wide
                             bg-[#FFD400] text-[#003D74] hover:bg-[#FFC928] transition-all shadow-lg"
                >
                  Salvar encontro
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-[#FFD400] hover:text-white font-semibold text-sm underline underline-offset-4 transition-colors"
                >
                  Voltar
                </button>
              </div>
            </form>
          </div>
          
        </section>
      
      </div>

      <Footer />
    </div>
  );
}

/* --------- componentes auxiliares --------- */

function Chip({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: "blue" | "yellow" | "green" | "gray";
}) {
  const styles: Record<string, string> = {
    blue: "bg-[#EAF4FF] text-[#1E4E8C]",
    yellow: "bg-[#FFE680] text-[#7A5B00]",
    green: "bg-[#E8F8EE] text-[#1C6B3E]",
    gray: "bg-[#F4F6F8] text-[#374151]",
  };
  return (
    <span className={`inline-block px-3 py-[6px] rounded-full text-[12px] font-semibold ${styles[color]}`}>
      {children}
    </span>
  );
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <span className="inline-block text-[11px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full bg-[#EAF4FF] text-[#1E4E8C]">
        {label}
      </span>
      <div className="mt-2">{children}</div>

    </div>
  );
}
