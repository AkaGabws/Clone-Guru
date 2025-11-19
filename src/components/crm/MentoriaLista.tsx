import React from "react";
import { useCrm } from "../../store/CrmContext";
import { Button } from "../../components/ui/button";
import { StatusMentoria } from "../../types/crm";
import { MapPin, X, Edit2, Trash2, Save, User } from "lucide-react";

// 1. Definição dos Status conforme sua regra
const STATUS_MAP: Record<string, string> = {
  nova: 'Nova',
  triagem: 'Triagem',
  agendada: 'Agendada',
  ativa: 'Ativa',
  pausada: 'Pausada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

export function MentoriaLista() {
  const { state, dispatch } = useCrm();
  
  // Estado para controlar qual mentoria está aberta no Modal
  const [mentoriaSelecionadaId, setMentoriaSelecionadaId] = React.useState<string | null>(null);
  
  // Estado local para busca (input de texto)
  const [buscaLocal, setBuscaLocal] = React.useState("");

  // --- NOVO: estado local para seleção imediata de status/mentor por mentoria ---
  const [localSelecoes, setLocalSelecoes] = React.useState<Record<string, { status?: string; mentorId?: string | undefined }>>({});

  // --- NOVO: modal de seleção de mentor ---
  const [showMentorModal, setShowMentorModal] = React.useState(false);
  const [mentorModalMentoriaId, setMentorModalMentoriaId] = React.useState<string | null>(null);
  const [buscarMentor, setBuscarMentor] = React.useState("");

  const mentoresFiltrados = React.useMemo(() => {
    const ativos = state.mentores.filter(m => m.ativo);
    if (!buscarMentor) return ativos;
    return ativos.filter(m => m.nome.toLowerCase().includes(buscarMentor.toLowerCase()));
  }, [state.mentores, buscarMentor]);

  // --- NOVO: filtros locais (projeto + data) ---
  const [projectFilter, setProjectFilter] = React.useState<string>("todos");
  const [dateFilter, setDateFilter] = React.useState<
    "todos" | "hoje" | "ultimos3Dias" | "ultimaSemana" | "ultimoMes" | "ultimoAno" | "custom"
  >("todos");
  const [customFrom, setCustomFrom] = React.useState<string>(""); // YYYY-MM-DD
  const [customTo, setCustomTo] = React.useState<string>(""); // YYYY-MM-DD

  // Sincroniza o estado local sempre que as mentorias mudarem (inicializa/atualiza)
  React.useEffect(() => {
    const mapa: Record<string, { status?: string; mentorId?: string | undefined }> = {};
    for (const m of state.mentorias) {
      mapa[m.id] = { status: m.status, mentorId: m.mentorId ?? undefined };
    }
    setLocalSelecoes(mapa);
  }, [state.mentorias]);

  const abrirModalMentor = (mentoriaId: string) => {
    setMentorModalMentoriaId(mentoriaId);
    setBuscarMentor("");
    setShowMentorModal(true);
  };

  const selecionarMentor = (mentorId: string) => {
    const mentoriaId = mentorModalMentoriaId;
    if (!mentoriaId) return;
    // atualiza UI local
    setLocalSelecoes(prev => ({ ...prev, [mentoriaId]: { ...prev[mentoriaId], mentorId } }));
    // dispatch para o reducer
    dispatch({
      type: "ATRIBUIR_MENTOR",
      payload: { mentoriaId, mentorId }
    });
    setShowMentorModal(false);
    setMentorModalMentoriaId(null);
    setBuscarMentor("");
  };

  const data = React.useMemo(() => {
    const { status, mentorId, projetoId } = state.filtro;
    
    // helper para range de datas baseado no filtro local
    function getDateRange() {
      const now = new Date();
      const startOfDay = (d: Date) => { const t = new Date(d); t.setHours(0,0,0,0); return t; };
      const endOfDay = (d: Date) => { const t = new Date(d); t.setHours(23,59,59,999); return t; };
      switch (dateFilter) {
        case "hoje": return { from: startOfDay(now), to: endOfDay(now) };
        case "ultimos3Dias": { const from = new Date(now); from.setDate(now.getDate() - 3); return { from: startOfDay(from), to: endOfDay(now) }; }
        case "ultimaSemana": { const from = new Date(now); from.setDate(now.getDate() - 7); return { from: startOfDay(from), to: endOfDay(now) }; }
        case "ultimoMes": { const from = new Date(now); from.setMonth(now.getMonth() - 1); return { from: startOfDay(from), to: endOfDay(now) }; }
        case "ultimoAno": { const from = new Date(now); from.setFullYear(now.getFullYear() - 1); return { from: startOfDay(from), to: endOfDay(now) }; }
        case "custom":
          if (!customFrom && !customTo) return null;
          const from = customFrom ? startOfDay(new Date(customFrom)) : undefined;
          const to = customTo ? endOfDay(new Date(customTo)) : undefined;
          return { from: from ?? new Date(0), to: to ?? endOfDay(now) };
        default: return null;
      }
    }

    const range = getDateRange();

    return state.mentorias
      .filter((m) => {
        // Recupera objetos relacionados para busca profunda
        const mentor = m.mentorId ? state.mentores.find((x) => x.id === m.mentorId) : null;
        const projeto = state.projetos.find((p) => p.id === m.projetoId);

        // 1. Filtros Dropdown (existentes)
        const byStatus = !status || status === "todas" ? true : m.status === status;
        const byMentor = !mentorId || mentorId === "todos" ? true : m.mentorId === mentorId;
        // aplica filtro global do state e filtro local de projeto (local tem prioridade se diferente de "todos")
        const byProjetoGlobal = !projetoId || projetoId === "todos" ? true : m.projetoId === projetoId;
        const byProjetoLocal = projectFilter === "todos" ? true : m.projetoId === projectFilter;
        const byProjeto = byProjetoGlobal && byProjetoLocal;

        // 2. Busca Geral (Mentor, Empreendedor, Local, Desafio)
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

        // filtro por data (ultimaAtualizacaoISO)
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
  }, [state.mentorias, state.filtro, state.mentores, state.projetos, buscaLocal, projectFilter, dateFilter, customFrom, customTo]);

  return (
    <>
      {/* Barra de Busca Simples acima da tabela */}
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

      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <Th>Empreendedor</Th>
              <Th>Projeto</Th>
              <Th>Status</Th>
              <Th>Mentor</Th>
              <Th className="text-right pr-3">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhuma mentoria encontrada
                </td>
              </tr>
            ) : (
              data.map((m) => {
                const projeto = state.projetos.find((p) => p.id === m.projetoId);
                const mentor = m.mentorId ? state.mentores.find((x) => x.id === m.mentorId) : undefined;
                
                return (
                  <tr key={m.id} className="border-t hover:bg-gray-50 transition-colors">
                    <Td>
                      <div className="font-semibold text-blue-900">{m.empreendedor}</div>
                      {m.desafio && <div className="text-gray-600 text-xs line-clamp-1">{m.desafio}</div>}
                    </Td>
                    <Td>{projeto?.nome ?? "—"}</Td>
                    <Td>
                      {/* Dropdown de Edição Rápida de Status */}
                      <select
                        className="border rounded-md h-8 px-2 text-xs bg-white w-full max-w-[160px]"
                        // usa valor local se existir, caso contrário usa o valor do state
                        value={localSelecoes[m.id]?.status ?? m.status}
                        onChange={(e) => {
                          const novoStatus = e.target.value as StatusMentoria;
                          // atualiza UI imediatamente
                          setLocalSelecoes(prev => ({ ...prev, [m.id]: { ...prev[m.id], status: novoStatus } }));
                          // dispatch para o reducer
                          dispatch({ 
                            type: "MUDAR_STATUS", 
                            payload: { 
                              mentoriaId: m.id, 
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
                    </Td>
                    <Td>
                      {/* Botão que abre modal de seleção de mentor (substitui o dropdown) */}
                      <button
                        type="button"
                        onClick={() => abrirModalMentor(m.id)}
                        className="flex items-center gap-2 border rounded-md h-8 px-2 text-xs bg-white w-full max-w-[160px] hover:bg-gray-50"
                      >
                        <span className="truncate">{mentor?.nome || "Sem mentor"}</span>
                      </button>
                    </Td>
                    <Td className="text-right">
                      {/* Botão Abrir Modal */}
                      <Button 
                          onClick={() => setMentoriaSelecionadaId(m.id)}
                          className="h-8 px-3 bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-500 rounded-full"
                      >
                        Encontros
                      </Button>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de busca/seleção de mentor */}
      {showMentorModal && mentorModalMentoriaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowMentorModal(false); setMentorModalMentoriaId(null); }} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4 z-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold">Buscar mentor</h4>
              <button type="button" onClick={() => { setShowMentorModal(false); setMentorModalMentoriaId(null); }} className="text-sm text-gray-600 hover:text-gray-800">Fechar</button>
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
                mentoresFiltrados.map((mt) => (
                  <button
                    key={mt.id}
                    type="button"
                    onClick={() => selecionarMentor(mt.id)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-sm">{mt.nome}</div>
                    {mt.email && <div className="text-xs text-gray-500">{mt.email}</div>}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Renderiza o Modal se houver ID selecionado */}
      {mentoriaSelecionadaId && (
          <MentoriaDetalhesModal 
            mentoriaId={mentoriaSelecionadaId} 
            onClose={() => setMentoriaSelecionadaId(null)} 
          />
      )}
    </>
  );
}

// --- Componentes Auxiliares ---

function Th({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <th className={`text-left font-semibold px-3 py-2 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <td className={`px-3 py-2 align-top ${className}`}>{children}</td>;
}

// --- Novo Componente: Modal de Detalhes ---
function MentoriaDetalhesModal({ mentoriaId, onClose }: { mentoriaId: string, onClose: () => void }) {
    const { state, dispatch } = useCrm();
    
    const m = state.mentorias.find(x => x.id === mentoriaId);
    const mentor = m?.mentorId ? state.mentores.find(x => x.id === m.mentorId) : null;
    const projeto = state.projetos.find(p => p.id === m?.projetoId);

    // Filtra relatos desta mentoria
    const relatos = state.relatos
        .filter(r => r.mentoriaId === mentoriaId)
        .sort((a, b) => (a.dataISO < b.dataISO ? 1 : -1));

    if (!m) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                
                {/* Header do Modal */}
                <div className="flex justify-between items-start p-4 border-b bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-blue-900">{m.empreendedor}</h2>
                        <p className="text-sm text-gray-600">Projeto: {projeto?.nome} • Mentor: {mentor?.nome || 'Não atribuído'}</p>
                        <div className="mt-1">
                             <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                {STATUS_MAP[m.status] || m.status}
                             </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Corpo com Scroll */}
                <div className="overflow-y-auto p-4 space-y-6 flex-1">
                    
                    {/* Seção 1: Próximo Encontro */}
                    <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                        <h3 className="text-sm font-bold text-blue-900 mb-2">📅 Próximo Encontro</h3>
                        <div className="text-sm text-gray-700">
                            {/* Aqui você pode ligar com um campo real de data se tiver */}
                            <p>Data: <strong>15 de Julho de 2024</strong></p>
                            <p>Hora: <strong>14:00 - 15:00</strong></p>
                        </div>
                    </div>

                    {/* Seção 2: Informações da Mentoria */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-2 border-b pb-1">Informações</h3>
                        <div className="space-y-2 text-sm">
                            {m.negocio && (
                                <div>
                                    <span className="font-semibold text-gray-700">Negócio:</span>
                                    <p className="text-gray-600 mt-1">{m.negocio}</p>
                                </div>
                            )}
                            {m.desafio && (
                                <div>
                                    <span className="font-semibold text-gray-700">Desafio:</span>
                                    <p className="text-gray-600 mt-1">{m.desafio}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seção 3: Histórico de Relatos */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 border-b pb-1">Relatos</h3>
                        
                        {relatos.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Nenhum relato registrado.</p>
                        ) : (
                            <div className="space-y-3">
                                {relatos.map(relato => (
                                    <RelatoItem key={relato.id} relato={relato} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 border-t bg-gray-50 text-right">
                    <Button variant="outline" onClick={onClose} className="text-xs">Fechar</Button>
                </div>
            </div>
        </div>
    );
}

// Adiciona tipos mínimos usados localmente
type Relato = {
  id: string;
  mentoriaId: string;
  texto: string;
  dataISO: string;
};

// --- Componente Item de Relato (Com Edição) ---
function RelatoItem({ relato }: { relato: Relato }) {
    const { dispatch } = useCrm();
    // dispatch do contexto pode ter tipos restritos — usar uma versão local mais permissiva para ações dinâmicas
    const dispatchAny = dispatch as unknown as (action: any) => void;

    const [isEditing, setIsEditing] = React.useState(false);
    const [textoEditado, setTextoEditado] = React.useState(relato.texto);
    const handleSave = () => {
        dispatchAny({ type: "EDITAR_RELATO", payload: { relatoId: relato.id, texto: textoEditado } });
        setTextoEditado("");
        setIsEditing(false);
    }
    const handleDelete = () => {
        dispatchAny({ type: "EXCLUIR_RELATO", payload: { relatoId: relato.id } });
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <div className="border rounded-md p-3 bg-yellow-50 border-yellow-200">
                <textarea
                    className="w-full text-sm p-2 border rounded mb-2"
                    rows={3}
                    value={textoEditado}
                    onChange={(e) => setTextoEditado(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                     <Button variant="ghost" onClick={() => setIsEditing(false)} className="h-8">
                        Cancelar
                     </Button>
                     <Button onClick={handleSave} className="h-8 bg-blue-600 hover:bg-blue-700">
                        <Save className="w-3 h-3 mr-1" /> Salvar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="border rounded-md p-3 hover:shadow-sm transition-shadow bg-white">
            <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold text-gray-500">
                    {new Date(relato.dataISO).toLocaleString('pt-BR')}
                </span>
                <div className="flex gap-1">
                    <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-blue-600" title="Editar">
                        <Edit2 className="w-3 h-3" />
                    </button>
                    <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-red-600" title="Excluir">
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{relato.texto}</p>
        </div>
    );
}