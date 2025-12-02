import React from "react";
import { useCrm } from "../../store/CrmContext";
import { Button } from "../../components/ui/button";
import { StatusMentoria } from "../../types/crm";
import { MentoriaDetalhesModal, AcompanhamentoModal } from "./modals";
import { User, ChevronDown, ChevronRight, BookOpen, FileText } from "lucide-react";

const STATUS_MAP: Record<string, string> = {
  nova: 'Nova',
  ativa: 'Ativa',
  pausada: 'Pausada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  expirada: 'Expirada',
};

const STATUS_COLOR_MAP: Record<string, string> = {
  nova: 'bg-indigo-100 text-indigo-700',
  ativa: 'bg-emerald-200 text-emerald-800',
  pausada: 'bg-amber-200 text-amber-800',
  concluida: 'bg-lime-200 text-lime-800',
  cancelada: 'bg-rose-200 text-rose-800',
  expirada: 'bg-slate-200 text-slate-700',
};

interface EmpreendedorGroup {
  nome: string;
  mentorias: any[];
  totalMentorias: number;
  mentoriasAtivas: number;
  mentoriasConcluidas: number;
}

export function MentoriaLista() {
  const { state } = useCrm();
  
  // Estado para busca
  const [buscaLocal, setBuscaLocal] = React.useState("");
  
  // Filtro de projeto
  const [projectFilter, setProjectFilter] = React.useState<string>("todos");
  
  // Filtro de data
  const [dateFilter, setDateFilter] = React.useState<
    "todos" | "hoje" | "ultimos3Dias" | "ultimaSemana" | "ultimoMes" | "ultimoAno" | "custom"
  >("todos");
  const [customFrom, setCustomFrom] = React.useState<string>(""); // YYYY-MM-DD
  const [customTo, setCustomTo] = React.useState<string>(""); // YYYY-MM-DD
  
  // Estado para controlar quais empreendedores estão expandidos
  const [empreendedoresExpandidos, setEmpreendedoresExpandidos] = React.useState<Set<string>>(new Set());
  
  // Estado para modais
  const [mentoriaSelecionadaId, setMentoriaSelecionadaId] = React.useState<string | null>(null);
  const [mentoriaAcompanhamentoId, setMentoriaAcompanhamentoId] = React.useState<string | null>(null);

  // Agrupa mentorias por empreendedor
  const empreendedoresAgrupados = React.useMemo(() => {
    // Helper para range de datas
    function getDateRange() {
      const now = new Date();
      const startOfDay = (d: Date) => { const t = new Date(d); t.setHours(0,0,0,0); return t; };
      const endOfDay = (d: Date) => { const t = new Date(d); t.setHours(23,59,59,999); return t; };

      switch (dateFilter) {
        case "hoje":
          return { from: startOfDay(now), to: endOfDay(now) };
        case "ultimos3Dias": {
          const from = new Date(now); from.setDate(now.getDate() - 3); return { from: startOfDay(from), to: endOfDay(now) };
        }
        case "ultimaSemana": {
          const from = new Date(now); from.setDate(now.getDate() - 7); return { from: startOfDay(from), to: endOfDay(now) };
        }
        case "ultimoMes": {
          const from = new Date(now); from.setMonth(now.getMonth() - 1); return { from: startOfDay(from), to: endOfDay(now) };
        }
        case "ultimoAno": {
          const from = new Date(now); from.setFullYear(now.getFullYear() - 1); return { from: startOfDay(from), to: endOfDay(now) };
        }
        case "custom":
          if (!customFrom && !customTo) return null;
          const from = customFrom ? startOfDay(new Date(customFrom)) : undefined;
          const to = customTo ? endOfDay(new Date(customTo)) : undefined;
          if (!from && !to) return null;
          return { from: from ?? new Date(0), to: to ?? endOfDay(now) };
        default:
          return null;
      }
    }

    const range = getDateRange();

    const grupos: Record<string, EmpreendedorGroup> = {};

    state.mentorias.forEach((mentoria) => {
      // Filtro por projeto
      const byProjeto = projectFilter === "todos" ? true : mentoria.projetoId === projectFilter;
      
      // Filtro por data (ultimaAtualizacaoISO)
      const byDate = !range
        ? true
        : (() => {
            const d = mentoria.ultimaAtualizacaoISO ? new Date(mentoria.ultimaAtualizacaoISO) : null;
            if (!d) return false;
            return d >= range.from && d <= range.to;
          })();

      // Aplica filtros
      if (!byProjeto || !byDate) return;

      const nome = mentoria.empreendedor;
      
      if (!grupos[nome]) {
        grupos[nome] = {
          nome,
          mentorias: [],
          totalMentorias: 0,
          mentoriasAtivas: 0,
          mentoriasConcluidas: 0,
        };
      }

      grupos[nome].mentorias.push(mentoria);
      grupos[nome].totalMentorias++;
      
      if (mentoria.status === "ativa") {
        grupos[nome].mentoriasAtivas++;
      }
      if (mentoria.status === "concluida") {
        grupos[nome].mentoriasConcluidas++;
      }
    });

    // Aplica filtro de busca
    let resultado = Object.values(grupos);
    
    if (buscaLocal) {
      const buscaLower = buscaLocal.toLowerCase();
      resultado = resultado.filter(grupo => 
        grupo.nome.toLowerCase().includes(buscaLower) ||
        grupo.mentorias.some(m => {
          const projeto = state.projetos.find(p => p.id === m.projetoId);
          const mentor = m.mentorId ? state.mentores.find(x => x.id === m.mentorId) : null;
          return (
            m.negocio?.toLowerCase().includes(buscaLower) ||
            m.desafio?.toLowerCase().includes(buscaLower) ||
            projeto?.nome.toLowerCase().includes(buscaLower) ||
            mentor?.nome.toLowerCase().includes(buscaLower)
          );
        })
      );
    }

    // Ordena por nome do empreendedor
    return resultado.sort((a, b) => a.nome.localeCompare(b.nome));
  }, [state.mentorias, state.projetos, state.mentores, buscaLocal, projectFilter, dateFilter, customFrom, customTo]);

  const toggleExpandir = (nome: string) => {
    setEmpreendedoresExpandidos(prev => {
      const novo = new Set(prev);
      if (novo.has(nome)) {
        novo.delete(nome);
      } else {
        novo.add(nome);
      }
      return novo;
    });
  };

  // Conta encontros de uma mentoria
  const contarEncontros = (mentoriaId: string) => {
    return state.relatos.filter(r => r.mentoriaId === mentoriaId).length;
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          Administração de Empreendedores
        </h2>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="mb-4 flex gap-2 items-center flex-wrap">
        <input 
          type="text" 
          placeholder="Buscar por empreendedor, projeto, mentor..." 
          className="border rounded-md px-3 py-2 w-full max-w-md text-sm"
          value={buscaLocal}
          onChange={(e) => setBuscaLocal(e.target.value)}
        />
        
        {/* Filtro por Projeto */}
        <select
          className="border rounded-md h-9 px-2 text-sm bg-white"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          <option value="todos">Todos projetos</option>
          {state.projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        
        {/* Filtro por Data */}
        <select
          className="border rounded-md h-9 px-2 text-sm bg-white"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as any)}
        >
          <option value="todos">Todas datas</option>
          <option value="hoje">Hoje</option>
          <option value="ultimos3Dias">Últimos 3 dias</option>
          <option value="ultimaSemana">Última semana</option>
          <option value="ultimoMes">Último mês</option>
          <option value="ultimoAno">Último ano</option>
          <option value="custom">Custom</option>
        </select>

        {dateFilter === "custom" && (
          <div className="flex items-center gap-1">
            <input 
              type="date" 
              className="h-9 px-2 text-sm border rounded-md bg-white" 
              value={customFrom} 
              onChange={(e) => setCustomFrom(e.target.value)} 
            />
            <span className="text-xs text-gray-500">—</span>
            <input 
              type="date" 
              className="h-9 px-2 text-sm border rounded-md bg-white" 
              value={customTo} 
              onChange={(e) => setCustomTo(e.target.value)} 
            />
          </div>
        )}
      </div>

      {/* Tabela de Empreendedores e Mentorias */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-900 text-gray-600">
            <tr>
              <Th className="text-yellow-400">Projeto</Th>
              <Th className="text-yellow-400">Negócio</Th>
              <Th className="text-yellow-400">Status</Th>
              <Th className="text-yellow-400">Mentor</Th>
              <Th className="text-yellow-400">Encontros</Th>
              <Th className="text-yellow-400 text-right pr-10">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {empreendedoresAgrupados.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhum empreendedor encontrado
                </td>
              </tr>
            ) : (
              empreendedoresAgrupados.flatMap((grupo) => {
                const estaExpandido = empreendedoresExpandidos.has(grupo.nome);
                
                return [
                  // Linha do Empreendedor (cabeçalho)
                  <tr 
                    key={`header-${grupo.nome}`}
                    className="bg-blue-50 border-b-2 border-blue-200 cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleExpandir(grupo.nome)}
                  >
                    <Td colSpan={6} className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {estaExpandido ? (
                            <ChevronDown className="w-5 h-5 text-blue-900" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-blue-900" />
                          )}
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-900" />
                            <span className="font-bold text-blue-900 text-base">{grupo.nome}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="bg-blue-900 text-yellow-400 px-3 py-1 rounded-full font-semibold">
                            {grupo.totalMentorias} {grupo.totalMentorias === 1 ? 'Mentoria' : 'Mentorias'}
                          </span>
                          {grupo.mentoriasAtivas > 0 && (
                            <span className="bg-emerald-600 text-white px-3 py-1 rounded-full">
                              {grupo.mentoriasAtivas} {grupo.mentoriasAtivas === 1 ? 'Ativa' : 'Ativas'}
                            </span>
                          )}
                          {grupo.mentoriasConcluidas > 0 && (
                            <span className="bg-lime-600 text-white px-3 py-1 rounded-full">
                              {grupo.mentoriasConcluidas} {grupo.mentoriasConcluidas === 1 ? 'Concluída' : 'Concluídas'}
                            </span>
                          )}
                        </div>
                      </div>
                    </Td>
                  </tr>,
                  // Linhas das Mentorias (quando expandido)
                  ...(estaExpandido ? grupo.mentorias.map((mentoria) => {
                    const projeto = state.projetos.find(p => p.id === mentoria.projetoId);
                    const mentor = mentoria.mentorId ? state.mentores.find(x => x.id === mentoria.mentorId) : null;
                    const numEncontros = contarEncontros(mentoria.id);
                    
                    return (
                      <tr 
                        key={mentoria.id}
                        className="border-t hover:bg-gray-50 transition-colors bg-gray-50/50"
                      >
                        <Td className="pl-8">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">└─</span>
                            <span className="text-sm text-gray-700">{projeto?.nome ?? "—"}</span>
                          </div>
                        </Td>
                        <Td>
                          <span className="text-sm text-gray-600">{mentoria.negocio || "—"}</span>
                        </Td>
                        <Td>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold border inline-block ${STATUS_COLOR_MAP[mentoria.status] || 'bg-gray-100 text-gray-700'}`}>
                            {STATUS_MAP[mentoria.status] || mentoria.status}
                          </span>
                        </Td>
                        <Td>
                          <span className="text-sm text-gray-700">{mentor?.nome || "Sem mentor"}</span>
                        </Td>
                        <Td>
                          <div className="text-sm text-gray-700">
                            <div>Plataforma: <strong>{numEncontros}</strong></div>
                            {mentoria.numEncontrosAcompanhamento !== undefined && (
                              <div className="text-xs text-gray-500">
                                Acomp.: <strong>{mentoria.numEncontrosAcompanhamento}</strong>
                              </div>
                            )}
                          </div>
                        </Td>
                        <Td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMentoriaSelecionadaId(mentoria.id);
                              }}
                              className="h-8 px-3 bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-500 text-xs flex items-center gap-1 whitespace-nowrap"
                            >
                              <BookOpen className="w-3 h-3" />
                              Encontros
                            </Button>
                            {mentoria.status !== "nova" && mentoria.status !== "expirada" && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMentoriaAcompanhamentoId(mentoria.id);
                                }}
                                variant="outline"
                                className="h-8 px-3 text-xs flex items-center gap-1 whitespace-nowrap"
                              >
                                <FileText className="w-3 h-3" />
                                Acomp.
                              </Button>
                            )}
                          </div>
                        </Td>
                      </tr>
                    );
                  }) : [])
                ];
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modais */}
      {mentoriaSelecionadaId && (
        <MentoriaDetalhesModal 
          mentoriaId={mentoriaSelecionadaId} 
          onClose={() => setMentoriaSelecionadaId(null)} 
        />
      )}

      {mentoriaAcompanhamentoId && (
        <AcompanhamentoModal 
          mentoriaId={mentoriaAcompanhamentoId} 
          onClose={() => setMentoriaAcompanhamentoId(null)} 
        />
      )}
    </div>
  );
}

// Componentes Auxiliares
function Th({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <th className={`text-left font-semibold px-3 py-2 ${className}`}>{children}</th>;
}

function Td({ children, className = "", colSpan }: React.PropsWithChildren<{ className?: string; colSpan?: number }>) {
  return <td className={`px-3 py-3 align-middle ${className}`} colSpan={colSpan}>{children}</td>;
}
