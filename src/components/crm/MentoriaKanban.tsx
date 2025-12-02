import React from "react";
import { Button } from "../../components/ui/button";
import { useCrm } from "../../store/CrmContext";
import { StatusMentoria } from "../../types/crm";
import { User, Video } from "lucide-react";
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

export function MentoriaKanban() {
  const { state, dispatch } = useCrm();
  
  // Estado para busca local
  const [buscaLocal, setBuscaLocal] = React.useState("");
  
  // Estado para controlar qual mentoria está aberta no Modal
  const [mentoriaSelecionadaId, setMentoriaSelecionadaId] = React.useState<string | null>(null);
  // Estado para controlar qual mentoria está aberta no Modal de Acompanhamento
  const [mentoriaAcompanhamentoId, setMentoriaAcompanhamentoId] = React.useState<string | null>(null);
  
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

  // Filtro de quantidade de encontros (custom é o padrão)
  const [encontrosFilter, setEncontrosFilter] = React.useState<string>("custom");
  const [customMinEncontros, setCustomMinEncontros] = React.useState<string>("");
  const [customMaxEncontros, setCustomMaxEncontros] = React.useState<string>("");

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

        return byStatus && byMentor && byProjeto && byBusca && byDate && byEncontros;
      })
      .sort((a, b) => (a.ultimaAtualizacaoISO < b.ultimaAtualizacaoISO ? 1 : -1));
  // dependências: inclui filtros de data e encontros
  }, [state.mentorias, state.filtro, state.mentores, state.projetos, state.relatos, buscaLocal, abaAtiva, dateFilter, customFrom, customTo, projectFilter, encontrosFilter, customMinEncontros, customMaxEncontros]);

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

        {/* Filtro por Quantidade de Encontros */}
        <div className="flex items-center gap-1">
          <select
            className="border rounded-md h-9 px-2 text-sm bg-white"
            value={encontrosFilter}
            onChange={(e) => setEncontrosFilter(e.target.value)}
          >
            <option value="todos">Todos encontros</option>
            <option value="custom">Custom</option>
            <option value="0">Sem encontros</option>
          </select>

          {encontrosFilter === "custom" && (
            <>
              <input 
                type="number" 
                min="0"
                placeholder="Mín"
                className="h-9 px-2 text-sm border rounded-md bg-white w-20" 
                value={customMinEncontros} 
                onChange={(e) => setCustomMinEncontros(e.target.value)} 
              />
              <span className="text-xs text-gray-500">—</span>
              <input 
                type="number" 
                min="0"
                placeholder="Máx"
                className="h-9 px-2 text-sm border rounded-md bg-white w-20" 
                value={customMaxEncontros} 
                onChange={(e) => setCustomMaxEncontros(e.target.value)} 
              />
            </>
          )}
        </div>
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

