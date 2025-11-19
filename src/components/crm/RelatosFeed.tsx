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

  const [projetoSelecionado, setProjetoSelecionado] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [buscaVinculados, setBuscaVinculados] = useState('');
  const [buscaDisponiveis, setBuscaDisponiveis] = useState('');

  // helpers para dispatch genérico (se o reducer suportar)
  const dispatchAny = dispatch as unknown as (action: any) => void;

  // Vinculados / Disponíveis para o projeto selecionado
  const { vinculados, disponiveis } = useMemo(() => {
    if (!projetoSelecionado) return { vinculados: [], disponiveis: [] };

    const vinc = mentoresLocal
      .filter(m => Array.isArray(m.projetosIds) && m.projetosIds.includes(projetoSelecionado.id))
      .filter(m => m.nome.toLowerCase().includes(buscaVinculados.toLowerCase()));

    const disp = mentoresLocal
      .filter(m => m.ativo && (!Array.isArray(m.projetosIds) || !m.projetosIds.includes(projetoSelecionado.id)))
      .filter(m => m.nome.toLowerCase().includes(buscaDisponiveis.toLowerCase()));

    return { vinculados: vinc, disponiveis: disp };
  }, [mentoresLocal, projetoSelecionado, buscaVinculados, buscaDisponiveis]);

  const abrirModal = (projeto: any) => {
    setProjetoSelecionado(projeto);
    setShowModal(true);
    setBuscaVinculados('');
    setBuscaDisponiveis('');
  };

  const fecharModal = () => {
    setShowModal(false);
    setProjetoSelecionado(null);
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

  // atribui primeiro mentor ativo disponível ao projeto
  const selecionarTodos = () => {
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
  const desmarcarTodos = () => {
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

  // relatos ligados ao projeto (opcional) — aqui uso relatos que referenciam mentorias; deixei como exemplo vazio
  const relatosDoProjeto = useMemo(() => {
    if (!projetoSelecionado) return [];
    return relatos.filter(r => r.projetoId === projetoSelecionado.id).sort((a,b) => (a.dataISO < b.dataISO ? 1 : -1));
  }, [relatos, projetoSelecionado]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Mentores por Projeto</h1>

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projetos.map((projeto) => {
            const qtdMentores = mentoresLocal.filter(m => Array.isArray(m.projetosIds) && m.projetosIds.includes(projeto.id)).length;

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
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {qtdMentores} {qtdMentores === 1 ? 'mentor' : 'mentores'}
                  </span>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={fecharModal}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Vincular Mentores ao Projeto</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {projetoSelecionado.nome}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Mentores vinculados: {vinculados.length}
                  </p>
                </div>
                <button
                  onClick={fecharModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Ações em massa */}
              <div className="px-6 py-3 bg-gray-50 border-b flex items-center gap-3">
                <button
                  onClick={selecionarTodos}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Atribuir todos os mentores disponíveis a este projeto
                </button>
                <button
                  onClick={desmarcarTodos}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                >
                  Remover todos os mentores deste projeto
                </button>
              </div>

              {/* Colunas */}
              <div className="flex-1 overflow-hidden grid grid-cols-2 divide-x">
                {/* Coluna Esquerda - Mentores Vinculados */}
                <div className="flex flex-col">
                  <div className="px-6 py-3 bg-green-50 border-b">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Mentores Vinculados ({vinculados.length})
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar..."
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

                {/* Coluna Direita - Mentores Disponíveis */}
                <div className="flex flex-col">
                  <div className="px-6 py-3 bg-gray-50 border-b">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Mentores Disponíveis ({disponiveis.length})
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar..."
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