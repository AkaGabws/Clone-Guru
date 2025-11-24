import React from "react";
import { Button } from "../../components/ui/button";
import { useCrm } from "../../store/CrmContext";
import { StatusMentoria } from "../../types/crm";
import { User, Building2, MessageSquare } from "lucide-react";
import { Filter, Users, KanbanSquare, List, NotebookPen } from "lucide-react";


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

export function MentoriaKanban() {
  const { state, dispatch } = useCrm();
  
  // Estado para busca local
  const [buscaLocal, setBuscaLocal] = React.useState("");
  
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
          byAba = m.status === "nova";
            break;
          case "ativas":
            byAba = m.status === "ativa" ;
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

        return byStatus && byMentor && byProjeto && byBusca && byDate;
      })
      .sort((a, b) => (a.ultimaAtualizacaoISO < b.ultimaAtualizacaoISO ? 1 : -1));
  // dependências: inclui filtros de data
  }, [state.mentorias, state.filtro, state.mentores, state.projetos, buscaLocal, abaAtiva, dateFilter, customFrom, customTo, projectFilter]);

  // Contadores para as abas
  const contadores = React.useMemo(() => {
    return {
      pendentes: state.mentorias.filter(m => !m.mentorId || m.status === "nova").length,
      ativas: state.mentorias.filter(m => m.status === "ativa" ).length,
      concluidas: state.mentorias.filter(m => m.status === "concluida").length,
      canceladas: state.mentorias.filter(m => m.status === "cancelada").length,
      expiradas: state.mentorias.filter(m => String(m.status) === "expirada").length,
      todas: state.mentorias.length,
    };
  }, [state.mentorias]);

  return (
    <div className="space-y-4">
      {/* Header com abas */}
      <div>
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          Gestão de Mentorias
        </h2>
        
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
      <div className="mb-4 flex gap-2 items-center">
        <input 
            type="text" 
            placeholder="Buscar por mentor, empreendedor ou local..." 
            className="border rounded-md px-3 py-2 w-full max-w-md text-sm"
            value={buscaLocal}
            onChange={(e) => setBuscaLocal(e.target.value)}
        />
        {/* Filtro por Projeto (local) */}
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
            <input type="date" className="h-9 px-2 text-sm border rounded-md bg-white" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
            <span className="text-xs text-gray-500">—</span>
            <input type="date" className="h-9 px-2 text-sm border rounded-md bg-white" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
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
              />
            );
          })
        )}
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

function MatchCard({ mentoria, projeto, mentor }: { 
  mentoria: any; 
  projeto: any; 
  mentor?: any;
}) {
  const { state, dispatch } = useCrm();
  const [expanded, setExpanded] = React.useState(false);
  const [showMentorModal, setShowMentorModal] = React.useState(false);
  const [buscarMentor, setBuscarMentor] = React.useState("");

  // Estado local para atualização imediata da UI (evita "piscar")
  const [localStatus, setLocalStatus] = React.useState<string>(mentoria.status);

  // Sincroniza quando a prop mentoria muda
  React.useEffect(() => {
    setLocalStatus(mentoria.status);
  }, [mentoria.status]);

  const mentoresFiltrados = React.useMemo(() => {
    if (!buscarMentor) return state.mentores;
    return state.mentores.filter((m) => m.nome.toLowerCase().includes(buscarMentor.toLowerCase()));
  }, [state.mentores, buscarMentor]);

  const selecionarMentor = (mentorId: string) => {
    dispatch({ type: "ATRIBUIR_MENTOR", payload: { mentoriaId: mentoria.id, mentorId } });
    setShowMentorModal(false);
    setBuscarMentor("");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header do card */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Info principal */}
          <div className="">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-blue-900">{mentoria.empreendedor}</h3>
              <span className={`text-xs px-4 py-0.5 rounded-full font-bold border ${colorMap[mentoria.status]}`}>
                {STATUS_MAP[mentoria.status] || mentoria.status}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <span>{projeto?.nome || "—"}</span>
              </div>
              {mentoria.negocio && (
                <div className="flex items-center gap-1">
                  <span className="line-clamp-1">{mentoria.negocio}</span>
                </div>
              )}
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
          </div>

          {/* Ações rápidas */}
          <div className="flex flex-col gap-2 min-w-[200px]">
            {/* Exibe mentor como texto (substitui o dropdown) */}
            <div className="flex items-center gap-2">
              <button 
              onClick={() => setShowMentorModal(true)}
              className="flex-1 h-9 px-2 text-sm border rounded-md bg-white flex items-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="flex-1 h-9 px-2 text-sm border rounded-md bg-white flex items-center">
                <User className="w-4 h-4 text-gray-500 flex-shrink-0 mr-2" />
                {mentor?.nome || "Sem mentor"}
                </span>
              </button>
            </div>

            {/* Seletor de status */}
            <select
              className="h-9 px-2 text-sm border rounded-md bg-white"
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
          </div>
        </div>
      </div>

      {/* Modal de busca/seleção de mentor */}
      {showMentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMentorModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4 z-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold">Buscar mentor</h4>
              <button
                type="button"
                onClick={() => setShowMentorModal(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Fechar
              </button>
            </div>

            <input
              type="text"
              value={buscarMentor}
              onChange={(e) => setBuscarMentor(e.target.value)}
              placeholder="Pesquisar por nome..."
              className="w-full border rounded px-3 py-2 mb-3 text-sm"
            />

            <div className="max-h-64 overflow-auto divide-y border-t border-b">
              {mentoresFiltrados.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">Nenhum mentor encontrado</div>
              ) : (
                mentoresFiltrados.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selecionarMentor(m.id)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-sm">{m.nome}</div>
                    {m.email && <div className="text-xs text-gray-500">{m.email}</div>}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer com info adicional */}
      <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex items-center justify-between">
        <span>
          Atualizado: {new Date(mentoria.ultimaAtualizacaoISO).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </div>
  );
}

// Componentes auxiliares
function Th({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <th className={`text-left font-semibold px-3 py-2 ${className}`}>{children}</th>;
}

function Td({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <td className={`px-3 py-2 align-top ${className}`}>{children}</td>;
}