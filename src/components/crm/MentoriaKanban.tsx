import React from "react";
import { Button } from "../../components/ui/button";
import { useCrm } from "../../store/CrmContext";
import { StatusMentoria } from "../../types/crm";
import { User, Video, CheckSquare, Edit, AlertTriangle, Info, Check, Calendar } from "lucide-react";
import { Filter, Users, KanbanSquare, List, NotebookPen } from "lucide-react";
import { MentoriaDetalhesModal, BuscarMentorModal, AcompanhamentoModal } from "./modals";


const STATUS_MAP: Record<string, string> = {
  nova: 'Nova',
  ativa: 'Ativa',
  pausada: 'Pausada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  expirada: 'Expirada',
};

const colorMap: Record<string, string> = {
  nova: 'bg-indigo-100 text-indigo-700',
  ativa: 'bg-emerald-200 text-emerald-800',
  pausada: 'bg-amber-200 text-amber-800',
  concluida: 'bg-lime-200 text-lime-800',
  cancelada: 'bg-rose-200 text-rose-800',
  expirada: 'bg-slate-200 text-slate-700',
};

const STATUS_ACOMPANHAMENTO_MAP: Record<string, string> = {
  mentoria_ocorrendo: 'Mentoria Ocorrendo',
  mentoria_nao_iniciada: 'Não Iniciada',
  mentoria_parada: 'Mentoria Parada',
  aguardando_retorno_empreendedor: 'Aguardando Empreendedor',
  aguardando_retorno_mentor: 'Aguardando Mentor',
  mentor_empreendedor_nao_responde: 'Sem Resposta',
  mentoria_finalizada: 'Finalizada',
  mentoria_cancelada: 'Cancelada',
  empreendedor_desistiu: 'Empreendedor Desistiu',
  mentoria_atrasada: 'Atrasada',
};

const colorAcompanhamentoMap: Record<string, string> = {
  mentoria_ocorrendo: 'bg-emerald-100 text-emerald-700',
  mentoria_nao_iniciada: 'bg-gray-100 text-gray-700',
  mentoria_parada: 'bg-amber-100 text-amber-700',
  aguardando_retorno_empreendedor: 'bg-orange-100 text-orange-700',
  aguardando_retorno_mentor: 'bg-blue-100 text-blue-700',
  mentor_empreendedor_nao_responde: 'bg-red-100 text-red-700',
  mentoria_finalizada: 'bg-lime-100 text-lime-700',
  mentoria_cancelada: 'bg-rose-100 text-rose-700',
  empreendedor_desistiu: 'bg-rose-100 text-rose-700',
  mentoria_atrasada: 'bg-red-100 text-red-700',
};