function MatchCard({ mentoria, projeto, mentor, onAbrirEncontros, onAbrirAcompanhamento, abaAtiva }: { 
  mentoria: any; 
  projeto: any; 
  mentor?: any;
  onAbrirEncontros: () => void;
  onAbrirAcompanhamento: () => void;
  abaAtiva: string;
}) {
  const { state, dispatch } = useCrm();
  const [expanded, setExpanded] = React.useState(false);
  const [showMentorModal, setShowMentorModal] = React.useState(false);

  // Estado local para atualização imediata da UI (evita "piscar")
  const [localStatus, setLocalStatus] = React.useState<string>(mentoria.status);
  const [localMentorId, setLocalMentorId] = React.useState<string | undefined>(mentoria.mentorId);

  // Sincroniza quando a prop mentoria muda
  React.useEffect(() => {
    setLocalStatus(mentoria.status);
  }, [mentoria.status]);

  React.useEffect(() => {
    setLocalMentorId(mentoria.mentorId);
  }, [mentoria.mentorId]);

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

  return (
    <div className="bg-white   rounded-t-lg rounded-b-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-2 bg-blue-900 border-b rounded-t-lg text-bold text-base text-gray-500 flex items-center justify-between">
        <span className="font-bold text-yellow-400">{projeto?.nome || "—"}</span>
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
            
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
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

            {/* Informações adicionais baseadas no status */}
            {localStatus === "ativa" && (
              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                {ultimoEncontro ? (
                  <>
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Encontro {totalEncontros}:
                    </p>
                    <p className="text-xs text-blue-800 line-clamp-2">
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
            )}

            {/* Seção de Acompanhamento */}
            {!isMentoriaNova && mentoria.status !== "expirada" && abaAtiva !== "expiradas" && (
              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-xs font-semibold text-gray-700 mb-2">Acompanhamento:</p>
                <div className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <span className="text-gray-600 font-medium">Encontros (Guru):</span>
                    <span className="text-gray-800">{totalEncontros}</span>
                  </div>
                  {mentoria.numEncontrosAcompanhamento !== undefined && (
                    <div className="flex gap-2">
                      <span className="text-gray-600 font-medium">Encontros (Acompanhamento):</span>
                      <span className="text-gray-800">{mentoria.numEncontrosAcompanhamento}</span>
                    </div>
                  )}
                  {mentoria.proximoEncontroDataISO && (
                    <div className="flex gap-2">
                      <span className="text-gray-600 font-medium">Próximo encontro:</span>
                      <span className="text-gray-800">
                        {new Date(mentoria.proximoEncontroDataISO).toLocaleDateString('pt-BR')}
                        {mentoria.proximoEncontroHorario && ` às ${mentoria.proximoEncontroHorario}`}
                      </span>
                    </div>
                  )}
                  {mentoria.observacaoEmpreendedor && (
                    <div>
                      <span className="text-gray-600 font-medium block mb-1">Obs. Empreendedor:</span>
                      <p className="text-gray-800 line-clamp-2">{mentoria.observacaoEmpreendedor}</p>
                    </div>
                  )}
                  {mentoria.observacaoMentor && (
                    <div>
                      <span className="text-gray-600 font-medium block mb-1">Obs. Mentor:</span>
                      <p className="text-gray-800 line-clamp-2">{mentoria.observacaoMentor}</p>
                    </div>
                  )}
                  {mentoria.motivoCancelamento && (
                    <div>
                      <span className="text-gray-600 font-medium block mb-1">Motivo Finalização:</span>
                      <p className="text-gray-800">{mentoria.motivoCancelamento}</p>
                    </div>
                  )}
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
          <div className="flex flex-col gap-2 min-w-[200px]">
            {/* Exibe mentor como texto (substitui o dropdown) */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-bold">Mentor:</span>
              <button 
                onClick={() => setShowMentorModal(true)}
                className="flex-1 h-9 px-2 text-sm border rounded-md bg-white flex items-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-gray-500 flex-shrink-0 mr-2" />
                <span className="flex-1 text-left">
                  {localMentorId ? state.mentores.find((m) => m.id === localMentorId)?.nome || "Sem mentor" : "Sem mentor"}
                </span>
              </button>
            </div>

            {/* Seletor de status - não aparece na aba pendentes */}
            {abaAtiva !== "pendentes" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-bold">Status:</span>
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
                <span className="text-sm text-gray-500 font-bold">Encontros:</span>
                <button
                  onClick={onAbrirEncontros}
                  disabled={naoTemEncontros}
                  className={`flex-1 h-9 px-2 text-sm border rounded-md flex items-center transition-colors ${
                    naoTemEncontros
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                      : "bg-white hover:bg-gray-50 cursor-pointer text-black"
                  }`}
                >
                  <NotebookPen className={`w-4 h-4 flex-shrink-0 mr-2 ${naoTemEncontros ? "text-gray-400" : "text-gray-500"}`} />
                  <span>Ver encontros</span>
                </button>
              </div>
            )}

            {/* Botão Acompanhamento - aparece apenas para mentorias ativas, concluídas ou pausadas */}
            {!isMentoriaNova && abaAtiva !== "pendentes" && abaAtiva !== "expiradas" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-bold">Acompanhamento:</span>
                <button
                  onClick={onAbrirAcompanhamento}
                  className="flex-1 h-9 px-2 text-sm border rounded-md flex items-center transition-colors bg-white hover:bg-gray-50 cursor-pointer text-black"
                >
                  <NotebookPen className="w-4 h-4 flex-shrink-0 mr-2 text-gray-500" />
                  <span>Acompanhamento</span>
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
      />

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
              onClick={() => {
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
              }}
              className="h-7 px-3 text-xs bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
            >
              Reabrir Mentoria
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