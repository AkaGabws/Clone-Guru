import React, { useState, useMemo, useEffect } from 'react';
import { useCrm } from '../../store/CrmContext';
import { User, Search, X, CheckSquare, Square } from 'lucide-react';

function VinculacaoMentores() {
  // usa dados do store / mocks
  const { state, dispatch } = useCrm();
  const projetos = state.projetos ?? [];
  const relatos = state.relatos ?? [];

  // mantenho uma cópia local dos mentores para atualizações imediatas na UI
  const [mentoresLocal, setMentoresLocal] = useState<any[]>(state.mentores ?? []);
  useEffect(() => setMentoresLocal(state.mentores ?? []), [state.mentores]);

  useEffect(() => {
    setProjetosStatus((prev) => {
      let changed = false;
      const next = { ...prev };
      projetos.forEach((p) => {
        if (!next[p.id]) {
          next[p.id] = 'ativo';
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [projetos]);

  const [projetoSelecionado, setProjetoSelecionado] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [abaModal, setAbaModal] = useState<'mentores' | 'empreendedores'>('mentores');
  const [buscaVinculados, setBuscaVinculados] = useState('');
  const [buscaDisponiveis, setBuscaDisponiveis] = useState('');
  const [buscaProjetos, setBuscaProjetos] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [projetosStatus, setProjetosStatus] = useState<Record<string, 'ativo' | 'inativo'>>({});

  // helpers para dispatch genérico (se o reducer suportar)
  const dispatchAny = dispatch as unknown as (action: any) => void;

  // Vinculados / Disponíveis para o projeto selecionado
  const { vinculados, disponiveis } = useMemo(() => {
    if (!projetoSelecionado) return { vinculados: [], disponiveis: [] };

    if (abaModal === 'mentores') {
      const vinc = mentoresLocal
        .filter(m => Array.isArray(m.projetosIds) && m.projetosIds.includes(projetoSelecionado.id))
        .filter(m => m.nome.toLowerCase().includes(buscaVinculados.toLowerCase()));

      const disp = mentoresLocal
        .filter(m => m.ativo && (!Array.isArray(m.projetosIds) || !m.projetosIds.includes(projetoSelecionado.id)))
        .filter(m => m.nome.toLowerCase().includes(buscaDisponiveis.toLowerCase()));

      return { vinculados: vinc, disponiveis: disp };
    } else {
      // Aba de empreendedores - mentorias
      const mentoriasVinculadas = state.mentorias
        .filter(m => m.projetoId === projetoSelecionado.id)
        .filter(m => m.empreendedor.toLowerCase().includes(buscaVinculados.toLowerCase()));

      const mentoriasDisponiveis = state.mentorias
        .filter(m => m.projetoId !== projetoSelecionado.id)
        .filter(m => m.empreendedor.toLowerCase().includes(buscaDisponiveis.toLowerCase()));

      return { vinculados: mentoriasVinculadas, disponiveis: mentoriasDisponiveis };
    }
  }, [mentoresLocal, state.mentorias, projetoSelecionado, buscaVinculados, buscaDisponiveis, abaModal]);

  const abrirModal = (projeto: any) => {
    setProjetoSelecionado(projeto);
    setShowModal(true);
    setAbaModal('mentores');
    setBuscaVinculados('');
    setBuscaDisponiveis('');
  };

  const fecharModal = () => {
    setShowModal(false);
    setProjetoSelecionado(null);
    setAbaModal('mentores');
  };

  // alterna vínculo mentor <-> projeto
  const toggleMentor = (mentorId: string) => {
    if (!projetoSelecionado) return;
    setMentoresLocal(prev => {
      return prev.map(m => {
        if (m.id !== mentorId) return m;
        const has = Array.isArray(m.projetosIds) && m.projetosIds.includes(projetoSelecionado.id);
        const projetosIds = has
          ? m.projetosIds.filter((pid: string) => pid !== projetoSelecionado.id)
          : [...(m.projetosIds ?? []), projetoSelecionado.id];
        // despacha ação genérica (implemente no reducer se desejar)
        dispatchAny({ type: "TOGGLE_MENTOR_PROJETO", payload: { mentorId: m.id, projetoId: projetoSelecionado.id } });
        return { ...m, projetosIds };
      });
    });
  };

  // Move mentoria para o projeto selecionado
  const toggleMentoria = (mentoriaId: string) => {
    if (!projetoSelecionado) return;
    
    // Atualiza o projetoId da mentoria
    const mentoria = state.mentorias.find(m => m.id === mentoriaId);
    if (!mentoria) return;
    
    dispatchAny({ 
      type: "ATUALIZAR_MENTORIA", 
      payload: { 
        mentoriaId: mentoriaId,
        dados: { 
          projetoId: projetoSelecionado.id
        } 
      } 
    });
  };

  // atribui primeiro mentor ativo disponível ao projeto
  const selecionarTodosMentores = () => {
    if (!projetoSelecionado) return;
    const projetoId = projetoSelecionado.id;

    setMentoresLocal(prev => {
      // monta novo array atualizando apenas mentores que precisam receber o projeto
      const atualizado = prev.map(m => {
        if (!m.ativo) return m;
        const has = Array.isArray(m.projetosIds) && m.projetosIds.includes(projetoId);
        if (has) return m;
        const projetosIds = [...(m.projetosIds ?? []), projetoId];
        // despacha ação por mentor (o reducer pode tratar TOGGLE_MENTOR_PROJETO ou outro tipo)
        dispatchAny({ type: "TOGGLE_MENTOR_PROJETO", payload: { mentorId: m.id, projetoId } });
        return { ...m, projetosIds };
      });
      return atualizado;
    });
  };

  // remove vínculo do projeto de todos os mentores
  const desmarcarTodosMentores = () => {
    if (!projetoSelecionado) return;
    setMentoresLocal(prev => {
      prev.forEach(m => {
        if (Array.isArray(m.projetosIds) && m.projetosIds.includes(projetoSelecionado.id)) {
          dispatchAny({ type: "REMOVE_MENTOR_PROJETO", payload: { mentorId: m.id, projetoId: projetoSelecionado.id } });
        }
      });
      return prev.map(m => {
        if (!Array.isArray(m.projetosIds)) return m;
        return { ...m, projetosIds: m.projetosIds.filter((pid: string) => pid !== projetoSelecionado.id) };
      });
    });
  };

  // Atribui todas as mentorias disponíveis ao projeto
  const selecionarTodasMentorias = () => {
    if (!projetoSelecionado || abaModal !== 'empreendedores') return;
    const mentoriasDisponiveis = state.mentorias.filter(m => m.projetoId !== projetoSelecionado.id);
    mentoriasDisponiveis.forEach(mentoria => {
      dispatchAny({ 
        type: "ATUALIZAR_MENTORIA", 
        payload: { 
          mentoriaId: mentoria.id,
          dados: { 
            projetoId: projetoSelecionado.id
          } 
        } 
      });
    });
  };

  // Remove todas as mentorias do projeto (não implementado por segurança)
  const desmarcarTodasMentorias = () => {
    // Função desabilitada por segurança - não permite remover todas as mentorias
    // O usuário deve editar individualmente se necessário
  };

  const toggleStatusProjeto = (projetoId: string) => {
    setProjetosStatus((prev) => {
      const atual = prev[projetoId] ?? 'ativo';
      return { ...prev, [projetoId]: atual === 'ativo' ? 'inativo' : 'ativo' };
    });
  };

  // relatos ligados ao projeto (opcional) — aqui uso relatos que referenciam mentorias; deixei como exemplo vazio
  const relatosDoProjeto = useMemo(() => {
    if (!projetoSelecionado) return [];
    return relatos.filter(r => r.projetoId === projetoSelecionado.id).sort((a,b) => (a.dataISO < b.dataISO ? 1 : -1));
  }, [relatos, projetoSelecionado]);

  const projetosFiltrados = useMemo(() => {
    const busca = buscaProjetos.toLowerCase();
    return projetos
      .filter((p) => (projectFilter === 'todos' ? true : p.id === projectFilter))
      .filter((p) => (statusFilter === 'todos' ? true : (projetosStatus[p.id] ?? 'ativo') === statusFilter))
      .filter((p) => p.nome.toLowerCase().includes(busca));
  }, [projetos, projectFilter, statusFilter, buscaProjetos, projetosStatus]);

  const statusProjetoSelecionado = projetoSelecionado ? (projetosStatus[projetoSelecionado.id] ?? 'ativo') : 'ativo';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Mentores por Projeto</h1>

        {/* Filtros */}
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar projeto..."
            className="border rounded-md px-3 py-2 text-sm w-full md:max-w-sm"
            value={buscaProjetos}
            onChange={(e) => setBuscaProjetos(e.target.value)}
          />
          <select
            className="border rounded-md h-10 px-2 text-sm bg-white"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="todos">Todos os projetos</option>
            {projetos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
          <select
            className="border rounded-md h-10 px-2 text-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'todos' | 'ativo' | 'inativo')}
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projetosFiltrados.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-sm py-12">
              Nenhum projeto corresponde aos filtros selecionados.
            </div>
          )}
          {projetosFiltrados.map((projeto) => {
            const qtdMentores = mentoresLocal.filter(m => Array.isArray(m.projetosIds) && m.projetosIds.includes(projeto.id)).length;
            const statusAtual = projetosStatus[projeto.id] ?? 'ativo';

            return (
              <div
                key={projeto.id}
                onClick={() => abrirModal(projeto)}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{projeto.nome}</h3>
                    <p className="text-sm text-gray-600 mt-1">Projeto ID: {projeto.id}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusAtual === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {statusAtual === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {qtdMentores} {qtdMentores === 1 ? 'mentor' : 'mentores'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>Gerenciar mentores vinculados</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal de Vinculação por Projeto */}
        {showModal && projetoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 " onClick={fecharModal}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col  " onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="px-6 py-4 border-b bg-blue-900 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-yellow-400">Gerenciar Projeto</h2>
                    <p className="text-sm text-white mt-1">
                      {projetoSelecionado.nome}
                    </p>
                  </div>
                  <button
                    onClick={fecharModal}
                    className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                {/* Abas */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setAbaModal('mentores')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                      abaModal === 'mentores'
                        ? 'bg-white text-blue-900'
                        : 'bg-blue-800 text-white hover:bg-blue-700'
                    }`}
                  >
                    Mentores ({abaModal === 'mentores' ? vinculados.length : state.mentores.filter(m => Array.isArray(m.projetosIds) && m.projetosIds.includes(projetoSelecionado.id)).length})
                  </button>
                  <button
                    onClick={() => setAbaModal('empreendedores')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                      abaModal === 'empreendedores'
                        ? 'bg-white text-blue-900'
                        : 'bg-blue-800 text-white hover:bg-blue-700'
                    }`}
                  >
                    Empreendedores ({abaModal === 'empreendedores' ? vinculados.length : state.mentorias.filter(m => m.projetoId === projetoSelecionado.id).length})
                  </button>
                </div>
              </div>

              <div className="px-6 py-3 border-b bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-sm">
                  <span className="text-gray-700 font-medium">Status: </span>
                  <span className={statusProjetoSelecionado === 'ativo' ? 'text-green-800 font-semibold' : 'text-gray-600 font-semibold'}>
                    {statusProjetoSelecionado === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <button
                  onClick={() => toggleStatusProjeto(projetoSelecionado.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${statusProjetoSelecionado === 'ativo' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  {statusProjetoSelecionado === 'ativo' ? 'Desativar projeto' : 'Reativar projeto'}
                </button>
              </div>

              {/* Ações em massa */}
              <div className="px-6 py-3 bg-gray-50 border-b flex items-center gap-3 flex-wrap">
                {abaModal === 'mentores' ? (
                  <>
                    <button
                      onClick={selecionarTodosMentores}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Atribuir todos os mentores disponíveis
                    </button>
                    <button
                      onClick={desmarcarTodosMentores}
                      className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Remover todos os mentores
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={selecionarTodasMentorias}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Mover todas disponíveis para este projeto
                    </button>
                    <button
                      onClick={desmarcarTodasMentorias}
                      disabled
                      className="px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-md cursor-not-allowed opacity-50"
                      title="Remover mentorias do projeto não é permitido - edite individualmente"
                    >
                      Remover todas (indisponível)
                    </button>
                  </>
                )}
              </div>

              {/* Colunas */}
              <div className="flex-1 overflow-hidden grid grid-cols-2 divide-x">
                {abaModal === 'mentores' ? (
                  <>
                    {/* Coluna Esquerda - Mentores Disponíveis */}
                    <div className="flex flex-col">
                      <div className="px-6 py-3 bg-gray-50 border-b">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Mentores Disponíveis ({disponiveis.length})
                        </h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar mentor..."
                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={buscaDisponiveis}
                            onChange={(e) => setBuscaDisponiveis(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
                        {disponiveis.length === 0 ? (
                          <div className="text-center py-12 text-gray-500 text-sm">
                            Nenhum mentor disponível
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {disponiveis.map((mentor) => (
                              <div
                                key={mentor.id}
                                onClick={() => toggleMentor(mentor.id)}
                                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900">{mentor.nome}</div>
                                  <div className="text-xs text-gray-600">{mentor.area || ''}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coluna Direita - Mentores Vinculados */}
                    <div className="flex flex-col">
                      <div className="px-6 py-3 bg-green-50 border-b">
                        <h3 className="font-semibold text-green-900 mb-2">
                          Mentores Vinculados ({vinculados.length})
                        </h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar mentor..."
                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={buscaVinculados}
                            onChange={(e) => setBuscaVinculados(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
                        {vinculados.length === 0 ? (
                          <div className="text-center py-12 text-gray-500 text-sm">
                            Nenhum mentor vinculado
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {vinculados.map((mentor) => (
                              <div
                                key={mentor.id}
                                onClick={() => toggleMentor(mentor.id)}
                                className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 cursor-pointer transition-colors"
                              >
                                <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900">{mentor.nome}</div>
                                  <div className="text-xs text-gray-600">{mentor.area ||  ''}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Coluna Esquerda - Mentorias de Outros Projetos */}
                    <div className="flex flex-col">
                      <div className="px-6 py-3 bg-gray-50 border-b">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Empreendedores de Outros Projetos ({disponiveis.length})
                        </h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar empreendedor..."
                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={buscaDisponiveis}
                            onChange={(e) => setBuscaDisponiveis(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
                        {disponiveis.length === 0 ? (
                          <div className="text-center py-12 text-gray-500 text-sm">
                            Nenhuma mentoria disponível
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {disponiveis.map((mentoria: any) => {
                              const projetoOrigem = state.projetos.find(p => p.id === mentoria.projetoId);
                              const mentor = mentoria.mentorId ? state.mentores.find(m => m.id === mentoria.mentorId) : null;
                              return (
                                <div
                                  key={mentoria.id}
                                  onClick={() => toggleMentoria(mentoria.id)}
                                  className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                  <Square className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900">{mentoria.empreendedor}</div>
                                    <div className="text-xs text-gray-600">{mentoria.negocio || ''}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Projeto atual: {projetoOrigem?.nome || '—'}
                                      {mentor && ` • Mentor: ${mentor.nome}`}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coluna Direita - Mentorias Vinculadas */}
                    <div className="flex flex-col">
                      <div className="px-6 py-3 bg-green-50 border-b">
                        <h3 className="font-semibold text-green-900 mb-2">
                          Empreendedores Neste Projeto ({vinculados.length})
                        </h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Buscar empreendedor..."
                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={buscaVinculados}
                            onChange={(e) => setBuscaVinculados(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
                        {vinculados.length === 0 ? (
                          <div className="text-center py-12 text-gray-500 text-sm">
                            Nenhuma mentoria neste projeto
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {vinculados.map((mentoria: any) => {
                              const mentor = mentoria.mentorId ? state.mentores.find(m => m.id === mentoria.mentorId) : null;
                              const statusColors: Record<string, string> = {
                                nova: 'text-indigo-600',
                                ativa: 'text-emerald-600',
                                pausada: 'text-amber-600',
                                concluida: 'text-lime-600',
                                cancelada: 'text-rose-600',
                                expirada: 'text-slate-600'
                              };
                              return (
                                <div
                                  key={mentoria.id}
                                  className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg group hover:bg-green-100 transition-colors"
                                >
                                  <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900">{mentoria.empreendedor}</div>
                                    <div className="text-xs text-gray-600">{mentoria.negocio || ''}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-xs font-semibold ${statusColors[mentoria.status] || 'text-gray-500'}`}>
                                        {mentoria.status.toUpperCase()}
                                      </span>
                                      {mentor && (
                                        <span className="text-xs text-gray-500">
                                          • Mentor: {mentor.nome}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                <button
                  onClick={fecharModal}
                  className="px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-200 rounded-md transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VinculacaoMentores;
// Named export para compatibilidade com imports que esperam { RelatosFeed }
export const RelatosFeed = VinculacaoMentores;