export function MentoriaKanban() {
  const { state, dispatch } = useCrm();
  
  // Estado para busca local
  const [buscaLocal, setBuscaLocal] = React.useState("");
  
  // Estado para controlar qual mentoria está aberta no Modal
  const [mentoriaSelecionadaId, setMentoriaSelecionadaId] = React.useState<string | null>(null);
  // Estado para controlar qual mentoria está aberta no Modal de Acompanhamento
  const [mentoriaAcompanhamentoId, setMentoriaAcompanhamentoId] = React.useState<string | null>(null);
  
  // Seleção em massa
  const [modoSelecao, setModoSelecao] = React.useState(false);
  const [mentoriasSelecionadas, setMentoriasSelecionadas] = React.useState<Set<string>>(new Set());
  const [mostrarModalEmMassa, setMostrarModalEmMassa] = React.useState(false);
  
  // Modal de filtros
  const [mostrarModalFiltros, setMostrarModalFiltros] = React.useState(false);
  
  // Filtro de visualização (abas)
  const [abaAtiva, setAbaAtiva] = React.useState<"pendentes" | "ativas" | "concluidas" | "canceladas" | "expiradas" >("pendentes");

  // Filtro de data local
  const [dateFilter, setDateFilter] = React.useState<
    "todos" | "hoje" | "ultimos3Dias" | "ultimaSemana" | "ultimoMes" | "ultimoAno" | "custom"
  >("todos");
  const [customFrom, setCustomFrom] = React.useState<string>(""); // YYYY-MM-DD
  const [customTo, setCustomTo] = React.useState<string>(""); // YYYY-MM-DD

  // Filtro de projeto local (adicionado)
  const [projectFilter, setProjectFilter] = React.useState<string>("todos");

  // Filtro de área/solicitação
  const [areaFilter, setAreaFilter] = React.useState<string>("todos");

  // Filtro de quantidade de encontros (custom é o padrão)
  const [encontrosFilter, setEncontrosFilter] = React.useState<string>("custom");
  const [customMinEncontros, setCustomMinEncontros] = React.useState<string>("");
  const [customMaxEncontros, setCustomMaxEncontros] = React.useState<string>("");

  // Filtro de status de acompanhamento
  const [statusAcompanhamentoFilter, setStatusAcompanhamentoFilter] = React.useState<string>("todos");

  // Extrai lista única de áreas de negócio
  const areasDisponiveis = React.useMemo(() => {
    const areas = new Set<string>();
    state.mentorias.forEach(m => {
      if (m.negocio) areas.add(m.negocio);
    });
    return Array.from(areas).sort();
  }, [state.mentorias]);

  // Filtra mentorias
  const mentoriasFiltradas = React.useMemo(() => {
    const { status, mentorId, projetoId } = state.filtro;

    // helper: retorna { from, to } or null to skip date filtering
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

    return state.mentorias
      .filter((m) => {
        const mentor = m.mentorId ? state.mentores.find((x) => x.id === m.mentorId) : null;
        const projeto = state.projetos.find((p) => p.id === m.projetoId);

        // Filtro por aba
        let byAba = true;
        switch(abaAtiva) {
        case "pendentes":
          // pendentes: mostrar todas as mentorias com status "nova"
          byAba = m.status === "nova";
            break;
          case "ativas":
          // ativas precisam ter mentor vinculado
          byAba = m.status === "ativa" && !!m.mentorId;
            break;
          case "concluidas":
            byAba = m.status === "concluida";
            break;
          case "canceladas":
            byAba = m.status === "cancelada";
            break;
          case "expiradas":
            byAba = String(m.status) === "expirada";
            break;
        }
        if (!byAba) return false;

        // Filtros dropdown
        const byStatus = !status || status === "todas" ? true : m.status === status;
        const byMentor = !mentorId || mentorId === "todos" ? true : m.mentorId === mentorId;
        // combina filtro global (state.filtro.projetoId) com filtro local projectFilter
        const byProjetoGlobal = !projetoId || projetoId === "todos" ? true : m.projetoId === projetoId;
        const byProjetoLocal = projectFilter === "todos" ? true : m.projetoId === projectFilter;
        const byProjeto = byProjetoGlobal && byProjetoLocal;
        
        // Filtro por área/solicitação
        const byArea = areaFilter === "todos" ? true : m.negocio === areaFilter;
        
        // Busca local
        const textoBusca = [
          m.empreendedor, 
          m.negocio, 
          m.desafio, 
          mentor?.nome, 
          projeto?.nome,
        ].filter(Boolean).join(" ").toLowerCase();

        const byBusca = !buscaLocal
          ? true
          : textoBusca.includes(buscaLocal.toLowerCase());

        // Filtro por data (ultimaAtualizacaoISO)
        const byDate = !range
          ? true
          : (() => {
              const d = m.ultimaAtualizacaoISO ? new Date(m.ultimaAtualizacaoISO) : null;
              if (!d) return false;
              return d >= range.from && d <= range.to;
            })();

        // Filtro por quantidade de encontros
        const numEncontros = state.relatos.filter(r => r.mentoriaId === m.id).length;
        let byEncontros = true;
        if (encontrosFilter === "todos") {
          byEncontros = true;
        } else if (encontrosFilter === "custom") {
          // Filtro customizado: range entre min e max
          // Se ambos estiverem vazios, não filtra
          if (!customMinEncontros && !customMaxEncontros) {
            byEncontros = true;
          } else {
            const min = customMinEncontros ? parseInt(customMinEncontros) : 0;
            const max = customMaxEncontros ? parseInt(customMaxEncontros) : Infinity;
            // Valida se os valores são números válidos
            if (isNaN(min) && isNaN(max)) {
              byEncontros = true;
            } else if (isNaN(min)) {
              byEncontros = numEncontros <= max;
            } else if (isNaN(max)) {
              byEncontros = numEncontros >= min;
            } else {
              byEncontros = numEncontros >= min && numEncontros <= max;
            }
          }
        } else {
          // Filtros pré-definidos
          switch (encontrosFilter) {
            case "0":
              byEncontros = numEncontros === 0;
              break;
            case "1-3":
              byEncontros = numEncontros >= 1 && numEncontros <= 3;
              break;
            case "4-6":
              byEncontros = numEncontros >= 4 && numEncontros <= 6;
              break;
            case "7-10":
              byEncontros = numEncontros >= 7 && numEncontros <= 10;
              break;
            case "11+":
              byEncontros = numEncontros > 10;
              break;
            default:
              byEncontros = true;
          }
        }

        // Filtro por status de acompanhamento
        let byStatusAcompanhamento = true;
        if (statusAcompanhamentoFilter !== "todos") {
          if (statusAcompanhamentoFilter === "sem_status") {
            // Filtrar mentorias sem status de acompanhamento definido
            byStatusAcompanhamento = !m.statusAcompanhamento;
          } else {
            byStatusAcompanhamento = m.statusAcompanhamento === statusAcompanhamentoFilter;
          }
        }

        return byStatus && byMentor && byProjeto && byArea && byBusca && byDate && byEncontros && byStatusAcompanhamento;
      })
      .sort((a, b) => (a.ultimaAtualizacaoISO < b.ultimaAtualizacaoISO ? 1 : -1));
  // dependências: inclui filtros de data e encontros
  }, [state.mentorias, state.filtro, state.mentores, state.projetos, state.relatos, buscaLocal, abaAtiva, dateFilter, customFrom, customTo, projectFilter, areaFilter, encontrosFilter, customMinEncontros, customMaxEncontros, statusAcompanhamentoFilter]);

  // Contadores para as abas - DINÂMICOS baseados nos filtros
  const contadores = React.useMemo(() => {
    const { status, mentorId, projetoId } = state.filtro;

    // Função helper para aplicar filtros (mesma lógica da mentoriasFiltradas, mas sem filtro de aba)
    const aplicarFiltros = (mentorias: any[]) => {
      return mentorias.filter((m) => {
        const mentor = m.mentorId ? state.mentores.find((x) => x.id === m.mentorId) : null;
        const projeto = state.projetos.find((p) => p.id === m.projetoId);

        // Filtros dropdown
        const byStatus = !status || status === "todas" ? true : m.status === status;
        const byMentor = !mentorId || mentorId === "todos" ? true : m.mentorId === mentorId;
        const byProjetoGlobal = !projetoId || projetoId === "todos" ? true : m.projetoId === projetoId;
        const byProjetoLocal = projectFilter === "todos" ? true : m.projetoId === projectFilter;
        const byProjeto = byProjetoGlobal && byProjetoLocal;
        
        // Filtro por área/solicitação
        const byArea = areaFilter === "todos" ? true : m.negocio === areaFilter;
        
        // Busca local
        const textoBusca = [
          m.empreendedor, 
          m.negocio, 
          m.desafio, 
          mentor?.nome, 
          projeto?.nome,
        ].filter(Boolean).join(" ").toLowerCase();

        const byBusca = !buscaLocal
          ? true
          : textoBusca.includes(buscaLocal.toLowerCase());

        // Filtro por data
        let byDate = true;
        if (dateFilter !== "todos") {
          const now = new Date();
          const startOfDay = (d: Date) => { const t = new Date(d); t.setHours(0,0,0,0); return t; };
          const endOfDay = (d: Date) => { const t = new Date(d); t.setHours(23,59,59,999); return t; };
          
          let range = null;
          switch (dateFilter) {
            case "hoje":
              range = { from: startOfDay(now), to: endOfDay(now) };
              break;
            case "ultimos3Dias": {
              const from = new Date(now); from.setDate(now.getDate() - 3);
              range = { from: startOfDay(from), to: endOfDay(now) };
              break;
            }
            case "ultimaSemana": {
              const from = new Date(now); from.setDate(now.getDate() - 7);
              range = { from: startOfDay(from), to: endOfDay(now) };
              break;
            }
            case "ultimoMes": {
              const from = new Date(now); from.setMonth(now.getMonth() - 1);
              range = { from: startOfDay(from), to: endOfDay(now) };
              break;
            }
            case "ultimoAno": {
              const from = new Date(now); from.setFullYear(now.getFullYear() - 1);
              range = { from: startOfDay(from), to: endOfDay(now) };
              break;
            }
            case "custom":
              if (customFrom || customTo) {
                const from = customFrom ? startOfDay(new Date(customFrom)) : undefined;
                const to = customTo ? endOfDay(new Date(customTo)) : undefined;
                if (from || to) {
                  range = { from: from ?? new Date(0), to: to ?? endOfDay(now) };
                }
              }
              break;
          }
          
          if (range) {
            const d = m.ultimaAtualizacaoISO ? new Date(m.ultimaAtualizacaoISO) : null;
            byDate = d ? (d >= range.from && d <= range.to) : false;
          }
        }

        // Filtro por quantidade de encontros
        const numEncontros = state.relatos.filter(r => r.mentoriaId === m.id).length;
        let byEncontros = true;
        if (encontrosFilter === "0") {
          byEncontros = numEncontros === 0;
        } else if (encontrosFilter === "custom") {
          if (customMinEncontros || customMaxEncontros) {
            const min = customMinEncontros ? parseInt(customMinEncontros) : 0;
            const max = customMaxEncontros ? parseInt(customMaxEncontros) : Infinity;
            if (!isNaN(min) || !isNaN(max)) {
              byEncontros = numEncontros >= (isNaN(min) ? 0 : min) && numEncontros <= (isNaN(max) ? Infinity : max);
            }
          }
        }

        // Filtro por status de acompanhamento
        let byStatusAcompanhamento = true;
        if (statusAcompanhamentoFilter !== "todos") {
          if (statusAcompanhamentoFilter === "sem_status") {
            byStatusAcompanhamento = !m.statusAcompanhamento;
          } else {
            byStatusAcompanhamento = m.statusAcompanhamento === statusAcompanhamentoFilter;
          }
        }

        return byStatus && byMentor && byProjeto && byArea && byBusca && byDate && byEncontros && byStatusAcompanhamento;
      });
    };

    // Aplica filtros para cada aba
    const mentoriasFiltradas = aplicarFiltros(state.mentorias);

    return {
      pendentes: mentoriasFiltradas.filter(m => m.status === "nova").length,
      ativas: mentoriasFiltradas.filter(m => m.status === "ativa" && !!m.mentorId).length,
      concluidas: mentoriasFiltradas.filter(m => m.status === "concluida").length,
      canceladas: mentoriasFiltradas.filter(m => m.status === "cancelada").length,
      expiradas: mentoriasFiltradas.filter(m => String(m.status) === "expirada").length,
      todas: mentoriasFiltradas.length,
    };
  }, [state.mentorias, state.filtro, state.mentores, state.projetos, state.relatos, buscaLocal, projectFilter, areaFilter, dateFilter, customFrom, customTo, encontrosFilter, customMinEncontros, customMaxEncontros, statusAcompanhamentoFilter]);

  // Funções de seleção em massa
  const toggleSelecionarMentoria = (mentoriaId: string) => {
    setMentoriasSelecionadas(prev => {
      const novo = new Set(prev);
      if (novo.has(mentoriaId)) {
        novo.delete(mentoriaId);
      } else {
        novo.add(mentoriaId);
      }
      return novo;
    });
  };

  const selecionarTodas = () => {
    const todasIds = mentoriasFiltradas.map(m => m.id);
    setMentoriasSelecionadas(new Set(todasIds));
  };

  const desmarcarTodas = () => {
    setMentoriasSelecionadas(new Set());
  };

  const ativarModoSelecao = () => {
    setModoSelecao(true);
    setMentoriasSelecionadas(new Set());
  };

  const cancelarModoSelecao = () => {
    setModoSelecao(false);
    setMentoriasSelecionadas(new Set());
  };

  // Conta filtros ativos
  const filtrosAtivos = React.useMemo(() => {
    let count = 0;
    if (buscaLocal.trim()) count++;
    if (projectFilter !== "todos") count++;
    if (areaFilter !== "todos") count++;
    if (dateFilter !== "todos") count++;
    if (encontrosFilter !== "custom" && encontrosFilter !== "todos") count++;
    if ((encontrosFilter === "custom") && (customMinEncontros || customMaxEncontros)) count++;
    if (statusAcompanhamentoFilter !== "todos") count++;
    return count;
  }, [buscaLocal, projectFilter, areaFilter, dateFilter, encontrosFilter, customMinEncontros, customMaxEncontros, statusAcompanhamentoFilter]);

  // Limpar todos os filtros
  const limparFiltros = () => {
    setBuscaLocal("");
    setProjectFilter("todos");
    setAreaFilter("todos");
    setDateFilter("todos");
    setCustomFrom("");
    setCustomTo("");
    setEncontrosFilter("custom");
    setCustomMinEncontros("");
    setCustomMaxEncontros("");
    setStatusAcompanhamentoFilter("todos");
  };

  return (
    <div className="space-y-4">
      {/* Header com abas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-blue-900">
            Gestão de Mentorias
          </h2>
          
          {/* Botão para ativar modo de seleção */}
          {!modoSelecao && (
            <Button
              onClick={ativarModoSelecao}
              variant="outline"
              className="h-9 flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              Modo Seleção
            </Button>
          )}
        </div>
        
        {/* Abas de navegação */}
        <div className="flex gap-2 border-b mb-4">
          <TabButton 
            active={abaAtiva === "pendentes"}
            onClick={() => setAbaAtiva("pendentes")}
            count={contadores.pendentes}
            
          >
            Pendentes
          </TabButton>
          <TabButton 
            active={abaAtiva === "ativas"}
            onClick={() => setAbaAtiva("ativas")}
            count={contadores.ativas}
          >
            Em Andamento
          </TabButton>
          <TabButton 
            active={abaAtiva === "concluidas"}
            onClick={() => setAbaAtiva("concluidas")}
            count={contadores.concluidas}
          >
            Concluídas
          </TabButton>
          <TabButton 
            active={abaAtiva === "canceladas"}
            onClick={() => setAbaAtiva("canceladas")}
            count={contadores.canceladas}
          >
            Canceladas
          </TabButton>
          <TabButton 
            active={abaAtiva === "expiradas"}
            onClick={() => setAbaAtiva("expiradas")}
            count={contadores.expiradas}
          >
            Expiradas
          </TabButton>
        </div>
      </div>
      {/* Barra de Busca e Filtros */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-2 items-center">
          <input 
              type="text" 
              placeholder="Buscar por mentor, empreendedor, área ou desafio..." 
              className="border rounded-md px-3 py-2 flex-1 text-sm"
              value={buscaLocal}
              onChange={(e) => setBuscaLocal(e.target.value)}
          />
          
          {/* Botão de Filtros */}
          <Button
            onClick={() => setMostrarModalFiltros(true)}
            variant="outline"
            className="h-10 px-4 flex items-center gap-2 relative"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {filtrosAtivos > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {filtrosAtivos}
              </span>
            )}
          </Button>
        </div>

        {/* Resumo de Filtros Ativos - Sempre visível quando há filtros */}
        {filtrosAtivos > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-700" />
                <span className="text-sm font-semibold text-blue-900">
                  Filtros Ativos ({filtrosAtivos})
                </span>
              </div>
              <button
                onClick={limparFiltros}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1"
              >
                <span>Limpar todos</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {buscaLocal.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <Users className="w-3.5 h-3.5" />
                  <span><strong>Busca:</strong> "{buscaLocal}"</span>
                  <button
                    onClick={() => setBuscaLocal("")}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover busca"
                    title="Remover busca"
                  >
                    ×
                  </button>
                </span>
              )}

              {projectFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <KanbanSquare className="w-3.5 h-3.5" />
                  <span><strong>Projeto:</strong> {state.projetos.find(p => p.id === projectFilter)?.nome}</span>
                  <button
                    onClick={() => setProjectFilter("todos")}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover filtro"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </span>
              )}

              {areaFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  <span><strong>Área:</strong> {areaFilter}</span>
                  <button
                    onClick={() => setAreaFilter("todos")}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover filtro"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </span>
              )}

              {dateFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    <strong>Data:</strong>{' '}
                    {dateFilter === "custom" 
                      ? (() => {
                          if (customFrom && customTo) {
                            return `${new Date(customFrom).toLocaleDateString('pt-BR')} até ${new Date(customTo).toLocaleDateString('pt-BR')}`;
                          } else if (customFrom) {
                            return `A partir de ${new Date(customFrom).toLocaleDateString('pt-BR')}`;
                          } else if (customTo) {
                            return `Até ${new Date(customTo).toLocaleDateString('pt-BR')}`;
                          }
                          return "Personalizado";
                        })()
                      : dateFilter === "hoje" ? "Hoje"
                      : dateFilter === "ultimos3Dias" ? "Últimos 3 dias"
                      : dateFilter === "ultimaSemana" ? "Última semana"
                      : dateFilter === "ultimoMes" ? "Último mês"
                      : dateFilter === "ultimoAno" ? "Último ano"
                      : dateFilter}
                  </span>
                  <button
                    onClick={() => {
                      setDateFilter("todos");
                      setCustomFrom("");
                      setCustomTo("");
                    }}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover filtro"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </span>
              )}

              {encontrosFilter !== "custom" && encontrosFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>
                    <strong>Encontros:</strong> {encontrosFilter === "0" ? "Sem encontros" : encontrosFilter}
                  </span>
                  <button
                    onClick={() => setEncontrosFilter("custom")}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover filtro"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </span>
              )}

              {(encontrosFilter === "custom") && (customMinEncontros || customMaxEncontros) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>
                    <strong>Encontros:</strong> {customMinEncontros || "0"} - {customMaxEncontros || "∞"}
                  </span>
                  <button
                    onClick={() => {
                      setCustomMinEncontros("");
                      setCustomMaxEncontros("");
                    }}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover filtro"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </span>
              )}

              {statusAcompanhamentoFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  <span>
                    <strong>Status Acomp.:</strong>{' '}
                    {statusAcompanhamentoFilter === "sem_status" 
                      ? "Sem status" 
                      : STATUS_ACOMPANHAMENTO_MAP[statusAcompanhamentoFilter as keyof typeof STATUS_ACOMPANHAMENTO_MAP]
                    }
                  </span>
                  <button
                    onClick={() => setStatusAcompanhamentoFilter("todos")}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover filtro"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Lista de mentorias */}
      <div className="space-y-3">
        {mentoriasFiltradas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">Nenhuma mentoria encontrada nesta categoria</p>
          </div>
        ) : (
          mentoriasFiltradas.map((m) => {
            const projeto = state.projetos.find((p) => p.id === m.projetoId);
            const mentor = m.mentorId ? state.mentores.find((x) => x.id === m.mentorId) : undefined;
            
            return (
              <MatchCard 
                key={m.id} 
                mentoria={m} 
                projeto={projeto} 
                mentor={mentor}
                onAbrirEncontros={() => setMentoriaSelecionadaId(m.id)}
                onAbrirAcompanhamento={() => setMentoriaAcompanhamentoId(m.id)}
                abaAtiva={abaAtiva}
                modoSelecao={modoSelecao}
                selecionada={mentoriasSelecionadas.has(m.id)}
                onToggleSelecao={() => toggleSelecionarMentoria(m.id)}
              />
            );
          })
        )}
      </div>

      {/* Renderiza o Modal se houver ID selecionado */}
      {mentoriaSelecionadaId && (
          <MentoriaDetalhesModal 
            mentoriaId={mentoriaSelecionadaId} 
            onClose={() => setMentoriaSelecionadaId(null)} 
          />
      )}

      {/* Renderiza o Modal de Acompanhamento se houver ID selecionado */}
      {mentoriaAcompanhamentoId && (
          <AcompanhamentoModal 
            mentoriaId={mentoriaAcompanhamentoId} 
            onClose={() => setMentoriaAcompanhamentoId(null)} 
          />
      )}

      {/* Barra Flutuante de Ações em Massa */}
      {modoSelecao && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-900 shadow-2xl z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  <strong className="text-blue-900 text-lg">{mentoriasSelecionadas.size}</strong> 
                  <span className="ml-1">mentoria{mentoriasSelecionadas.size !== 1 ? 's' : ''} selecionada{mentoriasSelecionadas.size !== 1 ? 's' : ''}</span>
                </span>
                <button
                  onClick={selecionarTodas}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Selecionar todas ({mentoriasFiltradas.length})
                </button>
                <button
                  onClick={desmarcarTodas}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium underline"
                >
                  Limpar seleção
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                {mentoriasSelecionadas.size > 0 && (
                  <Button
                    onClick={() => setMostrarModalEmMassa(true)}
                    className="bg-blue-900 hover:bg-blue-800 text-white h-10 px-6"
                  >
                    Alterar Status em Massa
                  </Button>
                )}
                <Button
                  onClick={cancelarModoSelecao}
                  variant="outline"
                  className="h-10"
                >
                  Sair do Modo Seleção
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ações em Massa */}
      {mostrarModalEmMassa && (
        <ModalMudancaStatusEmMassa
          mentoriasIds={Array.from(mentoriasSelecionadas)}
          onClose={() => setMostrarModalEmMassa(false)}
          onConfirmar={(novoStatus) => {
            // Atualiza todas as mentorias selecionadas
            mentoriasSelecionadas.forEach(mentoriaId => {
              dispatch({
                type: "MUDAR_STATUS",
                payload: { mentoriaId, status: novoStatus }
              });
            });
            setMentoriasSelecionadas(new Set());
            setMostrarModalEmMassa(false);
            setModoSelecao(false);
          }}
        />
      )}

      {/* Modal de Filtros Avançados */}
      {mostrarModalFiltros && (
        <ModalFiltrosAvancados
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          areaFilter={areaFilter}
          setAreaFilter={setAreaFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          customFrom={customFrom}
          setCustomFrom={setCustomFrom}
          customTo={customTo}
          setCustomTo={setCustomTo}
          encontrosFilter={encontrosFilter}
          setEncontrosFilter={setEncontrosFilter}
          customMinEncontros={customMinEncontros}
          setCustomMinEncontros={setCustomMinEncontros}
          customMaxEncontros={customMaxEncontros}
          setCustomMaxEncontros={setCustomMaxEncontros}
          statusAcompanhamentoFilter={statusAcompanhamentoFilter}
          setStatusAcompanhamentoFilter={setStatusAcompanhamentoFilter}
          projetos={state.projetos}
          areasDisponiveis={areasDisponiveis}
          abaAtiva={abaAtiva}
          filtrosAtivos={filtrosAtivos}
          onClose={() => setMostrarModalFiltros(false)}
          onLimpar={limparFiltros}
        />
      )}
    </div>
  );
}

