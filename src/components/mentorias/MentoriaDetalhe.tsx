import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


type MentoriaDetalheProps = {
  solicitacao: {
    tipo: string;
    nome: string;
    desafio: string;
    data: string;
    negocio: string;
    area: string;
    sobreEmpreendedor: string;
    cursos: string[];
    dataInscricao: string;
    whatsapp?: string;
  } | null;

  onClose: () => void;
};

export function MentoriaDetalhe({ solicitacao, onClose }: MentoriaDetalheProps) {
  const navigate = useNavigate();
  if (!solicitacao) return null;

  // Separa título e subtítulo (tudo depois do ">")
  const [tituloPrincipal, ...rest] = (solicitacao.tipo || "").split(">");
  const subtitulo = rest.join(">").trim();

  const handleAceitar = () => {
    navigate("/mentoria-acompanhamento", {
      state: {
        mentoria: {
          tipo: solicitacao.tipo,
          nome: solicitacao.nome,
          desafio: solicitacao.desafio,
          negocio: solicitacao.negocio,
          area: solicitacao.area,
          sobreEmpreendedor: solicitacao.sobreEmpreendedor,
          cursos: solicitacao.cursos,
          dataInscricao: solicitacao.data,
        },
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
        
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[#136082] hover:text-[#0B3D6D] transition"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-bold uppercase tracking-wide">Voltar</span>
            </button>
            
            <div className="ml-3 h-6 border-l-2 border-dashed border-[#136082]/70" />
          </div>
        </div>
        <div className="h-[3px] w-full bg-[#FFD400]" />

        
        <div className="px-6 py-6">
          
          <div className="mb-4">
            <div className="text-[13px] sm:text-sm font-extrabold text-[#003D74] uppercase tracking-[0.12em]">
              {(tituloPrincipal || "Mentoria Gratuita").trim()}
              {subtitulo && (
                <span className="ml-2 font-semibold normal-case tracking-normal text-[#5B6C7B]">
                  • {subtitulo}
                </span>
              )}
            </div>
          </div>

          
          <div className="text-[#0f1b2d] text-[15px] sm:text-base font-semibold mb-4">
            Tem alguém que deseja ser mentorado por você!{" "}
            <span className="font-normal">Conheça:</span>
          </div>

          
          <div className="mt-3">
            <div className="inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[#003D74] text-[#FFDE1A]">
              Nome e Sobrenome
            </div>
            <div className="mt-2 text-[13px] sm:text-[14px] leading-6 text-[#1F2937]">
              {solicitacao.nome}
            </div>
          </div>

          
          <div className="mt-4">
            <div className="inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[#003D74] text-[#FFDE1A]">
              Desafio que o/a empreendedor/a enfrenta
            </div>
            <div className="mt-2 text-[13px] sm:text-[14px] leading-6 text-[#1F2937] whitespace-pre-line">
              {solicitacao.desafio}
            </div>
          </div>

          
          <div className="mt-4">
            <div className="inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[#003D74] text-[#FFDE1A]">
              Sobre o negócio
            </div>
            <div className="mt-2 text-[13px] sm:text-[14px] leading-6 text-[#1F2937]">
              {solicitacao.negocio}
            </div>
          </div>

          
          <div className="mt-4">
            <div className="inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[#003D74] text-[#FFDE1A]">
              Área de atuação
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="px-3 py-[6px] rounded-full text-[12px] font-semibold bg-[#FFDE1A] text-[#003D74]">
                Serviços
              </div>
              <div className="px-3 py-[6px] rounded-full text-[12px] font-semibold bg-[#FFDE1A] text-[#003D74]">
                {solicitacao.area}
              </div>
            </div>
          </div>

          
          <div className="mt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-[6px] rounded-full text-[12px] font-semibold bg-[#0C3960] text-white">
                Setor
              </div>
              <div className="px-3 py-[6px] rounded-full text-[12px] font-semibold bg-[#FFDE1A] text-[#003D74]">
                {solicitacao.area}
              </div>
            </div>
          </div>

          
          <div className="mt-4">
            <div className="inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[#003D74] text-[#FFDE1A]">
              Sobre o/a empreendedor/a
            </div>
            <div className="mt-2 text-[13px] sm:text-[14px] leading-6 text-[#1F2937]">
             {solicitacao.sobreEmpreendedor}
            </div>
          </div>

          
          <div className="mt-4">
            <div className="inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[#003D74] text-[#FFDE1A]">
              Cursos que o/a empreendedor/a já fez no Tamo junto
            </div>
            <div className="mt-2 text-[13px] sm:text-[14px] text-[#5B6C7B]">
              {solicitacao.cursos.length ? solicitacao.cursos.join(", ") : "Não há cursos concluídos"}
            </div>
          </div>

          
          <div className="mt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-[6px] rounded-full text-[12px] font-semibold bg-[#0C3960] text-white">
                Data da solicitação
              </div>
              <div className="px-3 py-[6px] rounded-full text-[12px] font-semibold bg-[#FFDE1A] text-[#003D74]">
                {solicitacao.data}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <div className="flex justify-center">
              <button
                onClick={handleAceitar}
                className="px-10 py-2 rounded-full bg-[#25D366] text-white font-bold tracking-wide shadow hover:brightness-110 transition"
              >
                ACEITAR
              </button>
            </div>
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-[#003D74] hover:underline underline-offset-4"
              >
                Prefiro não aceitar essa mentoria
              </button>
            </div>
          </div>
        </div>
        {/* /CONTEÚDO */}
      </div>
      {/* /CARD */}
    </div>
  );
}