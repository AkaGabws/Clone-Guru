import React from "react";
import { useCrm } from "../../store/CrmContext";
import { Button } from "../../components/ui/button";
import { StatusMentoria } from "../../types/crm";
import { MentoriaDetalhesModal, AcompanhamentoModal } from "./modals";
import { User, BookOpen, FileText, ChevronLeft, ChevronRight, Eye, Check, Filter, Users, KanbanSquare, Info, Calendar, CheckSquare } from "lucide-react";

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
  
  // Filtros demográficos (baseados nas mentorias/empreendedores)
  const [estadoFilter, setEstadoFilter] = React.useState<string>("todos");
  const [areaFilter, setAreaFilter] = React.useState<string>("todos");
  const [generoFilter, setGeneroFilter] = React.useState<string>("todos");
  const [racaFilter, setRacaFilter] = React.useState<string>("todos");
  const [escolaridadeFilter, setEscolaridadeFilter] = React.useState<string>("todos");
  const [nacionalidadeFilter, setNacionalidadeFilter] = React.useState<string>("todos");
  
  // Filtro por quantidade de mentorias ativas
  const [mentoriasAtivasFilter, setMentoriasAtivasFilter] = React.useState<string>("todos");
  const [customMinMentoriasAtivas, setCustomMinMentoriasAtivas] = React.useState<string>("");
  const [customMaxMentoriasAtivas, setCustomMaxMentoriasAtivas] = React.useState<string>("");
  
  // Modal de filtros
  const [mostrarModalFiltros, setMostrarModalFiltros] = React.useState(false);
  
  // Paginação
  const [paginaAtual, setPaginaAtual] = React.useState(1);
  const [itensPorPagina, setItensPorPagina] = React.useState(20);
  
  // Estado para modais
  const [empreendedorSelecionado, setEmpreendedorSelecionado] = React.useState<string | null>(null);
  const [mentoriaSelecionadaId, setMentoriaSelecionadaId] = React.useState<string | null>(null);
  const [mentoriaAcompanhamentoId, setMentoriaAcompanhamentoId] = React.useState<string | null>(null);

  // Lista completa de estados brasileiros
  const estadosBrasileiros = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];
  const estadosDisponiveis = React.useMemo(() => {
    const estados = new Set<string>(estadosBrasileiros);
    state.mentorias.forEach(m => {
      const estado = (m as any).estado || (m as any).uf;
      if (estado) estados.add(estado);
    });
    return Array.from(estados).sort();
  }, [state.mentorias]);

  const areasDisponiveis = React.useMemo(() => {
    const areas = new Set<string>();
    state.mentorias.forEach(m => {
      if (m.negocio) areas.add(m.negocio);
    });
    return Array.from(areas).sort();
  }, [state.mentorias]);

  // Opções padrão para gênero
  const generosPadrao = ["Homem", "Mulher", "Não-binário", "Outro", "Prefiro não informar"];
  const generosDisponiveis = React.useMemo(() => {
    const generos = new Set<string>(generosPadrao);
    state.mentorias.forEach(m => {
      const genero = (m as any).genero || (m as any).gender;
      if (genero) generos.add(genero);
    });
    return Array.from(generos).sort();
  }, [state.mentorias]);

  // Opções padrão para raça/cor
  const racasPadrao = ["Branca", "Preta", "Parda", "Amarela", "Indígena", "Prefiro não informar"];
  const racasDisponiveis = React.useMemo(() => {
    const racas = new Set<string>(racasPadrao);
    state.mentorias.forEach(m => {
      const raca = (m as any).raca || (m as any).cor;
      if (raca) racas.add(raca);
    });
    return Array.from(racas).sort();
  }, [state.mentorias]);

  // Opções padrão para escolaridade
  const escolaridadesPadrao = [
    "Ensino Fundamental Incompleto",
    "Ensino Fundamental Completo",
    "Ensino Médio Incompleto",
    "Ensino Médio Completo",
    "Ensino Superior Incompleto",
    "Ensino Superior Completo",
    "Pós-graduação",
    "Mestrado",
    "Doutorado"
  ];
  const escolaridadesDisponiveis = React.useMemo(() => {
    const escolaridades = new Set<string>(escolaridadesPadrao);
    state.mentorias.forEach(m => {
      const escolaridade = (m as any).escolaridade;
      if (escolaridade) escolaridades.add(escolaridade);
    });
    return Array.from(escolaridades).sort();
  }, [state.mentorias]);

  // Opções padrão para nacionalidade
  const nacionalidadesPadrao = ["Brasileira", "Estrangeira"];
  const nacionalidadesDisponiveis = React.useMemo(() => {
    const nacionalidades = new Set<string>(nacionalidadesPadrao);
    state.mentorias.forEach(m => {
      const nacionalidade = (m as any).nacionalidade;
      if (nacionalidade) nacionalidades.add(nacionalidade);
    });
    return Array.from(nacionalidades).sort();
  }, [state.mentorias]);

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
  // IMPORTANTE: Só processa quando houver busca para melhorar performance
  const empreendedoresComDados = React.useMemo(() => {
    // Se não houver busca, retorna array vazio
    if (!buscaLocal.trim()) {
      return [];
    }

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

    // Filtro de busca (obrigatório)
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

    // Filtro por estado
    if (estadoFilter !== "todos") {
      resultado = resultado.filter(grupo => {
        return grupo.mentorias.some(mentoria => {
          const estado = (mentoria as any).estado || (mentoria as any).uf;
          return estado === estadoFilter;
        });
      });
    }

    // Filtro por área/negócio
    if (areaFilter !== "todos") {
      resultado = resultado.filter(grupo => {
        return grupo.mentorias.some(mentoria => mentoria.negocio === areaFilter);
      });
    }

    // Filtro por gênero
    if (generoFilter !== "todos") {
      resultado = resultado.filter(grupo => {
        return grupo.mentorias.some(mentoria => {
          const genero = (mentoria as any).genero;
          return genero === generoFilter;
        });
      });
    }

    // Filtro por raça
    if (racaFilter !== "todos") {
      resultado = resultado.filter(grupo => {
        return grupo.mentorias.some(mentoria => {
          const raca = (mentoria as any).raca;
          return raca === racaFilter;
        });
      });
    }

    // Filtro por escolaridade
    if (escolaridadeFilter !== "todos") {
      resultado = resultado.filter(grupo => {
        return grupo.mentorias.some(mentoria => {
          const escolaridade = (mentoria as any).escolaridade;
          return escolaridade === escolaridadeFilter;
        });
      });
    }

    // Filtro por nacionalidade
    if (nacionalidadeFilter !== "todos") {
      resultado = resultado.filter(grupo => {
        return grupo.mentorias.some(mentoria => {
          const nacionalidade = (mentoria as any).nacionalidade;
          return nacionalidade === nacionalidadeFilter;
        });
      });
    }

    // Filtro por quantidade de mentorias ativas
    if (mentoriasAtivasFilter !== "todos") {
      if (mentoriasAtivasFilter === "custom") {
        if (customMinMentoriasAtivas || customMaxMentoriasAtivas) {
          const min = customMinMentoriasAtivas ? parseInt(customMinMentoriasAtivas) : 0;
          const max = customMaxMentoriasAtivas ? parseInt(customMaxMentoriasAtivas) : Infinity;
          resultado = resultado.filter(grupo => grupo.mentoriasAtivas >= min && grupo.mentoriasAtivas <= max);
        }
      } else {
        switch (mentoriasAtivasFilter) {
          case "0":
            resultado = resultado.filter(grupo => grupo.mentoriasAtivas === 0);
            break;
          case "1-3":
            resultado = resultado.filter(grupo => grupo.mentoriasAtivas >= 1 && grupo.mentoriasAtivas <= 3);
            break;
          case "4-6":
            resultado = resultado.filter(grupo => grupo.mentoriasAtivas >= 4 && grupo.mentoriasAtivas <= 6);
            break;
          case "7-10":
            resultado = resultado.filter(grupo => grupo.mentoriasAtivas >= 7 && grupo.mentoriasAtivas <= 10);
            break;
          case "11+":
            resultado = resultado.filter(grupo => grupo.mentoriasAtivas > 10);
            break;
        }
      }
    }

    // Ordena por nome do empreendedor
    return resultado.sort((a, b) => a.empreendedor.localeCompare(b.empreendedor));
  }, [state.mentorias, state.projetos, state.mentores, state.relatos, buscaLocal, projectFilter, statusFilter, getDateRange, estadoFilter, areaFilter, generoFilter, racaFilter, escolaridadeFilter, nacionalidadeFilter, mentoriasAtivasFilter, customMinMentoriasAtivas, customMaxMentoriasAtivas]);

  // Calcula paginação
  const totalEmpreendedores = empreendedoresComDados.length;
  const totalPaginas = Math.ceil(totalEmpreendedores / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const empreendedoresPaginados = empreendedoresComDados.slice(indiceInicio, indiceFim);

  // Conta filtros ativos (busca não conta como filtro, é obrigatória)
  const filtrosAtivos = React.useMemo(() => {
    let count = 0;
    if (projectFilter !== "todos") count++;
    if (statusFilter !== "todos") count++;
    if (dateFilter !== "todos") count++;
    if (estadoFilter !== "todos") count++;
    if (areaFilter !== "todos") count++;
    if (generoFilter !== "todos") count++;
    if (racaFilter !== "todos") count++;
    if (escolaridadeFilter !== "todos") count++;
    if (nacionalidadeFilter !== "todos") count++;
    if (mentoriasAtivasFilter !== "todos") count++;
    return count;
  }, [projectFilter, statusFilter, dateFilter, estadoFilter, areaFilter, generoFilter, racaFilter, escolaridadeFilter, nacionalidadeFilter, mentoriasAtivasFilter]);

  // Limpar todos os filtros
  const limparFiltros = () => {
    setBuscaLocal("");
    setProjectFilter("todos");
    setStatusFilter("todos");
    setDateFilter("todos");
    setCustomFrom("");
    setCustomTo("");
    setEstadoFilter("todos");
    setAreaFilter("todos");
    setGeneroFilter("todos");
    setRacaFilter("todos");
    setEscolaridadeFilter("todos");
    setNacionalidadeFilter("todos");
    setMentoriasAtivasFilter("todos");
    setCustomMinMentoriasAtivas("");
    setCustomMaxMentoriasAtivas("");
  };

  // Reset página quando filtros mudam
  React.useEffect(() => {
    setPaginaAtual(1);
  }, [buscaLocal, projectFilter, statusFilter, dateFilter, customFrom, customTo, estadoFilter, areaFilter, generoFilter, racaFilter, escolaridadeFilter, nacionalidadeFilter, mentoriasAtivasFilter, customMinMentoriasAtivas, customMaxMentoriasAtivas]);

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
        {buscaLocal.trim() && (
          <div className="text-sm text-gray-600">
            <strong>{totalEmpreendedores}</strong> empreendedores • <strong>{empreendedoresComDados.reduce((acc, e) => acc + e.totalMentorias, 0)}</strong> mentorias
          </div>
        )}
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="mb-4 space-y-2">
        {/* Linha 1: Busca */}
        <div className="flex gap-2 items-center">
          <input 
            type="text" 
            placeholder="Digite para buscar empreendedor (nome, negócio, projeto, mentor...) - Obrigatório" 
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

        {/* Itens por página */}
        <div className="flex justify-end">
          <select
            className="border rounded-md h-9 px-2 text-sm bg-white"
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

              {statusFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span><strong>Status:</strong> {STATUS_MAP[statusFilter] || statusFilter}</span>
                  <button
                    onClick={() => setStatusFilter("todos")}
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

              {estadoFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  <span><strong>Estado:</strong> {estadoFilter}</span>
                  <button
                    onClick={() => setEstadoFilter("todos")}
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

              {generoFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  <span><strong>Gênero:</strong> {generoFilter}</span>
                  <button
                    onClick={() => setGeneroFilter("todos")}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover filtro"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </span>
              )}

              {racaFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  <span><strong>Raça:</strong> {racaFilter}</span>
                  <button
                    onClick={() => setRacaFilter("todos")}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover filtro"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </span>
              )}

              {escolaridadeFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  <span><strong>Escolaridade:</strong> {escolaridadeFilter}</span>
                  <button
                    onClick={() => setEscolaridadeFilter("todos")}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover filtro"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </span>
              )}

              {nacionalidadeFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  <span><strong>Nacionalidade:</strong> {nacionalidadeFilter}</span>
                  <button
                    onClick={() => setNacionalidadeFilter("todos")}
                    className="ml-1 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                    aria-label="Remover filtro"
                    title="Remover filtro"
                  >
                    ×
                  </button>
                </span>
              )}

              {mentoriasAtivasFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>
                    <strong>Mentorias Ativas:</strong>{' '}
                    {mentoriasAtivasFilter === "custom" 
                      ? `${customMinMentoriasAtivas || "0"} - ${customMaxMentoriasAtivas || "∞"}`
                      : mentoriasAtivasFilter === "0" ? "Sem mentorias ativas"
                      : mentoriasAtivasFilter}
                  </span>
                  <button
                    onClick={() => {
                      setMentoriasAtivasFilter("todos");
                      setCustomMinMentoriasAtivas("");
                      setCustomMaxMentoriasAtivas("");
                    }}
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

      {/* Mensagem quando não há busca */}
      {!buscaLocal.trim() && (
        <div className="border rounded-lg bg-blue-50 border-blue-200 p-12 text-center">
          <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Busca Obrigatória
          </h3>
          <p className="text-gray-600 mb-4">
            Para melhorar a performance, digite pelo menos 1 caractere na barra de busca para visualizar os empreendedores.
          </p>
          <p className="text-sm text-gray-500">
            Você pode buscar por nome do empreendedor, negócio, projeto, mentor ou qualquer palavra-chave relacionada.
          </p>
        </div>
      )}

      {/* Tabela de Empreendedores - Só aparece quando há busca */}
      {buscaLocal.trim() && (
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
                    Nenhum empreendedor encontrado com os filtros aplicados
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
      )}

      {/* Controles de Paginação - Só aparece quando há busca e resultados */}
      {buscaLocal.trim() && totalPaginas > 1 && (
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

      {/* Modal de Filtros Avançados */}
      {mostrarModalFiltros && (
        <ModalFiltrosAvancados
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          customFrom={customFrom}
          setCustomFrom={setCustomFrom}
          customTo={customTo}
          setCustomTo={setCustomTo}
          estadoFilter={estadoFilter}
          setEstadoFilter={setEstadoFilter}
          areaFilter={areaFilter}
          setAreaFilter={setAreaFilter}
          generoFilter={generoFilter}
          setGeneroFilter={setGeneroFilter}
          racaFilter={racaFilter}
          setRacaFilter={setRacaFilter}
          escolaridadeFilter={escolaridadeFilter}
          setEscolaridadeFilter={setEscolaridadeFilter}
          nacionalidadeFilter={nacionalidadeFilter}
          setNacionalidadeFilter={setNacionalidadeFilter}
          mentoriasAtivasFilter={mentoriasAtivasFilter}
          setMentoriasAtivasFilter={setMentoriasAtivasFilter}
          customMinMentoriasAtivas={customMinMentoriasAtivas}
          setCustomMinMentoriasAtivas={setCustomMinMentoriasAtivas}
          customMaxMentoriasAtivas={customMaxMentoriasAtivas}
          setCustomMaxMentoriasAtivas={setCustomMaxMentoriasAtivas}
          projetos={state.projetos}
          estadosDisponiveis={estadosDisponiveis}
          areasDisponiveis={areasDisponiveis}
          generosDisponiveis={generosDisponiveis}
          racasDisponiveis={racasDisponiveis}
          escolaridadesDisponiveis={escolaridadesDisponiveis}
          nacionalidadesDisponiveis={nacionalidadesDisponiveis}
          filtrosAtivos={filtrosAtivos}
          onClose={() => setMostrarModalFiltros(false)}
          onLimpar={limparFiltros}
        />
      )}
    </div>
  );
}

// Modal de Filtros Avançados
function ModalFiltrosAvancados({
  projectFilter,
  setProjectFilter,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  estadoFilter,
  setEstadoFilter,
  areaFilter,
  setAreaFilter,
  generoFilter,
  setGeneroFilter,
  racaFilter,
  setRacaFilter,
  escolaridadeFilter,
  setEscolaridadeFilter,
  nacionalidadeFilter,
  setNacionalidadeFilter,
  mentoriasAtivasFilter,
  setMentoriasAtivasFilter,
  customMinMentoriasAtivas,
  setCustomMinMentoriasAtivas,
  customMaxMentoriasAtivas,
  setCustomMaxMentoriasAtivas,
  projetos,
  estadosDisponiveis,
  areasDisponiveis,
  generosDisponiveis,
  racasDisponiveis,
  escolaridadesDisponiveis,
  nacionalidadesDisponiveis,
  filtrosAtivos,
  onClose,
  onLimpar,
}: {
  projectFilter: string;
  setProjectFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  dateFilter: string;
  setDateFilter: (v: any) => void;
  customFrom: string;
  setCustomFrom: (v: string) => void;
  customTo: string;
  setCustomTo: (v: string) => void;
  estadoFilter: string;
  setEstadoFilter: (v: string) => void;
  areaFilter: string;
  setAreaFilter: (v: string) => void;
  generoFilter: string;
  setGeneroFilter: (v: string) => void;
  racaFilter: string;
  setRacaFilter: (v: string) => void;
  escolaridadeFilter: string;
  setEscolaridadeFilter: (v: string) => void;
  nacionalidadeFilter: string;
  setNacionalidadeFilter: (v: string) => void;
  mentoriasAtivasFilter: string;
  setMentoriasAtivasFilter: (v: string) => void;
  customMinMentoriasAtivas: string;
  setCustomMinMentoriasAtivas: (v: string) => void;
  customMaxMentoriasAtivas: string;
  setCustomMaxMentoriasAtivas: (v: string) => void;
  projetos: any[];
  estadosDisponiveis: string[];
  areasDisponiveis: string[];
  generosDisponiveis: string[];
  racasDisponiveis: string[];
  escolaridadesDisponiveis: string[];
  nacionalidadesDisponiveis: string[];
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
          {/* Seção: Projeto e Status */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
              <KanbanSquare className="w-4 h-4" />
              Projeto e Status
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
                <label className="block text-xs text-gray-600 mb-1 font-medium">Status</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
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

          {/* Seção: Dados Demográficos */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Dados Demográficos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Estado</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                >
                  <option value="todos">Todos estados</option>
                  {estadosDisponiveis.map(estado => {
                    const nomeEstado: Record<string, string> = {
                      "AC": "Acre (AC)",
                      "AL": "Alagoas (AL)",
                      "AP": "Amapá (AP)",
                      "AM": "Amazonas (AM)",
                      "BA": "Bahia (BA)",
                      "CE": "Ceará (CE)",
                      "DF": "Distrito Federal (DF)",
                      "ES": "Espírito Santo (ES)",
                      "GO": "Goiás (GO)",
                      "MA": "Maranhão (MA)",
                      "MT": "Mato Grosso (MT)",
                      "MS": "Mato Grosso do Sul (MS)",
                      "MG": "Minas Gerais (MG)",
                      "PA": "Pará (PA)",
                      "PB": "Paraíba (PB)",
                      "PR": "Paraná (PR)",
                      "PE": "Pernambuco (PE)",
                      "PI": "Piauí (PI)",
                      "RJ": "Rio de Janeiro (RJ)",
                      "RN": "Rio Grande do Norte (RN)",
                      "RS": "Rio Grande do Sul (RS)",
                      "RO": "Rondônia (RO)",
                      "RR": "Roraima (RR)",
                      "SC": "Santa Catarina (SC)",
                      "SP": "São Paulo (SP)",
                      "SE": "Sergipe (SE)",
                      "TO": "Tocantins (TO)"
                    };
                    return (
                      <option key={estado} value={estado}>
                        {nomeEstado[estado] || estado}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Área/Negócio</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                >
                  <option value="todos">Todas áreas</option>
                  {areasDisponiveis.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Gênero</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={generoFilter}
                  onChange={(e) => setGeneroFilter(e.target.value)}
                >
                  <option value="todos">Todos gêneros</option>
                  {generosDisponiveis.map(genero => (
                    <option key={genero} value={genero}>{genero}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Raça</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={racaFilter}
                  onChange={(e) => setRacaFilter(e.target.value)}
                >
                  <option value="todos">Todas raças</option>
                  {racasDisponiveis.map(raca => (
                    <option key={raca} value={raca}>{raca}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Escolaridade</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={escolaridadeFilter}
                  onChange={(e) => setEscolaridadeFilter(e.target.value)}
                >
                  <option value="todos">Todas escolaridades</option>
                  {escolaridadesDisponiveis.map(esc => (
                    <option key={esc} value={esc}>{esc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Nacionalidade</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={nacionalidadeFilter}
                  onChange={(e) => setNacionalidadeFilter(e.target.value)}
                >
                  <option value="todos">Todas nacionalidades</option>
                  {nacionalidadesDisponiveis.map(nac => (
                    <option key={nac} value={nac}>{nac}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seção: Mentorias Ativas */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Quantidade de Mentorias Ativas</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1 font-medium">Filtro de Mentorias Ativas</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                  value={mentoriasAtivasFilter}
                  onChange={(e) => setMentoriasAtivasFilter(e.target.value)}
                >
                  <option value="todos">Todas mentorias ativas</option>
                  <option value="0">Sem mentorias ativas</option>
                  <option value="1-3">1-3 ativas</option>
                  <option value="4-6">4-6 ativas</option>
                  <option value="7-10">7-10 ativas</option>
                  <option value="11+">11+ ativas</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              {mentoriasAtivasFilter === "custom" && (
                <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-blue-200">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Mínimo</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Ex: 0"
                      className="w-full px-3 py-2 text-sm border rounded-md bg-white"
                      value={customMinMentoriasAtivas}
                      onChange={(e) => setCustomMinMentoriasAtivas(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Máximo</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Ex: 10"
                      className="w-full px-3 py-2 text-sm border rounded-md bg-white"
                      value={customMaxMentoriasAtivas}
                      onChange={(e) => setCustomMaxMentoriasAtivas(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
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
                          className="h-7 px-2 text-xs"
                        >
                          <BookOpen className="w-3 h-3 mr-1" />
                          Encontros ({numEncontros})
                        </Button>
                        {mentoria.status !== "nova" && mentoria.status !== "expirada" && (
                          <Button
                            onClick={() => onAbrirAcompanhamento(mentoria.id)}
                            variant="outline"
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
