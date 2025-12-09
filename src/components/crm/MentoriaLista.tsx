import React from "react";
import { useCrm } from "../../store/CrmContext";
import { Button } from "../../components/ui/button";
import { StatusMentoria } from "../../types/crm";
import { MentoriaDetalhesModal, AcompanhamentoModal } from "./modals";
import { User, BookOpen, FileText, ChevronLeft, ChevronRight, Eye, Check } from "lucide-react";

interface EmpreendedorData {
  empreendedor: string;
  mentorias: any[];
  totalMentorias: number;
  mentoriasAtivas: number;
  mentoriasConcluidas: number;
  mentoriasPausadas: number;
  mentoriasCanceladas: number;
  totalEncontros: number;
  mentoriasComEncontros: number;
  mentoriasSemEncontros: number;
}

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

export function MentoriaLista() {
  const { state, dispatch } = useCrm();
  
  // Estado para busca
  const [buscaLocal, setBuscaLocal] = React.useState("");
  
  // Filtro de projeto
  const [projectFilter, setProjectFilter] = React.useState<string>("todos");
  
  // Filtro de status
  const [statusFilter, setStatusFilter] = React.useState<string>("todos");
  
  // Filtro de data
  const [dateFilter, setDateFilter] = React.useState<
    "todos" | "hoje" | "ultimos3Dias" | "ultimaSemana" | "ultimoMes" | "ultimoAno" | "custom"
  >("todos");
  const [customFrom, setCustomFrom] = React.useState<string>(""); // YYYY-MM-DD
  const [customTo, setCustomTo] = React.useState<string>(""); // YYYY-MM-DD
  
  // Paginação
  const [paginaAtual, setPaginaAtual] = React.useState(1);
  const [itensPorPagina, setItensPorPagina] = React.useState(20);
  
  // Estado para modais
  const [empreendedorSelecionado, setEmpreendedorSelecionado] = React.useState<string | null>(null);
  const [mentoriaSelecionadaId, setMentoriaSelecionadaId] = React.useState<string | null>(null);
  const [mentoriaAcompanhamentoId, setMentoriaAcompanhamentoId] = React.useState<string | null>(null);

  // Helper para range de datas
  const getDateRange = React.useCallback(() => {
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
  }, [dateFilter, customFrom, customTo]);

  // Agrupa mentorias por empreendedor e calcula estatísticas
  const empreendedoresComDados = React.useMemo(() => {
    const range = getDateRange();
    
    // Primeiro filtra as mentorias
    let mentoriasFiltradas = state.mentorias.filter((mentoria) => {
      // Filtro por projeto
      const byProjeto = projectFilter === "todos" ? true : mentoria.projetoId === projectFilter;
      
      // Filtro por status
      const byStatus = statusFilter === "todos" ? true : mentoria.status === statusFilter;
      
      // Filtro por data (ultimaAtualizacaoISO)
      const byDate = !range
        ? true
        : (() => {
            const d = mentoria.ultimaAtualizacaoISO ? new Date(mentoria.ultimaAtualizacaoISO) : null;
            if (!d) return false;
            return d >= range.from && d <= range.to;
          })();

      return byProjeto && byStatus && byDate;
    });

    // Agrupa por empreendedor
    const grupos: Record<string, EmpreendedorData> = {};
    
    mentoriasFiltradas.forEach(mentoria => {
      const nome = mentoria.empreendedor;
      
      if (!grupos[nome]) {
        grupos[nome] = {
          empreendedor: nome,
          mentorias: [],
          totalMentorias: 0,
          mentoriasAtivas: 0,
          mentoriasConcluidas: 0,
          mentoriasPausadas: 0,
          mentoriasCanceladas: 0,
          totalEncontros: 0,
          mentoriasComEncontros: 0,
          mentoriasSemEncontros: 0
        };
      }
      
      grupos[nome].mentorias.push(mentoria);
      grupos[nome].totalMentorias++;
      
      // Conta por status
      if (mentoria.status === "ativa") grupos[nome].mentoriasAtivas++;
      if (mentoria.status === "concluida") grupos[nome].mentoriasConcluidas++;
      if (mentoria.status === "pausada") grupos[nome].mentoriasPausadas++;
      if (mentoria.status === "cancelada") grupos[nome].mentoriasCanceladas++;
      
      // Conta encontros
      const numEncontros = state.relatos.filter(r => r.mentoriaId === mentoria.id).length;
      grupos[nome].totalEncontros += numEncontros;
      
      if (numEncontros > 0) {
        grupos[nome].mentoriasComEncontros++;
      } else {
        grupos[nome].mentoriasSemEncontros++;
      }
    });

    let resultado = Object.values(grupos);

    // Filtro de busca
    if (buscaLocal) {
      const buscaLower = buscaLocal.toLowerCase();
      resultado = resultado.filter(grupo => {
        // Busca no nome do empreendedor
        if (grupo.empreendedor.toLowerCase().includes(buscaLower)) return true;
        
        // Busca nas mentorias do empreendedor
        return grupo.mentorias.some(mentoria => {
          const projeto = state.projetos.find(p => p.id === mentoria.projetoId);
          const mentor = mentoria.mentorId ? state.mentores.find(x => x.id === mentoria.mentorId) : null;
          return (
            mentoria.negocio?.toLowerCase().includes(buscaLower) ||
            mentoria.desafio?.toLowerCase().includes(buscaLower) ||
            projeto?.nome.toLowerCase().includes(buscaLower) ||
            mentor?.nome.toLowerCase().includes(buscaLower)
          );
        });
      });
    }

    // Ordena por nome do empreendedor
    return resultado.sort((a, b) => a.empreendedor.localeCompare(b.empreendedor));
  }, [state.mentorias, state.projetos, state.mentores, state.relatos, buscaLocal, projectFilter, statusFilter, getDateRange]);

  // Calcula paginação
  const totalEmpreendedores = empreendedoresComDados.length;
  const totalPaginas = Math.ceil(totalEmpreendedores / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const empreendedoresPaginados = empreendedoresComDados.slice(indiceInicio, indiceFim);

  // Reset página quando filtros mudam
  React.useEffect(() => {
    setPaginaAtual(1);
  }, [buscaLocal, projectFilter, statusFilter, dateFilter, customFrom, customTo]);

  // Conta encontros de uma mentoria
  const contarEncontros = (mentoriaId: string) => {
    return state.relatos.filter(r => r.mentoriaId === mentoriaId).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-blue-900">
          Administração de Empreendedores
        </h2>
        <div className="text-sm text-gray-600">
          <strong>{totalEmpreendedores}</strong> empreendedores • <strong>{empreendedoresComDados.reduce((acc, e) => acc + e.totalMentorias, 0)}</strong> mentorias
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="mb-4 flex gap-2 items-center flex-wrap">
        <input 
          type="text" 
          placeholder="Buscar empreendedor (nome, negócio, projeto, mentor...)" 
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

        {/* Filtro por Status */}
        <select
          className="border rounded-md h-9 px-2 text-sm bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="todos">Todos status</option>
          <option value="nova">Nova</option>
          <option value="ativa">Ativa</option>
          <option value="pausada">Pausada</option>
          <option value="concluida">Concluída</option>
          <option value="cancelada">Cancelada</option>
          <option value="expirada">Expirada</option>
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

        {/* Itens por página */}
        <select
          className="border rounded-md h-9 px-2 text-sm bg-white ml-auto"
          value={itensPorPagina}
          onChange={(e) => {
            setItensPorPagina(Number(e.target.value));
            setPaginaAtual(1);
          }}
        >
          <option value={20}>20 por página</option>
          <option value={50}>50 por página</option>
          <option value={100}>100 por página</option>
        </select>
      </div>

      {/* Tabela de Empreendedores */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-900 text-yellow-400">
            <tr>
              <Th>Empreendedor</Th>
              <Th className="text-center">Total</Th>
              <Th className="text-center">Ativas</Th>
              <Th className="text-center">Concluídas</Th>
              <Th className="text-center">Encontros</Th>
              <Th className="text-center">Com Encontros</Th>
              <Th className="text-center">Sem Encontros</Th>
              <Th className="text-right pr-4">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {empreendedoresPaginados.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  Nenhum empreendedor encontrado
                </td>
              </tr>
            ) : (
              empreendedoresPaginados.map((dados) => {
                return (
                  <tr 
                    key={dados.empreendedor}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <Td>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-900" />
                        <span className="font-medium text-gray-900">{dados.empreendedor}</span>
                      </div>
                    </Td>
                    <Td className="text-center">
                      <span className="font-semibold text-blue-900">{dados.totalMentorias}</span>
                    </Td>
                    <Td className="text-center">
                      {dados.mentoriasAtivas > 0 ? (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {dados.mentoriasAtivas}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </Td>
                    <Td className="text-center">
                      {dados.mentoriasConcluidas > 0 ? (
                        <span className="bg-lime-100 text-lime-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {dados.mentoriasConcluidas}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </Td>
                    <Td className="text-center">
                      <span className="text-sm font-medium text-gray-700">{dados.totalEncontros}</span>
                    </Td>
                    <Td className="text-center">
                      {dados.mentoriasComEncontros > 0 ? (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {dados.mentoriasComEncontros}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </Td>
                    <Td className="text-center">
                      {dados.mentoriasSemEncontros > 0 ? (
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {dados.mentoriasSemEncontros}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <Button
                        onClick={() => setEmpreendedorSelecionado(dados.empreendedor)}
                        variant="outline"
                        className="h-8 px-3 text-xs flex items-center gap-1 whitespace-nowrap"
                      >
                        <Eye className="w-3 h-3" />
                        Ver Detalhes
                      </Button>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginação */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border rounded-lg">
          <div className="text-sm text-gray-600">
            Mostrando {indiceInicio + 1} a {Math.min(indiceFim, totalEmpreendedores)} de {totalEmpreendedores} empreendedores
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="h-8 px-3 text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                let pageNum: number;
                if (totalPaginas <= 5) {
                  pageNum = i + 1;
                } else if (paginaAtual <= 3) {
                  pageNum = i + 1;
                } else if (paginaAtual >= totalPaginas - 2) {
                  pageNum = totalPaginas - 4 + i;
                } else {
                  pageNum = paginaAtual - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPaginaAtual(pageNum)}
                    className={`h-8 w-8 text-xs rounded ${
                      paginaAtual === pageNum
                        ? 'bg-blue-900 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
              className="h-8 px-3 text-xs flex items-center gap-1"
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Empreendedor */}
      {empreendedorSelecionado && (
        <EmpreendedorDetalhesModal
          empreendedor={empreendedorSelecionado}
          onClose={() => setEmpreendedorSelecionado(null)}
          onAbrirEncontros={(mentoriaId) => {
            setMentoriaSelecionadaId(mentoriaId);
            setEmpreendedorSelecionado(null);
          }}
          onAbrirAcompanhamento={(mentoriaId) => {
            setMentoriaAcompanhamentoId(mentoriaId);
            setEmpreendedorSelecionado(null);
          }}
        />
      )}

      {/* Modais de Mentoria */}
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

// Modal de Detalhes do Empreendedor
function EmpreendedorDetalhesModal({ 
  empreendedor, 
  onClose,
  onAbrirEncontros,
  onAbrirAcompanhamento
}: { 
  empreendedor: string; 
  onClose: () => void;
  onAbrirEncontros: (mentoriaId: string) => void;
  onAbrirAcompanhamento: (mentoriaId: string) => void;
}) {
  const { state } = useCrm();
  
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Busca todas as mentorias do empreendedor
  const mentorias = state.mentorias.filter(m => m.empreendedor === empreendedor);
  
  // Calcula estatísticas
  const totalMentorias = mentorias.length;
  const mentoriasAtivas = mentorias.filter(m => m.status === "ativa").length;
  const mentoriasConcluidas = mentorias.filter(m => m.status === "concluida").length;
  const mentoriasPausadas = mentorias.filter(m => m.status === "pausada").length;
  const mentoriasCanceladas = mentorias.filter(m => m.status === "cancelada").length;
  const mentoriasNovas = mentorias.filter(m => m.status === "nova").length;
  
  const totalEncontros = mentorias.reduce((acc, m) => {
    return acc + state.relatos.filter(r => r.mentoriaId === m.id).length;
  }, 0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-[10000] bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-900 border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-yellow-400">{empreendedor}</h2>
              <div className="text-sm text-white">{totalMentorias} mentoria{totalMentorias !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Estatísticas */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Estatísticas Gerais</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-900">{totalMentorias}</div>
                <div className="text-xs text-gray-600 font-medium mt-1">Total de Mentorias</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center border-2 border-emerald-200">
                <div className="text-3xl font-bold text-emerald-700">{mentoriasAtivas}</div>
                <div className="text-xs text-gray-600 font-medium mt-1">Ativas</div>
              </div>
              <div className="bg-lime-50 rounded-lg p-4 text-center border-2 border-lime-200">
                <div className="text-3xl font-bold text-lime-700">{mentoriasConcluidas}</div>
                <div className="text-xs text-gray-600 font-medium mt-1">Concluídas</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-indigo-50 rounded-lg p-3 text-center border border-indigo-200">
                <div className="text-xl font-bold text-indigo-700">{mentoriasNovas}</div>
                <div className="text-xs text-gray-600 mt-0.5">Novas</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
                <div className="text-xl font-bold text-amber-700">{mentoriasPausadas}</div>
                <div className="text-xs text-gray-600 mt-0.5">Pausadas</div>
              </div>
              <div className="bg-rose-50 rounded-lg p-3 text-center border border-rose-200">
                <div className="text-xl font-bold text-rose-700">{mentoriasCanceladas}</div>
                <div className="text-xs text-gray-600 mt-0.5">Canceladas</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                <div className="text-xl font-bold text-purple-700">{totalEncontros}</div>
                <div className="text-xs text-gray-600 mt-0.5">Total Encontros</div>
              </div>
            </div>
          </div>

          {/* Lista de Mentorias */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Mentorias</h3>
            <div className="space-y-3">
              {mentorias.map((mentoria) => {
                const projeto = state.projetos.find(p => p.id === mentoria.projetoId);
                const mentor = mentoria.mentorId ? state.mentores.find(x => x.id === mentoria.mentorId) : null;
                const numEncontros = state.relatos.filter(r => r.mentoriaId === mentoria.id).length;
                
                return (
                  <div key={mentoria.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    {/* Header da Mentoria */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{projeto?.nome || "—"}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLOR_MAP[mentoria.status] || 'bg-gray-100 text-gray-700'}`}>
                            {STATUS_MAP[mentoria.status] || mentoria.status}
                          </span>
                        </div>
                        {mentoria.negocio && (
                          <div className="text-sm text-gray-600">Negócio: {mentoria.negocio}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => onAbrirEncontros(mentoria.id)}
                          size="sm"
                          className="h-7 px-2 text-xs"
                        >
                          <BookOpen className="w-3 h-3 mr-1" />
                          Encontros ({numEncontros})
                        </Button>
                        {mentoria.status !== "nova" && mentoria.status !== "expirada" && (
                          <Button
                            onClick={() => onAbrirAcompanhamento(mentoria.id)}
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Acomp.
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Detalhes da Mentoria */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Mentor:</span>
                        <span className="ml-2 font-medium">{mentor?.nome || "Sem mentor"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Encontros:</span>
                        <span className={`ml-2 font-medium flex items-center gap-1 ${numEncontros > 0 ? 'text-purple-700' : 'text-orange-600'}`}>
                          {numEncontros > 0 ? (
                            <>
                              {numEncontros} registrados <Check className="w-3 h-3" />
                            </>
                          ) : (
                            'Nenhum encontro ainda'
                          )}
                        </span>
                      </div>
                      {mentoria.desafio && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Desafio:</span>
                          <p className="text-gray-700 mt-1 text-xs line-clamp-2">{mentoria.desafio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
          <Button onClick={onClose} className="bg-blue-900 hover:bg-blue-800">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

// Componentes Auxiliares
function Th({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <th className={`text-left font-semibold px-3 py-2 text-sm ${className}`}>{children}</th>;
}

function Td({ children, className = "", colSpan }: React.PropsWithChildren<{ className?: string; colSpan?: number }>) {
  return <td className={`px-3 py-2 align-middle ${className}`} colSpan={colSpan}>{children}</td>;
}
