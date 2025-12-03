import React from "react";
import { useCrm } from "../../store/CrmContext";
import { Button } from "../../components/ui/button";
import { User, ChevronDown, ChevronRight, Edit, BookOpen } from "lucide-react";
import { MentoriaDetalhesModal } from "./modals";

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

interface MentorGroup {
  mentor: any;
  mentorias: any[];
  totalMentorias: number;
  mentoriasAtivas: number;
  mentoriasConcluidas: number;
}

export function MentorList() {
  const { state } = useCrm();
  
  // Estado para busca
  const [buscaLocal, setBuscaLocal] = React.useState("");
  
  // Filtro de projeto
  const [projectFilter, setProjectFilter] = React.useState<string>("todos");
  
  // Filtro de quantidade de mentorias ativas
  const [mentoriasAtivasFilter, setMentoriasAtivasFilter] = React.useState<string>("custom");
  const [customMinMentoriasAtivas, setCustomMinMentoriasAtivas] = React.useState<string>("");
  const [customMaxMentoriasAtivas, setCustomMaxMentoriasAtivas] = React.useState<string>("");
  
  
  // Estado para controlar quais mentores estão expandidos
  const [mentoresExpandidos, setMentoresExpandidos] = React.useState<Set<string>>(new Set());
  
  // Estado para modais
  const [editId, setEditId] = React.useState<string | null>(null);
  const [mentoriaSelecionadaId, setMentoriaSelecionadaId] = React.useState<string | null>(null);

  // Agrupa mentorias por mentor
  const mentoresAgrupados = React.useMemo(() => {
    const grupos: Record<string, MentorGroup> = {};

    state.mentores.forEach((mentor) => {
      // Filtro por projeto - filtra mentorias do mentor
      let mentoriasDoMentor = state.mentorias.filter(m => m.mentorId === mentor.id);
      
      if (projectFilter !== "todos") {
        mentoriasDoMentor = mentoriasDoMentor.filter(m => m.projetoId === projectFilter);
      }
      
      grupos[mentor.id] = {
        mentor,
        mentorias: mentoriasDoMentor,
        totalMentorias: mentoriasDoMentor.length,
        mentoriasAtivas: mentoriasDoMentor.filter(m => m.status === "ativa").length,
        mentoriasConcluidas: mentoriasDoMentor.filter(m => m.status === "concluida").length,
      };
    });

    // Aplica filtros
    let resultado = Object.values(grupos);
    
    // Filtro por quantidade de mentorias ativas
    if (mentoriasAtivasFilter !== "todos") {
      if (mentoriasAtivasFilter === "custom") {
        // Filtro customizado: range entre min e max
        if (!customMinMentoriasAtivas && !customMaxMentoriasAtivas) {
          // Se ambos estiverem vazios, não filtra
        } else {
          const min = customMinMentoriasAtivas ? parseInt(customMinMentoriasAtivas) : 0;
          const max = customMaxMentoriasAtivas ? parseInt(customMaxMentoriasAtivas) : Infinity;
          if (isNaN(min) && isNaN(max)) {
            // Não filtra
          } else if (isNaN(min)) {
            resultado = resultado.filter(grupo => grupo.mentoriasAtivas <= max);
          } else if (isNaN(max)) {
            resultado = resultado.filter(grupo => grupo.mentoriasAtivas >= min);
          } else {
            resultado = resultado.filter(grupo => grupo.mentoriasAtivas >= min && grupo.mentoriasAtivas <= max);
          }
        }
      } else {
        // Filtros pré-definidos
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
    
    // Filtro de busca
    if (buscaLocal) {
      const buscaLower = buscaLocal.toLowerCase();
      resultado = resultado.filter(grupo => 
        grupo.mentor.nome.toLowerCase().includes(buscaLower) ||
        grupo.mentor.email?.toLowerCase().includes(buscaLower) ||
        grupo.mentor.area?.toLowerCase().includes(buscaLower) ||
        grupo.mentorias.some(m => {
          const projeto = state.projetos.find(p => p.id === m.projetoId);
          return (
            m.empreendedor.toLowerCase().includes(buscaLower) ||
            m.negocio?.toLowerCase().includes(buscaLower) ||
            projeto?.nome.toLowerCase().includes(buscaLower)
          );
        })
      );
    }

    // Ordena por nome do mentor
    return resultado.sort((a, b) => a.mentor.nome.localeCompare(b.mentor.nome));
  }, [state.mentorias, state.mentores, state.projetos, buscaLocal, projectFilter, mentoriasAtivasFilter, customMinMentoriasAtivas, customMaxMentoriasAtivas]);

  const toggleExpandir = (mentorId: string) => {
    setMentoresExpandidos(prev => {
      const novo = new Set(prev);
      if (novo.has(mentorId)) {
        novo.delete(mentorId);
      } else {
        novo.add(mentorId);
      }
      return novo;
    });
  };

  // Conta encontros de uma mentoria
  const contarEncontros = (mentoriaId: string) => {
    return state.relatos.filter(r => r.mentoriaId === mentoriaId).length;
  };

  if (!state || !Array.isArray(state.mentores)) {
    return <div className="p-6 text-red-600">Erro: contexto CRM não disponível ou lista de mentores não encontrada.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-blue-900 mb-4">
          Administração de Mentores
        </h2>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="mb-4 flex gap-2 items-center flex-wrap">
        <input 
          type="text" 
          placeholder="Buscar por mentor, competência, empreendedor, projeto..." 
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
        
        {/* Filtro por Quantidade de Mentorias Ativas */}
        <div className="flex items-center gap-1">
          <select
            className="border rounded-md h-9 px-2 text-sm bg-white"
            value={mentoriasAtivasFilter}
            onChange={(e) => setMentoriasAtivasFilter(e.target.value)}
          >
            <option value="todos">Todas mentorias ativas</option>
            <option value="0">Sem mentorias ativas</option>
            <option value="custom">Custom</option>
           </select>

          {mentoriasAtivasFilter === "custom" && (
            <>
              <input 
                type="number" 
                min="0"
                placeholder="Mín"
                className="h-9 px-2 text-sm border rounded-md bg-white w-20" 
                value={customMinMentoriasAtivas} 
                onChange={(e) => setCustomMinMentoriasAtivas(e.target.value)} 
              />
              <span className="text-xs text-gray-500">—</span>
              <input 
                type="number" 
                min="0"
                placeholder="Máx"
                className="h-9 px-2 text-sm border rounded-md bg-white w-20" 
                value={customMaxMentoriasAtivas} 
                onChange={(e) => setCustomMaxMentoriasAtivas(e.target.value)} 
              />
            </>
          )}
        </div>
      </div>

      {/* Tabela de Mentores e Mentorias */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-900 text-gray-600">
            <tr>
              <Th className="text-yellow-400">Empreendedor</Th>
              <Th className="text-yellow-400">Projeto</Th>
              <Th className="text-yellow-400">Status</Th>
              <Th className="text-yellow-400">Encontros</Th>
              <Th className="text-yellow-400 text-right pr-10">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {mentoresAgrupados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhum mentor encontrado
                </td>
              </tr>
            ) : (
              mentoresAgrupados.flatMap((grupo) => {
                const estaExpandido = mentoresExpandidos.has(grupo.mentor.id);
                
                return [
                  // Linha do Mentor (cabeçalho)
                  <tr 
                    key={`header-${grupo.mentor.id}`}
                    className="bg-blue-50 border-b-2 border-blue-200 cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleExpandir(grupo.mentor.id)}
                  >
                    <Td colSpan={5} className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {estaExpandido ? (
                            <ChevronDown className="w-5 h-5 text-blue-900" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-blue-900" />
                          )}
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-900" />
                            <div>
                              <span className="font-bold text-blue-900 text-base">{grupo.mentor.nome}</span>
                              <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                                {grupo.mentor.email && <span>{grupo.mentor.email}</span>}
                                {grupo.mentor.area && <span>• {grupo.mentor.area}</span>}
                                <span className={`px-2 py-0.5 rounded-full ${grupo.mentor.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {grupo.mentor.ativo ? 'Ativo' : 'Inativo'}
                                </span>
                              </div>
                            </div>
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
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditId(grupo.mentor.id);
                            }}
                            className="h-8 px-3 text-xs flex items-center gap-1 whitespace-nowrap bg-blue-900 text-white hover:bg-blue-800"
                          >
                            <Edit className="w-3 h-3" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </Td>
                  </tr>,
                  // Linhas das Mentorias (quando expandido)
                  ...(estaExpandido ? grupo.mentorias.map((mentoria) => {
                    const projeto = state.projetos.find(p => p.id === mentoria.projetoId);
                    const numEncontros = contarEncontros(mentoria.id);
                    
                    return (
                      <tr 
                        key={mentoria.id}
                        className="border-t hover:bg-gray-50 transition-colors bg-gray-50/50"
                      >
                        <Td className="pl-8">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">└─</span>
                            <span className="text-sm text-gray-700 font-medium">{mentoria.empreendedor}</span>
                          </div>
                        </Td>
                        <Td>
                          <span className="text-sm text-gray-700">{projeto?.nome ?? "—"}</span>
                        </Td>
                        <Td>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold border inline-block ${STATUS_COLOR_MAP[mentoria.status] || 'bg-gray-100 text-gray-700'}`}>
                            {STATUS_MAP[mentoria.status] || mentoria.status}
                          </span>
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
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMentoriaSelecionadaId(mentoria.id);
                            }}
                            className="h-8 px-3 text-xs flex items-center gap-1 whitespace-nowrap"
                          >
                            <BookOpen className="w-3 h-3" />
                            Encontros
                          </Button>
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

      {/* Modal de Edição */}
      {editId && <MentorEditor mentorId={editId} onClose={() => setEditId(null)} />}

      {/* Modal de Encontros */}
      {mentoriaSelecionadaId && (
        <MentoriaDetalhesModal 
          mentoriaId={mentoriaSelecionadaId} 
          onClose={() => setMentoriaSelecionadaId(null)} 
        />
      )}
    </div>
  );
}

function MentorEditor({ mentorId, onClose }: { mentorId: string; onClose: () => void }) {
  const { state, dispatch } = useCrm();
  const mentor = state.mentores.find((x) => x.id === mentorId)!;

  const [form, setForm] = React.useState({
    nome: mentor.nome,
    email: mentor.email ?? "",
    telefone: mentor.telefone ?? "",
    area: mentor.area ?? "",
    ativo: mentor.ativo,
  });

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  function salvar() {
    dispatch({ type: "ATUALIZAR_MENTOR", payload: { mentor: { ...mentor, ...form } } });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900">Editar Mentor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <Input label="Email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
          <Input label="Telefone" value={form.telefone} onChange={(v) => setForm((f) => ({ ...f, telefone: v }))} />
          <div className="flex items-center gap-2">
            <input 
              id="ativo" 
              type="checkbox" 
              checked={form.ativo} 
              onChange={(e) => setForm((f) => ({ ...f, ativo: e.target.checked }))} 
              className="w-4 h-4"
            />
            <label htmlFor="ativo" className="text-sm">Ativo</label>
          </div>
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-blue-900 hover:bg-blue-800" onClick={salvar}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-sm">
      <span className="block text-xs text-gray-500 mb-1">{label}</span>
      <input className="w-full border rounded-md px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

// Componentes Auxiliares
function Th({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <th className={`text-left font-semibold px-3 py-2 ${className}`}>{children}</th>;
}

function Td({ children, className = "", colSpan }: React.PropsWithChildren<{ className?: string; colSpan?: number }>) {
  return <td className={`px-3 py-3 align-middle ${className}`} colSpan={colSpan}>{children}</td>;
}
