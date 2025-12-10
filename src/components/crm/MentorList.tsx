import React from "react";
import { useCrm } from "../../store/CrmContext";
import { Button } from "../../components/ui/button";
import { User, Edit, ChevronLeft, ChevronRight, Eye, Mail, Phone, Check, Filter, Users, KanbanSquare, Info, Calendar, CheckSquare } from "lucide-react";

interface MentorData {
  mentor: any;
  mentorias: any[];
  totalMentorias: number;
  mentoriasAtivas: number;
  mentoriasConcluidas: number;
  mentoriasPausadas: number;
  mentoriasCanceladas: number;
  totalEncontros: number;
}

export function MentorList() {
  const { state } = useCrm();
  
  // Estado para busca
  const [buscaLocal, setBuscaLocal] = React.useState("");
  
  // Filtro de projeto
  const [projectFilter, setProjectFilter] = React.useState<string>("todos");
  
  // Filtro de estado/localidade
  const [estadoFilter, setEstadoFilter] = React.useState<string>("todos");
  
  // Filtro de competências/área
  const [competenciaFilter, setCompetenciaFilter] = React.useState<string>("todos");
  
  // Filtros demográficos
  const [generoFilter, setGeneroFilter] = React.useState<string>("todos");
  const [racaFilter, setRacaFilter] = React.useState<string>("todos");
  const [escolaridadeFilter, setEscolaridadeFilter] = React.useState<string>("todos");
  const [nacionalidadeFilter, setNacionalidadeFilter] = React.useState<string>("todos");
  
  // Filtro de quantidade de mentorias ativas
  const [mentoriasAtivasFilter, setMentoriasAtivasFilter] = React.useState<string>("todos");
  const [customMinMentoriasAtivas, setCustomMinMentoriasAtivas] = React.useState<string>("");
  const [customMaxMentoriasAtivas, setCustomMaxMentoriasAtivas] = React.useState<string>("");
  
  // Paginação
  const [paginaAtual, setPaginaAtual] = React.useState(1);
  const [itensPorPagina, setItensPorPagina] = React.useState(20);
  
  // Estado para modais
  const [editId, setEditId] = React.useState<string | null>(null);
  const [detalhesId, setDetalhesId] = React.useState<string | null>(null);
  const [mostrarModalFiltros, setMostrarModalFiltros] = React.useState(false);

  // Lista completa de estados brasileiros
  const estadosBrasileiros = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];
  const estadosDisponiveis = React.useMemo(() => {
    const estados = new Set<string>(estadosBrasileiros);
    state.mentores.forEach(m => {
      const estado = (m as any).estado || (m as any).uf;
      if (estado) estados.add(estado);
    });
    return Array.from(estados).sort();
  }, [state.mentores]);

  const competenciasDisponiveis = React.useMemo(() => {
    const competencias = new Set<string>();
    state.mentores.forEach(m => {
      if (m.area) competencias.add(m.area);
      // Se houver um campo de competências array
      const comp = (m as any).competencias;
      if (Array.isArray(comp)) {
        comp.forEach(c => competencias.add(c));
      }
    });
    return Array.from(competencias).sort();
  }, [state.mentores]);

  // Opções padrão para gênero
  const generosPadrao = ["Homem", "Mulher", "Não-binário", "Outro", "Prefiro não informar"];
  const generosDisponiveis = React.useMemo(() => {
    const generos = new Set<string>(generosPadrao);
    state.mentores.forEach(m => {
      const genero = (m as any).genero || (m as any).gender;
      if (genero) generos.add(genero);
    });
    return Array.from(generos).sort();
  }, [state.mentores]);

  // Opções padrão para raça/cor
  const racasPadrao = ["Branca", "Preta", "Parda", "Amarela", "Indígena", "Prefiro não informar"];
  const racasDisponiveis = React.useMemo(() => {
    const racas = new Set<string>(racasPadrao);
    state.mentores.forEach(m => {
      const raca = (m as any).raca || (m as any).cor;
      if (raca) racas.add(raca);
    });
    return Array.from(racas).sort();
  }, [state.mentores]);

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
    state.mentores.forEach(m => {
      const escolaridade = (m as any).escolaridade;
      if (escolaridade) escolaridades.add(escolaridade);
    });
    return Array.from(escolaridades).sort();
  }, [state.mentores]);

  // Opções padrão para nacionalidade
  const nacionalidadesPadrao = ["Brasileira", "Estrangeira"];
  const nacionalidadesDisponiveis = React.useMemo(() => {
    const nacionalidades = new Set<string>(nacionalidadesPadrao);
    state.mentores.forEach(m => {
      const nacionalidade = (m as any).nacionalidade;
      if (nacionalidade) nacionalidades.add(nacionalidade);
    });
    return Array.from(nacionalidades).sort();
  }, [state.mentores]);

  // Prepara dados dos mentores com estatísticas
  const mentoresComDados = React.useMemo(() => {
    const dados: MentorData[] = state.mentores.map((mentor) => {
      // Filtra mentorias do mentor
      let mentoriasDoMentor = state.mentorias.filter(m => m.mentorId === mentor.id);
      
      // Aplica filtro por projeto
      if (projectFilter !== "todos") {
        mentoriasDoMentor = mentoriasDoMentor.filter(m => m.projetoId === projectFilter);
      }
      
      // Calcula estatísticas
      const totalMentorias = mentoriasDoMentor.length;
      const mentoriasAtivas = mentoriasDoMentor.filter(m => m.status === "ativa").length;
      const mentoriasConcluidas = mentoriasDoMentor.filter(m => m.status === "concluida").length;
      const mentoriasPausadas = mentoriasDoMentor.filter(m => m.status === "pausada").length;
      const mentoriasCanceladas = mentoriasDoMentor.filter(m => m.status === "cancelada").length;
      
      // Conta total de encontros
      const totalEncontros = mentoriasDoMentor.reduce((acc, m) => {
        return acc + state.relatos.filter(r => r.mentoriaId === m.id).length;
      }, 0);
      
      return {
        mentor,
        mentorias: mentoriasDoMentor,
        totalMentorias,
        mentoriasAtivas,
        mentoriasConcluidas,
        mentoriasPausadas,
        mentoriasCanceladas,
        totalEncontros,
      };
    });

    // Aplica filtros
    let resultado = dados;
    
    // Filtro por estado
    if (estadoFilter !== "todos") {
      resultado = resultado.filter(d => {
        const estado = (d.mentor as any).estado || (d.mentor as any).uf;
        return estado === estadoFilter;
      });
    }
    
    // Filtro por competência
    if (competenciaFilter !== "todos") {
      resultado = resultado.filter(d => {
        if (d.mentor.area === competenciaFilter) return true;
        const comp = (d.mentor as any).competencias;
        if (Array.isArray(comp) && comp.includes(competenciaFilter)) return true;
        return false;
      });
    }
    
    // Filtro por gênero
    if (generoFilter !== "todos") {
      resultado = resultado.filter(d => {
        const genero = (d.mentor as any).genero;
        return genero === generoFilter;
      });
    }
    
    // Filtro por raça
    if (racaFilter !== "todos") {
      resultado = resultado.filter(d => {
        const raca = (d.mentor as any).raca;
        return raca === racaFilter;
      });
    }
    
    // Filtro por escolaridade
    if (escolaridadeFilter !== "todos") {
      resultado = resultado.filter(d => {
        const escolaridade = (d.mentor as any).escolaridade;
        return escolaridade === escolaridadeFilter;
      });
    }
    
    // Filtro por nacionalidade
    if (nacionalidadeFilter !== "todos") {
      resultado = resultado.filter(d => {
        const nacionalidade = (d.mentor as any).nacionalidade;
        return nacionalidade === nacionalidadeFilter;
      });
    }
    
    // Filtro por quantidade de mentorias ativas
    if (mentoriasAtivasFilter !== "todos") {
      if (mentoriasAtivasFilter === "custom") {
        if (customMinMentoriasAtivas || customMaxMentoriasAtivas) {
          const min = customMinMentoriasAtivas ? parseInt(customMinMentoriasAtivas) : 0;
          const max = customMaxMentoriasAtivas ? parseInt(customMaxMentoriasAtivas) : Infinity;
          resultado = resultado.filter(d => d.mentoriasAtivas >= min && d.mentoriasAtivas <= max);
        }
      } else {
        switch (mentoriasAtivasFilter) {
          case "0":
            resultado = resultado.filter(d => d.mentoriasAtivas === 0);
            break;
          case "1-3":
            resultado = resultado.filter(d => d.mentoriasAtivas >= 1 && d.mentoriasAtivas <= 3);
            break;
          case "4-6":
            resultado = resultado.filter(d => d.mentoriasAtivas >= 4 && d.mentoriasAtivas <= 6);
            break;
          case "7-10":
            resultado = resultado.filter(d => d.mentoriasAtivas >= 7 && d.mentoriasAtivas <= 10);
            break;
          case "11+":
            resultado = resultado.filter(d => d.mentoriasAtivas > 10);
            break;
        }
      }
    }
    
    // Filtro de busca por palavras-chave
    if (buscaLocal) {
      const buscaLower = buscaLocal.toLowerCase();
      const palavrasChave = buscaLower.split(/\s+/).filter(p => p.length > 0);
      
      resultado = resultado.filter(d => {
        const mentorAny = d.mentor as any;
        const textoCompleto = [
          // Informações básicas
          d.mentor.nome,
          d.mentor.email,
          d.mentor.area,
          d.mentor.telefone,
          d.mentor.bio,
          // Dados pessoais
          mentorAny.genero,
          mentorAny.gender, // alternativa
          mentorAny.cpf,
          mentorAny.raca,
          mentorAny.escolaridade,
          mentorAny.nacionalidade,
          // Contato
          mentorAny.ddd,
          // Localização
          mentorAny.estado,
          mentorAny.uf,
          mentorAny.cidade,
          mentorAny.cep,
          // Profissionais
          mentorAny.motivacao,
          mentorAny.motivacaoMentor, // alternativa
          mentorAny.experiencia,
          mentorAny.experienciaProfissional, // alternativa
          // Arrays
          ...(Array.isArray(mentorAny.competencias) ? mentorAny.competencias : []),
          ...(Array.isArray(mentorAny.areasConhecimento) ? mentorAny.areasConhecimento : [])
        ].filter(Boolean).join(' ').toLowerCase();
        
        // Verifica se todas as palavras-chave estão presentes
        return palavrasChave.every(palavra => textoCompleto.includes(palavra));
      });
    }

    // Ordena por nome do mentor
    return resultado.sort((a, b) => a.mentor.nome.localeCompare(b.mentor.nome));
  }, [state.mentorias, state.mentores, state.relatos, buscaLocal, projectFilter, estadoFilter, competenciaFilter, generoFilter, racaFilter, escolaridadeFilter, nacionalidadeFilter, mentoriasAtivasFilter, customMinMentoriasAtivas, customMaxMentoriasAtivas]);

  // Calcula paginação
  const totalMentores = mentoresComDados.length;
  const totalPaginas = Math.ceil(totalMentores / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const mentoresPaginados = mentoresComDados.slice(indiceInicio, indiceFim);

  // Conta filtros ativos
  const filtrosAtivos = React.useMemo(() => {
    let count = 0;
    if (buscaLocal.trim()) count++;
    if (projectFilter !== "todos") count++;
    if (estadoFilter !== "todos") count++;
    if (competenciaFilter !== "todos") count++;
    if (generoFilter !== "todos") count++;
    if (racaFilter !== "todos") count++;
    if (escolaridadeFilter !== "todos") count++;
    if (nacionalidadeFilter !== "todos") count++;
    if (mentoriasAtivasFilter !== "todos") count++;
    return count;
  }, [buscaLocal, projectFilter, estadoFilter, competenciaFilter, generoFilter, racaFilter, escolaridadeFilter, nacionalidadeFilter, mentoriasAtivasFilter]);

  // Limpar todos os filtros
  const limparFiltros = () => {
    setBuscaLocal("");
    setProjectFilter("todos");
    setEstadoFilter("todos");
    setCompetenciaFilter("todos");
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
  }, [buscaLocal, projectFilter, estadoFilter, competenciaFilter, generoFilter, racaFilter, escolaridadeFilter, nacionalidadeFilter, mentoriasAtivasFilter, customMinMentoriasAtivas, customMaxMentoriasAtivas]);

  if (!state || !Array.isArray(state.mentores)) {
    return <div className="p-6 text-red-600">Erro: contexto CRM não disponível ou lista de mentores não encontrada.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-blue-900">
          Administração de Mentores
        </h2>
        <div className="text-sm text-gray-600">
          Total: <strong>{totalMentores}</strong> mentores
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="mb-4 space-y-2">
        {/* Linha 1: Busca */}
        <div className="flex gap-2 items-center">
          <input 
            type="text" 
            placeholder="Buscar por qualquer informação (nome, email, CPF, telefone, área, competências, localidade, gênero, raça, escolaridade, nacionalidade, experiência, motivação...)" 
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

              {competenciaFilter !== "todos" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-300 text-blue-800 rounded-md text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  <span><strong>Competência:</strong> {competenciaFilter}</span>
                  <button
                    onClick={() => setCompetenciaFilter("todos")}
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

      {/* Tabela de Mentores */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-900 text-yellow-400">
            <tr>
              <Th>Mentor</Th>
              <Th>Localidade</Th>
              <Th>Competências</Th>
              <Th>Status</Th>
              <Th className="text-right pr-4">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {mentoresPaginados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhum mentor encontrado
                </td>
              </tr>
            ) : (
              mentoresPaginados.map((dados) => {
                const mentorAny = dados.mentor as any;
                const estado = mentorAny.estado || mentorAny.uf;
                const cidade = mentorAny.cidade;
                const competencias = Array.isArray(mentorAny.competencias) 
                  ? mentorAny.competencias 
                  : dados.mentor.area ? [dados.mentor.area] : [];

                return (
                  <tr 
                    key={dados.mentor.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <Td>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-900" />
                        <div>
                          <div className="font-medium text-gray-900">{dados.mentor.nome}</div>
                          <div className="text-xs text-gray-500">{dados.mentor.email || "—"}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="text-sm text-gray-700">
                        {cidade && estado ? `${cidade} - ${estado}` : estado || cidade || "—"}
                      </div>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        {competencias.length > 0 ? (
                          competencias.slice(0, 2).map((comp: string, idx: number) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {comp}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                        {competencias.length > 2 && (
                          <span className="text-xs text-gray-500">+{competencias.length - 2}</span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <span className={`text-xs px-2 py-1 rounded-full inline-block ${
                        dados.mentor.ativo 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {dados.mentor.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => setDetalhesId(dados.mentor.id)}
                          variant="outline"
                          className="h-8 px-3 text-xs flex items-center gap-1 whitespace-nowrap"
                        >
                          <Eye className="w-3 h-3" />
                          Detalhes
                        </Button>
                        <Button
                          onClick={() => setEditId(dados.mentor.id)}
                          className="h-8 px-3 text-xs flex items-center gap-1 whitespace-nowrap bg-blue-900 text-white hover:bg-blue-800"
                        >
                          <Edit className="w-3 h-3" />
                          Editar
                        </Button>
                      </div>
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
            Mostrando {indiceInicio + 1} a {Math.min(indiceFim, totalMentores)} de {totalMentores} mentores
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

      {/* Modal de Edição */}
      {editId && <MentorEditor mentorId={editId} onClose={() => setEditId(null)} />}

      {/* Modal de Detalhes */}
      {detalhesId && <MentorDetalhesModal mentorId={detalhesId} onClose={() => setDetalhesId(null)} />}

      {/* Modal de Filtros Avançados */}
      {mostrarModalFiltros && (
        <ModalFiltrosAvancados
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          estadoFilter={estadoFilter}
          setEstadoFilter={setEstadoFilter}
          competenciaFilter={competenciaFilter}
          setCompetenciaFilter={setCompetenciaFilter}
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
          competenciasDisponiveis={competenciasDisponiveis}
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
  estadoFilter,
  setEstadoFilter,
  competenciaFilter,
  setCompetenciaFilter,
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
  competenciasDisponiveis,
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
  estadoFilter: string;
  setEstadoFilter: (v: string) => void;
  competenciaFilter: string;
  setCompetenciaFilter: (v: string) => void;
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
  competenciasDisponiveis: string[];
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
          {/* Seção: Projeto */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
              <KanbanSquare className="w-4 h-4" />
              Projeto
            </h3>
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
          </div>

          {/* Seção: Localização */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Localização</h3>
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
          </div>

          {/* Seção: Competências */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Competências</h3>
            <div>
              <label className="block text-xs text-gray-600 mb-1 font-medium">Competência</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                value={competenciaFilter}
                onChange={(e) => setCompetenciaFilter(e.target.value)}
              >
                <option value="todos">Todas competências</option>
                {competenciasDisponiveis.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Seção: Dados Demográficos */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Dados Demográficos</h3>
            <div className="grid grid-cols-2 gap-4">
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

/**
 * Modal de Detalhes do Mentor
 * 
 * Campos adicionais suportados (além dos campos base do tipo Mentor):
 * 
 * DADOS PESSOAIS:
 * - genero/gender: string (ex: "Homem", "Mulher", "Outro", "Prefiro não informar")
 * - cpf: string (ex: "564.887.458-84")
 * - ddd: string (ex: "11")
 * 
 * LOCALIZAÇÃO:
 * - cidade: string (ex: "São Paulo")
 * - estado/uf: string (ex: "SP")
 * - cep: string (ex: "08431-150")
 * 
 * COMPETÊNCIAS E CONHECIMENTO:
 * - competencias: string[] (ex: ["Marketing/Vendas", "Finanças", "Ofertas de Crédito"])
 * - areasConhecimento: string[] (ex: ["Marketing Digital", "Gestão Financeira", "Vendas"])
 * 
 * INFORMAÇÕES PROFISSIONAIS:
 * - motivacao/motivacaoMentor: string (ex: "Compartilhar Conhecimento e Experiências")
 * - experiencia/experienciaProfissional: string (descrição longa)
 * - bio: string (biografia)
 * 
 * Exemplo de objeto mentor completo:
 * {
 *   id: "1",
 *   nome: "Gabriel Silva",
 *   email: "gabriel@aliancaempreendedora.org.br",
 *   telefone: "94084277",
 *   ddd: "11",
 *   area: "Marketing", // campo base
 *   ativo: true,
 *   genero: "Homem",
 *   cpf: "564.887.458-84",
 *   cidade: "São Paulo",
 *   estado: "SP",
 *   cep: "08431-150",
 *   competencias: ["Marketing/Vendas", "Finanças", "Bem-estar"],
 *   areasConhecimento: ["Marketing Digital", "Gestão Financeira", "Liderança"],
 *   motivacao: "Compartilhar Conhecimento e Experiências",
 *   experiencia: "10 anos de experiência em marketing digital...",
 *   bio: "Especialista em marketing digital..."
 * }
 */
function MentorDetalhesModal({ mentorId, onClose }: { mentorId: string; onClose: () => void }) {
  const { state } = useCrm();
  const mentor = state.mentores.find((x) => x.id === mentorId);

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

  if (!mentor) return null;

  const mentorAny = mentor as any;
  const estado = mentorAny.estado || mentorAny.uf;
  const cidade = mentorAny.cidade;
  
  // Competências - se não tiver, usa exemplos baseados na área
  let competencias = Array.isArray(mentorAny.competencias) 
    ? mentorAny.competencias 
    : mentor.area ? [mentor.area] : [];
  
  // MOCK: Se não tiver competências, adiciona exemplos
  if (competencias.length === 0) {
    competencias = ["Marketing/Vendas", "Finanças", "Comportamento Empreendedor"];
  }

  // Dados pessoais - MOCK se não existir
  const genero = mentorAny.genero || mentorAny.gender || "Homem";
  const cpf = mentorAny.cpf || "***.***.***-**";
  const ddd = mentorAny.ddd || mentor.telefone?.substring(0, 2) || "11";
  const cep = mentorAny.cep || (estado ? `${estado}000-000` : "00000-000");
  
  // Informações profissionais - MOCK se não existir
  const motivacao = mentorAny.motivacao || mentorAny.motivacaoMentor || "Compartilhar Conhecimento e Experiências";
  const experiencia = mentorAny.experiencia || mentorAny.experienciaProfissional || 
    "Experiência profissional em " + (mentor.area || "diversas áreas") + ". Atuando como mentor para compartilhar conhecimentos.";
  
  // Áreas de conhecimento - MOCK se não existir
  let areasConhecimento = Array.isArray(mentorAny.areasConhecimento) 
    ? mentorAny.areasConhecimento 
    : [];
  
  if (areasConhecimento.length === 0) {
    areasConhecimento = [
      mentor.area || "Gestão de Negócios",
      "Empreendedorismo",
      "Desenvolvimento de Pessoas"
    ];
  }

  // Calcula estatísticas
  const mentorias = state.mentorias.filter(m => m.mentorId === mentor.id);
  const totalMentorias = mentorias.length;
  const mentoriasAtivas = mentorias.filter(m => m.status === "ativa").length;
  const mentoriasConcluidas = mentorias.filter(m => m.status === "concluida").length;
  const mentoriasPausadas = mentorias.filter(m => m.status === "pausada").length;
  const mentoriasCanceladas = mentorias.filter(m => m.status === "cancelada").length;
  const totalEncontros = mentorias.reduce((acc, m) => {
    return acc + state.relatos.filter(r => r.mentoriaId === m.id).length;
  }, 0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-[10000] bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-900 border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-yellow-400">{mentor.nome}</h2>
              <div className="text-sm text-white">{mentor.email || "—"}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-700 text-2xl leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Estatísticas em Destaque */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Estatísticas de Mentorias</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-900">{totalMentorias}</div>
                <div className="text-xs text-gray-600 font-medium mt-1">Total</div>
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
            <div className="grid grid-cols-3 gap-4">
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
                <div className="text-xs text-gray-600 mt-0.5">Encontros</div>
              </div>
            </div>
          </div>

          {/* Grid de Informações */}
          <div className="grid grid-cols-2 gap-6">
            {/* Coluna 1 */}
            <div className="space-y-4">
              {/* Dados Pessoais */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Dados Pessoais</h3>
                <div className="space-y-1 text-sm bg-gray-50 rounded-lg p-3">
                  {genero && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gênero:</span>
                      <span className="font-medium">{genero}</span>
                    </div>
                  )}
                  {mentorAny.raca && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Raça/Cor:</span>
                      <span className="font-medium">{mentorAny.raca}</span>
                    </div>
                  )}
                  {mentorAny.nacionalidade && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nacionalidade:</span>
                      <span className="font-medium">{mentorAny.nacionalidade}</span>
                    </div>
                  )}
                  {mentorAny.escolaridade && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Escolaridade:</span>
                      <span className="font-medium">{mentorAny.escolaridade}</span>
                    </div>
                  )}
                  {cpf && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">CPF:</span>
                      <span className="font-medium">{cpf}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contato */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Contato</h3>
                <div className="space-y-1 text-sm">
                  {mentor.email && <div className="flex items-center gap-2"><span><Mail className="w-4 h-4" /></span><span>{mentor.email}</span></div>}
                  {(ddd || mentor.telefone) && (
                    <div className="flex items-center gap-2">
                      <span><Phone className="w-4 h-4" /></span>
                      <span>{ddd ? `(${ddd}) ` : ''}{mentor.telefone}</span>
                    </div>
                  )}
                  {!mentor.email && !mentor.telefone && <span className="text-gray-400">Sem informações de contato</span>}
                </div>
              </div>

              {/* Localização */}
              {(cidade || estado || cep) && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Localização</h3>
                  <div className="space-y-1 text-sm">
                    {estado && <div><span className="text-gray-600">Estado:</span> <span className="font-medium">{estado}</span></div>}
                    {cep && <div><span className="text-gray-600">CEP:</span> <span className="font-medium">{cep}</span></div>}
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Status</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  mentor.ativo 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {mentor.ativo ? ' Ativo' : '○ Inativo'}
                </span>
              </div>
            </div>

            {/* Coluna 2 */}
            <div className="space-y-4">
              {/* Áreas de Interesse/Competências */}
              {competencias.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Áreas de Interesse</h3>
                  <div className="flex flex-wrap gap-2">
                    {competencias.map((comp: string, idx: number) => (
                      <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Principais Áreas de Conhecimento */}
              {areasConhecimento.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Principais Áreas de Conhecimento</h3>
                  <div className="space-y-2">
                    {areasConhecimento.map((area: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600 font-bold">{idx + 1}.</span>
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {mentor.bio && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Bio</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{mentor.bio}</p>
                </div>
              )}

              {/* Motivação para ser Mentor */}
              {motivacao && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Motivação para ser Mentor</h3>
                  <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700 leading-relaxed">{motivacao}</p>
                  </div>
                </div>
              )}

              {/* Experiência Profissional */}
              {experiencia && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Experiência Profissional</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{experiencia}</p>
                </div>
              )}
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
  return <th className={`text-left font-semibold px-3 py-2 text-sm ${className}`}>{children}</th>;
}

function Td({ children, className = "", colSpan }: React.PropsWithChildren<{ className?: string; colSpan?: number }>) {
  return <td className={`px-3 py-2 align-middle ${className}`} colSpan={colSpan}>{children}</td>;
}