// Modal de Mudança de Status em Massa
function ModalMudancaStatusEmMassa({ 
  mentoriasIds, 
  onClose, 
  onConfirmar 
}: { 
  mentoriasIds: string[]; 
  onClose: () => void; 
  onConfirmar: (novoStatus: StatusMentoria) => void;
}) {
  const [statusSelecionado, setStatusSelecionado] = React.useState<StatusMentoria>("ativa");

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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-[10000] bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-blue-900">Alterar Status em Massa</h2>
          <p className="text-sm text-gray-600 mt-1">
            {mentoriasIds.length} mentoria{mentoriasIds.length > 1 ? 's' : ''} selecionada{mentoriasIds.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o novo status:
          </label>
          <select
            value={statusSelecionado}
            onChange={(e) => setStatusSelecionado(e.target.value as StatusMentoria)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            {Object.entries(STATUS_MAP).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                <strong>Atenção:</strong> Esta ação irá alterar o status de todas as mentorias selecionadas. Esta ação não pode ser desfeita facilmente.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button 
            onClick={() => onConfirmar(statusSelecionado)}
            className="bg-blue-900 hover:bg-blue-800"
          >
            Confirmar Alteração
          </Button>
        </div>
      </div>
    </div>
  );
}

// Modal de Filtros Avançados
function ModalFiltrosAvancados({
  projectFilter,
  setProjectFilter,
  areaFilter,
  setAreaFilter,
  dateFilter,
  setDateFilter,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  encontrosFilter,
  setEncontrosFilter,
  customMinEncontros,
  setCustomMinEncontros,
  customMaxEncontros,
  setCustomMaxEncontros,
  statusAcompanhamentoFilter,
  setStatusAcompanhamentoFilter,
  projetos,
  areasDisponiveis,
  abaAtiva,
  filtrosAtivos,
  onClose,
  onLimpar,
}: {
  projectFilter: string;
  setProjectFilter: (v: string) => void;
  areaFilter: string;
  setAreaFilter: (v: string) => void;
  dateFilter: string;
  setDateFilter: (v: any) => void;
  customFrom: string;
  setCustomFrom: (v: string) => void;
  customTo: string;
  setCustomTo: (v: string) => void;
  encontrosFilter: string;
  setEncontrosFilter: (v: string) => void;
  customMinEncontros: string;
  setCustomMinEncontros: (v: string) => void;
  customMaxEncontros: string;
  setCustomMaxEncontros: (v: string) => void;
  statusAcompanhamentoFilter: string;
  setStatusAcompanhamentoFilter: (v: string) => void;
  projetos: any[];
  areasDisponiveis: string[];
  abaAtiva: string;
  filtrosAtivos: number;
  onClose: () => void;
  onLimpar: () => void;
}) {
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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-[10000] bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-900 px-6 py-4 flex items-center justify-between border-b z-10">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-yellow-400" />
            <div>
              <h2 className="text-xl font-bold text-yellow-400">Filtros Avançados</h2>
              {filtrosAtivos > 0 && (
                <p className="text-sm text-white">{filtrosAtivos} filtro{filtrosAtivos > 1 ? 's' : ''} ativo{filtrosAtivos > 1 ? 's' : ''}</p>
              )}
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
          {/* Seção: Projeto e Área */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
              <KanbanSquare className="w-4 h-4" />
              Projeto e Área
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Projeto</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                >
                  <option value="todos">Todos projetos</option>
                  {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Área de Atuação</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                >
                  <option value="todos">Todas áreas</option>
                  {areasDisponiveis.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Seção: Data */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Período</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Filtro de Data</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                >
                  <option value="todos">Todas as datas</option>
                  <option value="hoje">Hoje</option>
                  <option value="ultimos3Dias">Últimos 3 dias</option>
                  <option value="ultimaSemana">Última semana</option>
                  <option value="ultimoMes">Último mês</option>
                  <option value="ultimoAno">Último ano</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              {dateFilter === "custom" && (
                <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-blue-200">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Data Inicial</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 text-sm border rounded-md bg-white"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Data Final</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 text-sm border rounded-md bg-white"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seção: Encontros (apenas para abas não-pendentes) */}
          {abaAtiva !== "pendentes" && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Quantidade de Encontros</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">Filtro de Encontros</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                    value={encontrosFilter}
                    onChange={(e) => setEncontrosFilter(e.target.value)}
                  >
                    <option value="todos">Todos os encontros</option>
                    <option value="0">Sem encontros</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                {encontrosFilter === "custom" && (
                  <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-blue-200">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-medium">Mínimo</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Ex: 0"
                        className="w-full px-3 py-2 text-sm border rounded-md bg-white"
                        value={customMinEncontros}
                        onChange={(e) => setCustomMinEncontros(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 font-medium">Máximo</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Ex: 10"
                        className="w-full px-3 py-2 text-sm border rounded-md bg-white"
                        value={customMaxEncontros}
                        onChange={(e) => setCustomMaxEncontros(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seção: Status de Acompanhamento (apenas para abas não-pendentes) */}
          {abaAtiva !== "pendentes" && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Status de Acompanhamento</h3>
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Status</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={statusAcompanhamentoFilter}
                  onChange={(e) => setStatusAcompanhamentoFilter(e.target.value)}
                >
                  <option value="todos">Todos os status</option>
                  <option value="sem_status">Sem status definido</option>
                  {Object.entries(STATUS_ACOMPANHAMENTO_MAP).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
          <Button
            onClick={() => {
              onLimpar();
              onClose();
            }}
            variant="outline"
            className="text-gray-700"
          >
            Limpar Filtros
          </Button>
          <Button
            onClick={onClose}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}

// Modal de Confirmação de Reabertura
function ModalConfirmarReabertura({
  mentoria,
  onClose,
  onConfirmar,
}: {
  mentoria: any;
  onClose: () => void;
  onConfirmar: () => void;
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

  const projeto = mentoria.projetoId ? state.projetos.find((p: any) => p.id === mentoria.projetoId) : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-[10000] bg-white rounded-lg shadow-2xl w-full max-w-md border-2 border-red-300">
        {/* Header com destaque de alerta */}
        <div className="px-6 py-4 border-b bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-red-900">Confirmar Reabertura de Mentoria</h2>
              <p className="text-sm text-red-700 mt-1">Esta ação requer confirmação explícita</p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          {/* Alerta principal */}
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-red-900">
                  Atenção: Você está prestes a reabrir uma mentoria cancelada!
                </p>
                <p className="text-xs text-red-800">
                  Esta ação irá criar uma <strong>nova mentoria</strong> baseada na mentoria cancelada atual. 
                  A mentoria original permanecerá cancelada e uma nova mentoria será adicionada ao sistema.
                </p>
              </div>
            </div>
          </div>

          {/* Informações da mentoria */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-xs font-semibold text-gray-700 mb-2">Detalhes da Mentoria:</p>
            <div className="space-y-1 text-xs text-gray-700">
              <div className="flex gap-2">
                <span className="font-medium">Empreendedor:</span>
                <span>{mentoria.empreendedor}</span>
              </div>
              {projeto && (
                <div className="flex gap-2">
                  <span className="font-medium">Projeto:</span>
                  <span>{projeto.nome}</span>
                </div>
              )}
              {mentoria.negocio && (
                <div className="flex gap-2">
                  <span className="font-medium">Área:</span>
                  <span>{mentoria.negocio}</span>
                </div>
              )}
              {mentoria.desafio && (
                <div className="flex gap-2">
                  <span className="font-medium">Desafio:</span>
                  <span className="line-clamp-2">{mentoria.desafio}</span>
                </div>
              )}
            </div>
          </div>

          {/* Aviso adicional */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                <strong>Importante:</strong> Certifique-se de que realmente deseja reabrir esta mentoria. 
                Esta ação não pode ser desfeita facilmente.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onConfirmar}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Confirmar Reabertura
          </Button>
        </div>
      </div>
    </div>
  );
}

// Modal de Edição de Projeto e Área
function ModalEditarMentoria({
  mentoria,
  localProjetoId,
  setLocalProjetoId,
  localArea,
  setLocalArea,
  projetos,
  areasDisponiveis,
  onClose,
  onSalvar,
}: {
  mentoria: any;
  localProjetoId: string;
  setLocalProjetoId: (v: string) => void;
  localArea: string;
  setLocalArea: (v: string) => void;
  projetos: any[];
  areasDisponiveis: string[];
  onClose: () => void;
  onSalvar: (projetoId: string, area: string) => void;
}) {
  const [tempProjetoId, setTempProjetoId] = React.useState(localProjetoId);
  const [tempArea, setTempArea] = React.useState(localArea || "");

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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-[10000] bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-blue-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Edit className="w-5 h-5 text-yellow-400" />
              <div>
                <h2 className="text-xl font-bold text-yellow-400">Editar Solicitação</h2>
                <p className="text-sm text-white">{mentoria.empreendedor}</p>
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
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          {/* Alerta explicativo */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                Use esta opção para corrigir a solicitação caso o empreendedor tenha escolhido o projeto ou área incorretos.
              </p>
            </div>
          </div>

          {/* Projeto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Projeto
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={tempProjetoId}
              onChange={(e) => setTempProjetoId(e.target.value)}
            >
              {projetos.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área de Atuação
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={tempArea}
              onChange={(e) => setTempArea(e.target.value)}
            >
              {!tempArea && <option value="">Selecionar área...</option>}
              {areasDisponiveis.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Preview das mudanças */}
          <div className="pt-3 border-t">
            <p className="text-xs font-medium text-gray-500 mb-2">Preview:</p>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-blue-900">
                  {projetos.find(p => p.id === tempProjetoId)?.nome}
                </span>
                {tempArea && (
                  <>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-700">{tempArea}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button
            onClick={() => onSalvar(tempProjetoId, tempArea)}
            className="bg-blue-900 hover:bg-blue-800 text-white"
            disabled={!tempArea}
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
}

// Componente de Tab
function TabButton({ 
  active, 
  onClick, 
  count, 
  children,
  color = "blue"
}: { 
  active: boolean; 
  onClick: () => void; 
  count: number; 
  children: React.ReactNode;
  color?: "yellow" | "blue" | "green" | "red" | "gray";
}) {
  const colorClasses = {
    yellow: active ? "border-yellow-500 text-yellow-700" : "border-transparent text-gray-600 hover:text-yellow-600",
    blue: active ? "border-blue-500 text-blue-700" : "border-transparent text-gray-600 hover:text-blue-600",
    green: active ? "border-green-500 text-green-700" : "border-transparent text-gray-600 hover:text-green-600",
    red: active ? "border-red-500 text-red-700" : "border-transparent text-gray-600 hover:text-red-600",
    gray: active ? "border-gray-500 text-gray-700" : "border-transparent text-gray-600 hover:text-gray-600",
  };

  const badgeClasses = {
    yellow: active ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-gray-100 text-gray-600",
    blue: active ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-gray-100 text-gray-600",
    green: active ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-600",
    red: active ? "bg-red-100 text-red-700 border-red-300" : "bg-gray-100 text-gray-600",
    gray: active ? "bg-gray-200 text-gray-700 border-gray-400" : "bg-gray-100 text-gray-600",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-2">
        {children}
        <span className={`px-2 py-0.5 rounded-full text-xs border ${badgeClasses[color]}`}>
          {count}
        </span>
      </div>
    </button>
  );
}

function MatchCard({ 
  mentoria, 
  projeto, 
  mentor, 
  onAbrirEncontros, 
  onAbrirAcompanhamento, 
  abaAtiva,
  modoSelecao = false,
  selecionada = false,
  onToggleSelecao
}: { 
  mentoria: any; 
  projeto: any; 
  mentor?: any;
  onAbrirEncontros: () => void;
  onAbrirAcompanhamento: () => void;
  abaAtiva: string;
  modoSelecao?: boolean;
  selecionada?: boolean;
  onToggleSelecao?: () => void;
}) {
  const { state, dispatch } = useCrm();
  const [expanded, setExpanded] = React.useState(false);
  const [showMentorModal, setShowMentorModal] = React.useState(false);
  const [showEditarMentoriaModal, setShowEditarMentoriaModal] = React.useState(false);
  const [showModalReabertura, setShowModalReabertura] = React.useState(false);

  // Estado local para atualização imediata da UI (evita "piscar")
  const [localStatus, setLocalStatus] = React.useState<string>(mentoria.status);
  const [localMentorId, setLocalMentorId] = React.useState<string | undefined>(mentoria.mentorId);
  const [localProjetoId, setLocalProjetoId] = React.useState<string>(mentoria.projetoId);
  const [localArea, setLocalArea] = React.useState<string>(mentoria.negocio || "");

  // Sincroniza quando a prop mentoria muda
  React.useEffect(() => {
    setLocalStatus(mentoria.status);
  }, [mentoria.status]);

  React.useEffect(() => {
    setLocalMentorId(mentoria.mentorId);
  }, [mentoria.mentorId]);

  React.useEffect(() => {
    setLocalProjetoId(mentoria.projetoId);
  }, [mentoria.projetoId]);

  React.useEffect(() => {
    setLocalArea(mentoria.negocio || "");
  }, [mentoria.negocio]);

  // Verifica se a mentoria tem relatos/encontros
  const temRelatos = React.useMemo(() => {
    return state.relatos.some(r => r.mentoriaId === mentoria.id);
  }, [state.relatos, mentoria.id]);

  // Verifica se não tem encontros (para desabilitar o botão)
  const naoTemEncontros = !temRelatos;
  
  // Verifica se é mentoria nova (status "nova") - não deve mostrar o botão
  const isMentoriaNova = localStatus === "nova";

  // Busca relatos/encontros da mentoria
  const relatosMentoria = React.useMemo(() => {
    return state.relatos
      .filter(r => r.mentoriaId === mentoria.id)
      .sort((a, b) => {
        const dataA = a.dataEncontroISO || a.dataISO;
        const dataB = b.dataEncontroISO || b.dataISO;
        return dataB.localeCompare(dataA); // Mais recente primeiro
      });
  }, [state.relatos, mentoria.id]);

  // Último encontro (para status ativa)
  const ultimoEncontro = relatosMentoria[0];

  // Informações para status concluída
  const totalEncontros = relatosMentoria.length;
  const dataUltimoEncontro = ultimoEncontro 
    ? (ultimoEncontro.dataEncontroISO || ultimoEncontro.dataISO)
    : null;

  const selecionarMentor = (mentorId: string) => {
    setLocalMentorId(mentorId);
    dispatch({ type: "ATRIBUIR_MENTOR", payload: { mentoriaId: mentoria.id, mentorId } });
    setShowMentorModal(false);
  };

  // Extrai áreas disponíveis
  const areasDisponiveis = React.useMemo(() => {
    const areas = new Set<string>();
    state.mentorias.forEach(m => {
      if (m.negocio) areas.add(m.negocio);
    });
    return Array.from(areas).sort();
  }, [state.mentorias]);

  // Busca o projeto local atualizado
  const projetoAtual = state.projetos.find(p => p.id === localProjetoId);

  return (
    <div className={`bg-white rounded-t-lg rounded-b-lg border ${selecionada ? 'border-blue-500 border-2 shadow-lg' : 'border-gray-200'} shadow-sm hover:shadow-md transition-all`}>
      <div className="px-4 py-2 bg-blue-900 border-b rounded-t-lg text-bold text-base text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {modoSelecao && onToggleSelecao && (
            <input
              type="checkbox"
              checked={selecionada}
              onChange={onToggleSelecao}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 cursor-pointer accent-blue-600"
            />
          )}
          <span className="font-bold text-yellow-400">{projetoAtual?.nome || "—"}</span>
          {localArea && ( 
            <> 
              <span> - </span> 
              <span className="font-medium text-yellow-400">{localArea}</span>
               </> )}
        </div>
        <span className={`text-xs px-4 py-0.5 rounded-full font-bold border ${colorMap[mentoria.status]}`}>
                {STATUS_MAP[mentoria.status] || mentoria.status}
        </span>
      </div>

      {/* Header do card */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Info principal */}
          <div className="">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-blue-900">{mentoria.empreendedor}</h3>
            </div>

            {mentoria.desafio && (
              <p className="text-sm text-gray-700 line-clamp-2">
                <strong>Desafio:</strong> {mentoria.desafio}
              </p>
            )}
            
            {expanded && mentoria.desafio && (
              <p className="text-sm text-gray-700 mt-2">
                {mentoria.desafio}
              </p>
            )}

            {/* Container para Encontros e Acompanhamento lado a lado */}
            {!isMentoriaNova && mentoria.status !== "expirada" && abaAtiva !== "expiradas" && (
              <div className="mt-3 flex gap-3">
                {/* Card de Informações sobre Encontros */}
                <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Último Encontro:</p>
                  {ultimoEncontro ? (
                    <>
                      <p className="text-xs text-gray-600 mb-1">
                        Encontro {totalEncontros}
                      </p>
                      <p className="text-xs text-blue-800 line-clamp-3">
                        {ultimoEncontro.titulo ? `${ultimoEncontro.titulo}: ` : ''}
                        {ultimoEncontro.texto.length > 100 
                          ? `${ultimoEncontro.texto.substring(0, 100)}...` 
                          : ultimoEncontro.texto}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Nenhuma interação registrada
                    </p>
                  )}
                </div>

                {/* Card de Acompanhamento */}
                <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-700">Acompanhamento:</p>
                    {mentoria.ultimoRegistroPor && (
                      <span className="text-[10px] text-gray-400 italic">
                        Últ. por {mentoria.ultimoRegistroPor}
                        {mentoria.ultimoRegistroDataISO && ` em ${new Date(mentoria.ultimoRegistroDataISO).toLocaleDateString('pt-BR')}`}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs">
                    {mentoria.statusAcompanhamento && (
                      <div className="mb-2">
                        <div className="flex gap-2 items-center">
                          <span className="text-gray-600 font-medium">Status:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorAcompanhamentoMap[mentoria.statusAcompanhamento] || 'bg-gray-100 text-gray-700'}`}>
                            {STATUS_ACOMPANHAMENTO_MAP[mentoria.statusAcompanhamento] || mentoria.statusAcompanhamento}
                          </span>
                        </div>
                        {mentoria.statusAcompanhamentoPor && (
                          <span className="text-[10px] text-blue-500 italic ml-1">
                            por {mentoria.statusAcompanhamentoPor}
                            {mentoria.statusAcompanhamentoDataISO && ` (${new Date(mentoria.statusAcompanhamentoDataISO).toLocaleDateString('pt-BR')})`}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <span className="text-gray-600 font-medium">Encontros da Mentoria:</span>
                      <span className="text-gray-800">{totalEncontros}</span>
                    </div>
                    {mentoria.numEncontrosAcompanhamento !== undefined && (
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-medium">Acompanhamentos:</span>
                        <span className="text-gray-800">{mentoria.numEncontrosAcompanhamento}</span>
                      </div>
                    )}
                    {mentoria.proximoEncontroDataISO && (
                      <div className="flex gap-2">
                        <span className="text-gray-600 font-medium">Próximo:</span>
                        <span className="text-gray-800">
                          {new Date(mentoria.proximoEncontroDataISO).toLocaleDateString('pt-BR')}
                          {mentoria.proximoEncontroHorario && ` às ${mentoria.proximoEncontroHorario}`}
                        </span>
                      </div>
                    )}
                    {mentoria.observacaoEmpreendedor && (
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600 font-medium">Obs. Empreendedor:</span>
                          {mentoria.observacaoEmpreendedorPor && (
                            <span className="text-[10px] text-purple-500 italic">
                              por {mentoria.observacaoEmpreendedorPor}
                              {mentoria.observacaoEmpreendedorDataISO && ` (${new Date(mentoria.observacaoEmpreendedorDataISO).toLocaleDateString('pt-BR')})`}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 line-clamp-2">{mentoria.observacaoEmpreendedor}</p>
                      </div>
                    )}
                    {mentoria.observacaoMentor && (
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600 font-medium">Obs. Mentor:</span>
                          {mentoria.observacaoMentorPor && (
                            <span className="text-[10px] text-green-600 italic">
                              por {mentoria.observacaoMentorPor}
                              {mentoria.observacaoMentorDataISO && ` (${new Date(mentoria.observacaoMentorDataISO).toLocaleDateString('pt-BR')})`}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 line-clamp-2">{mentoria.observacaoMentor}</p>
                      </div>
                    )}
                    {mentoria.motivoCancelamento && (
                      <div>
                        <span className="text-gray-600 font-medium block">Motivo Finalização:</span>
                        <p className="text-gray-800">{mentoria.motivoCancelamento}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            

            {localStatus === "concluida" && (
              <div className="mt-3 p-2 bg-lime-50 border border-lime-200 rounded-md">
                <p className="text-xs text-lime-800">
                  <strong>Total de encontros:</strong> {totalEncontros}
                  {dataUltimoEncontro && (
                    <>
                      {' • '}
                      <strong>Último encontro:</strong>{' '}
                      {new Date(dataUltimoEncontro).toLocaleDateString('pt-BR')}
                    </>
                  )}
                </p>
              </div>
            )}

            {localStatus === "cancelada" && (
              <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded-md">
                <p className="text-xs text-rose-800">
                  <strong>Motivo do cancelamento:</strong>{' '}
                  {mentoria.motivoCancelamento || 'Não informado'}
                </p>
              </div>
            )}
          </div>

          {/* Ações rápidas */}
          <div className="flex flex-col gap-2 w-[280px] shrink-0">
            {/* Botão para editar Projeto e Área - APENAS na aba pendentes */}
            {abaAtiva === "pendentes" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-bold w-20 shrink-0">Solicitação:</span>
                  <button
                    onClick={() => setShowEditarMentoriaModal(true)}
                    className="flex-1 h-9 px-2 text-sm border rounded-md bg-white flex items-center hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden"
                  >
                    <Edit className="w-4 h-4 text-gray-500 shrink-0 mr-2" />
                    <span className="flex-1 text-left truncate text-xs">
                      Editar projeto/área
                    </span>
                  </button>
                </div>
                {/* Divisor visual */}
                <div className="border-t my-1"></div>
              </>
            )}

            {/* Exibe mentor como texto (substitui o dropdown) */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-bold w-20 shrink-0">Mentor:</span>
              <button 
                onClick={() => setShowMentorModal(true)}
                className="flex-1 h-9 px-2 text-sm border rounded-md bg-white flex items-center hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden"
              >
                <User className="w-4 h-4 text-gray-500 shrink-0 mr-2" />
                <span className="flex-1 text-left truncate">
                  {localMentorId ? state.mentores.find((m) => m.id === localMentorId)?.nome || "Sem mentor" : "Sem mentor"}
                </span>
              </button>
            </div>

            {/* Seletor de status - não aparece na aba pendentes */}
            {abaAtiva !== "pendentes" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-bold w-20 shrink-0">Status:</span>
                <select
                  className="flex-1 h-9 px-2 text-sm border rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  value={localStatus}
                  onChange={(e) => {
                    const novoStatus = e.target.value as StatusMentoria;
                    // atualiza UI imediatamente
                    setLocalStatus(novoStatus);
                    // dispatch para o reducer
                    dispatch({ 
                      type: "MUDAR_STATUS", 
                      payload: { 
                        mentoriaId: mentoria.id, 
                        status: novoStatus 
                      } 
                    });
                  }}
                >
                  {Object.entries(STATUS_MAP).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Botão de expandir/ver mais */}
            {mentoria.desafio && mentoria.desafio.length > 100 && (
              <Button
                variant="ghost"
                onClick={() => setExpanded(!expanded)}
                className="text-xs"
              >
                {expanded ? "Ver menos" : "Ver mais"}
              </Button>
            )}

            {/* Botão Encontros - aparece apenas para mentorias ativas, concluídas ou pausadas */}
            {!isMentoriaNova && abaAtiva !== "pendentes" && abaAtiva !== "expiradas" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-bold w-20 shrink-0">Encontros:</span>
                <button
                  onClick={onAbrirEncontros}
                  disabled={naoTemEncontros}
                  className={`flex-1 h-9 px-2 text-sm border rounded-md flex items-center transition-colors overflow-hidden ${
                    naoTemEncontros
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                      : "bg-white hover:bg-gray-50 cursor-pointer text-black"
                  }`}
                >
                  <NotebookPen className={`w-4 h-4 shrink-0 mr-2 ${naoTemEncontros ? "text-gray-400" : "text-gray-500"}`} />
                  <span className="truncate">Ver encontros</span>
                </button>
              </div>
            )}

            {/* Botão Acompanhamento - aparece apenas para mentorias ativas, concluídas ou pausadas */}
            {!isMentoriaNova && abaAtiva !== "pendentes" && abaAtiva !== "expiradas" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-bold w-20 shrink-0">Acomp.:</span>
                <button
                  onClick={onAbrirAcompanhamento}
                  className="flex-1 h-9 px-2 text-sm border rounded-md flex items-center transition-colors bg-white hover:bg-gray-50 cursor-pointer text-black overflow-hidden"
                >
                  <NotebookPen className="w-4 h-4 shrink-0 mr-2 text-gray-500" />
                  <span className="truncate">Acompanhamento</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de busca/seleção de mentor */}
      <BuscarMentorModal
        isOpen={showMentorModal}
        onClose={() => setShowMentorModal(false)}
        mentores={state.mentores}
        onSelecionar={selecionarMentor}
        areaSugerida={mentoria.negocio}
      />

      {/* Modal de edição de projeto e área */}
      {showEditarMentoriaModal && (
        <ModalEditarMentoria
          mentoria={mentoria}
          localProjetoId={localProjetoId}
          setLocalProjetoId={setLocalProjetoId}
          localArea={localArea}
          setLocalArea={setLocalArea}
          projetos={state.projetos}
          areasDisponiveis={areasDisponiveis}
          onClose={() => setShowEditarMentoriaModal(false)}
          onSalvar={(projetoId, area) => {
            setLocalProjetoId(projetoId);
            setLocalArea(area);
            dispatch({
              type: "ATUALIZAR_MENTORIA",
              payload: {
                mentoriaId: mentoria.id,
                dados: { projetoId, negocio: area }
              }
            });
            setShowEditarMentoriaModal(false);
          }}
        />
      )}

      {/* Modal de confirmação de reabertura */}
      {showModalReabertura && (
        <ModalConfirmarReabertura
          mentoria={mentoria}
          onClose={() => setShowModalReabertura(false)}
          onConfirmar={() => {
            // Cria uma nova mentoria baseada na atual, mas sem histórico
            const novaMentoria: any = {
              id: `mentoria-${Date.now()}`,
              empreendedor: mentoria.empreendedor,
              negocio: mentoria.negocio,
              projetoId: mentoria.projetoId,
              status: "nova" as StatusMentoria,
              desafio: mentoria.desafio,
              dataCriacaoISO: new Date().toISOString(),
              ultimaAtualizacaoISO: new Date().toISOString(),
            };
            dispatch({ 
              type: "ADICIONAR_MENTORIA", 
              payload: { mentoria: novaMentoria } 
            });
            setShowModalReabertura(false);
          }}
        />
      )}

      {/* Footer com info adicional */}
      <div className="px-4 py-2 bg-primary-50 border-t text-xs text-gray-500">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {abaAtiva === "pendentes" ? (
            // Aba Pendentes: apenas data da solicitação
            <span>
              <strong>Solicitação feita em:</strong> {new Date(mentoria.dataCriacaoISO).toLocaleDateString('pt-BR')}
            </span>
          ) : abaAtiva === "expiradas" ? (
            // Aba Expiradas: apenas início e tempo que ficou aberta
            <div className="flex items-center gap-4">
              <span>
                <strong>Início:</strong> {new Date(mentoria.dataCriacaoISO).toLocaleDateString('pt-BR')}
              </span>
              <span>
                <strong>Tempo não aceita:</strong> {calcularTempoAberto(mentoria.dataCriacaoISO, mentoria.ultimaAtualizacaoISO, localStatus)}
              </span>
            </div>
          ) : (
            // Outras abas: informações completas
            <div className="flex items-center gap-4">
              <span>
                <strong>Início:</strong> {new Date(mentoria.dataCriacaoISO).toLocaleDateString('pt-BR')}
              </span>
              <span>
                <strong>Atualizado:</strong> {new Date(mentoria.ultimaAtualizacaoISO).toLocaleDateString('pt-BR')}
              </span>
              <span>
                <strong>{localStatus === "concluida" ? "Duração:" : "Tempo aberto:"}</strong> {calcularTempoAberto(mentoria.dataCriacaoISO, mentoria.ultimaAtualizacaoISO, localStatus)}
              </span>
            </div>
          )}
          {/* Botão para reabrir mentoria cancelada */}
          {abaAtiva === "canceladas" && localStatus === "cancelada" && (
            <button
              onClick={() => setShowModalReabertura(true)}
              className="h-7 px-3 text-xs bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
            >
              Recriar Mentoria
            </button>
          )}
        </div>
      </div>
    </div>

    
  );
}

// Função auxiliar para calcular tempo aberto/duração
function calcularTempoAberto(dataCriacaoISO: string, ultimaAtualizacaoISO: string, status: string): string {
  const inicio = new Date(dataCriacaoISO);
  
  // Para mentorias concluídas, usa a data de atualização como data de conclusão
  // Para outras, usa a data atual
  const dataFim = status === "concluida" 
    ? new Date(ultimaAtualizacaoISO)
    : new Date();
  
  const diffMs = dataFim.getTime() - inicio.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Cálculo mais preciso de meses e anos
  const inicioAno = inicio.getFullYear();
  const inicioMes = inicio.getMonth();
  const fimAno = dataFim.getFullYear();
  const fimMes = dataFim.getMonth();
  
  const diffAnos = fimAno - inicioAno;
  const diffMeses = diffAnos * 12 + (fimMes - inicioMes);
  
  // Ajusta meses baseado nos dias
  const inicioDia = inicio.getDate();
  const fimDia = dataFim.getDate();
  let mesesAjustados = diffMeses;
  if (fimDia < inicioDia) {
    mesesAjustados = Math.max(0, diffMeses - 1);
  }

  if (diffAnos > 0) {
    return `${diffAnos} ${diffAnos === 1 ? 'ano' : 'anos'}`;
  } else if (mesesAjustados > 0) {
    return `${mesesAjustados} ${mesesAjustados === 1 ? 'mês' : 'meses'}`;
  } else if (diffDias > 0) {
    return `${diffDias} ${diffDias === 1 ? 'dia' : 'dias'}`;
  } else {
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHoras > 0) {
      return `${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
    } else {
      const diffMinutos = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutos} ${diffMinutos === 1 ? 'minuto' : 'minutos'}`;
    }
  }
}

// Componentes auxiliares
function Th({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <th className={`text-left font-semibold px-3 py-2 ${className}`}>{children}</th>;
}

function Td({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <td className={`px-3 py-2 align-top ${className}`}>{children}</td>;
}