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
   

    <div className="min-h-screen  bg-white">
      <Header />
      {/* Topo branco */}
      <div className="max-w-[980px] mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#136082] hover:text-[#0B3D6D] transition"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium uppercase tracking-wide">Voltar</span>
        </button>
      </div>
      <div className="h-[3px] bg-[#FFD400]"/>

      {/* Card branco com cantos inferiores arredondados */}
      <section className="max-w-[980px] mx-auto bg-white rounded-b-[28px] shadow-md px-5 sm:px-6 md:px-8 pt-10 pb-2">
        <div className="mb-5">
          <h1 className="text-[13px] sm:text-sm font-extrabold text-[#136082] uppercase tracking-[0.12em]">
            {tipo.split(">")[0]?.trim() || "MENTORIA GRATUITA"}
            <span className="ml-3 font-semibold normal-case tracking-normal text-[#000000]">{subtitulo}</span>
          </h1>
        </div>

        <div className="mt-4">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full bg-[#003D74] text-[#FFDE1A]">
            Nome e Sobrenome
          </span>
          <div className="mt-2"></div>
          <p className="text-[13px] sm:text-[14px] leading-6 text-[#1F2937]">{nome}</p>
        </div>

        <div className="mt-4">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full bg-[#003D74] text-[#FFDE1A]">
            Desafios que o(a) empreendedor(a) enfrenta
          </span>
          <div className="mt-2"></div>
          <p className="text-[13px] sm:text-[14px] leading-6 text-[#1F2937]">{desafio}</p>
        </div>

        <div className="mt-4">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full bg-[#003D74] text-[#FFDE1A]">
            Sobre o negócio
          </span>
          <div className="mt-2"></div>
          <p className="text-[13px] sm:text-[14px] leading-6 text-[#1F2937]">{negocio}</p>
        </div>

        <div className="mt-4">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full bg-[#003D74] text-[#FFDE1A]">
            Área de atuação
          </span>
          <div className="mt-2">
            <div className="flex flex-wrap gap-2 mt-1">
              <Chip color="blue">Setor</Chip>
              <Chip color="yellow">{area}</Chip>
            </div>
          </div>
        </div>
      
        <div className="mt-4">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full bg-[#003D74] text-[#FFDE1A]">
            Sobre o(a) empreendedor(a)
          </span>
          <div className="mt-2">
            <p className="text-[13px] sm:text-[14px] leading-6 text-[#1F2937]">{sobreEmpreendedor}</p>
          </div>
        </div>

        <div className="mt-4">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full bg-[#003D74] text-[#FFDE1A]">
            Cursos que o(a) empreendedor(a) já fez no Tamo Junto
          </span>
          <div className="mt-2">
            {cursos.length ? (
              <ul className="list-disc pl-5 text-[13px] sm:text-[14px] text-[#1F2937]">
                {cursos.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] sm:text-[14px] text-[#5B6C7B]">Não há cursos concluídos</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Chip color="blue">Inscrito(a) desde</Chip>
            <Chip color="yellow">{dataInscricao}</Chip>
          </div>
        </div>

        {/* : WhatsApp */}
        <div className="max-w-[980px] px-66 pt-20   " >
                      <button
                        onClick={() => window.open(`https://wa.me/${whatsapp}`, "_blank")}
                        className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 rounded-full
                                  bg-[#25D366] text-white font-semibold shadow hover:brightness-110 transition"
                        disabled={!whatsapp}
                        >
                      Clique para acessar o contato via WhatsApp            
                    </button>
                  </div> 
      </section>

      {/* Card azul com cantos inferiores arredondados */}
      <section className="max-w-[980px] mx-auto bg-[#0b3d6d] px-4 sm:px-6 md:px-8 py-8 rounded-b-[30px] shadow-md  pb-10 text-white " >
          
          <h3 className=" mt-6 text-[15px] sm:text-base font-extrabold tracking-wide uppercase">Acompanhe sua mentoria</h3>
          <div className="mt-2 space-y-2 text-[13px] sm:text-[14px] leading-6 text-white/90">
            <p>
              A mentoria que você selecionou tem duração total de <b>{metaMinutos} minutos</b>, dos quais você já
              completou <b>{concluidos} minutos</b>.
            </p>
            <p>
              Certifique-se de registrar cada encontro e acompanhar o progresso do(a) mentorado(a) para gerar a carga
              horária necessária e a emissão do certificado ao final da mentoria.
            </p>
          </div>

          <div className="mt-8">
            <h4 className="text-[15px] sm:text-base font-extrabold uppercase tracking-wide">
              Como foi a experiência desse encontro?
            </h4>
            <p className="mt-1 text-white/90 text-[13px] sm:text-[14px]">
              Encontro 1: Descreva como foi esse momento, os principais pontos discutidos e combinados e próximos
              passos
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("UI-only: aqui você pode salvar no localStorage quando quiser.");
              }}
              className="mt-3"
            >
              <textarea
                className="w-full h-44 sm:h-56 rounded-lg bg-white text-[#1F2937] p-3 outline-none
                           border border-white/20 focus:border-[#FFC928] focus:ring-2 focus:ring-[#FFC928]/40"
                placeholder="Descreva como foi o encontro"
              />

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[12px] uppercase tracking-wide text-white/80">
                    Duração do Encontro (em minutos)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={240}
                    className="w-full rounded-lg bg-white text-[#1F2937] p-2 outline-none
                               border border-white/20 focus:border-[#FFC928] focus:ring-2 focus:ring-[#FFC928]/40"
                    placeholder="Informe o tempo em minutos do encontro"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[12px] uppercase tracking-wide text-white/80">
                    Data do Encontro
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg bg-white text-[#1F2937] p-2 outline-none
                               border border-white/20 focus:border-[#FFC928] focus:ring-2 focus:ring-[#FFC928]/40"
                  />
                </div>
              </div>

              <label className="mt-3 flex items-start gap-2 text-white/90 text-sm">
                <input type="checkbox" className="mt-[3px]" />
                Não houve próximo encontro. Quero salvar
              </label>

              <div className="mt-5 flex flex-wrap gap-8 items-center justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full font-bold text-[#0B3D6D]
                             bg-[#FFC928] hover:brightness-110 transition"
                >
                  Salvar encontro
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-8 items-center justify-center">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-yellow-400 hover:text-white underline underline-offset-4"
                >
                  Voltar
                </button>
              </div>
            </form>
          </div>
          
        </section>
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
