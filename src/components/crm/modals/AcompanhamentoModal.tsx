import React from "react";
import { useCrm } from "../../../store/CrmContext";
import { Button } from "../../../components/ui/button";
import { Calendar, FileText, User, MessageSquare, UserCheck } from "lucide-react";
import { StatusAcompanhamento } from "../../../types/crm";

// Lista de funcionários para seleção
const FUNCIONARIOS = [
  "Leonardo",
  "Suellen", 
  "Jheni",
];

interface AcompanhamentoModalProps {
  mentoriaId: string;
  onClose: () => void;
}

const STATUS_MAP: Record<string, string> = {
  nova: 'Nova',
  ativa: 'Ativa',
  pausada: 'Pausada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  expirada: 'Expirada',
};

const STATUS_ACOMPANHAMENTO_MAP: Record<StatusAcompanhamento, string> = {
  mentoria_ocorrendo: 'Mentoria Ocorrendo',
  mentoria_nao_iniciada: 'Mentoria Não iniciada',
  mentoria_parada: 'Mentoria parada',
  aguardando_retorno_empreendedor: 'Aguardando retorno do Empreendedor',
  aguardando_retorno_mentor: 'Aguardando retorno do Mentor',
  mentor_empreendedor_nao_responde: 'Mentor/Empreendedor não Responde',
  mentoria_finalizada: 'Mentoria Finalizada',
  mentoria_cancelada: 'Mentoria Cancelada',
  empreendedor_desistiu: 'Empreendedor Desistiu',
  mentoria_atrasada: 'Mentoria Atrasada',
};

export function AcompanhamentoModal({ mentoriaId, onClose }: AcompanhamentoModalProps) {
  const { state, dispatch } = useCrm();
  
  const mentoria = state.mentorias.find(m => m.id === mentoriaId);
  const mentor = mentoria?.mentorId ? state.mentores.find(m => m.id === mentoria.mentorId) : null;
  const projeto = state.projetos.find(p => p.id === mentoria?.projetoId);

  // Conta encontros da plataforma (relatos)
  const numEncontrosPlataforma = React.useMemo(() => {
    return state.relatos.filter(r => r.mentoriaId === mentoriaId).length;
  }, [state.relatos, mentoriaId]);

  // Estados locais para os campos editáveis
  const [statusAcompanhamento, setStatusAcompanhamento] = React.useState<StatusAcompanhamento | "">(
    mentoria?.statusAcompanhamento ?? ""
  );
  const [numEncontrosAcompanhamento, setNumEncontrosAcompanhamento] = React.useState<number>(
    mentoria?.numEncontrosAcompanhamento ?? numEncontrosPlataforma
  );
  const [observacaoEmpreendedor, setObservacaoEmpreendedor] = React.useState<string>(
    mentoria?.observacaoEmpreendedor ?? ""
  );
  const [observacaoMentor, setObservacaoMentor] = React.useState<string>(
    mentoria?.observacaoMentor ?? ""
  );
  const [previsaoProximoEncontro, setPrevisaoProximoEncontro] = React.useState<string>(
    mentoria?.proximoEncontroDataISO ? mentoria.proximoEncontroDataISO.split('T')[0] : ""
  );
  const [motivoFinalizacao, setMotivoFinalizacao] = React.useState<string>(
    mentoria?.motivoCancelamento ?? ""
  );
  const [registradoPor, setRegistradoPor] = React.useState<string>("");

  // Sincroniza quando a mentoria muda
  React.useEffect(() => {
    if (mentoria) {
      setStatusAcompanhamento(mentoria.statusAcompanhamento ?? "");
      setNumEncontrosAcompanhamento(mentoria.numEncontrosAcompanhamento ?? numEncontrosPlataforma);
      setObservacaoEmpreendedor(mentoria.observacaoEmpreendedor ?? "");
      setObservacaoMentor(mentoria.observacaoMentor ?? "");
      setPrevisaoProximoEncontro(mentoria.proximoEncontroDataISO ? mentoria.proximoEncontroDataISO.split('T')[0] : "");
      setMotivoFinalizacao(mentoria.motivoCancelamento ?? "");
    }
  }, [mentoria, numEncontrosPlataforma]);

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

  const handleSalvar = () => {
    if (!mentoria) return;
    
    // Valida se informou quem está registrando
    if (!registradoPor) {
      alert("Por favor, selecione quem está registrando o acompanhamento.");
      return;
    }

    // Atualiza o acompanhamento
    dispatch({
      type: "ATUALIZAR_ACOMPANHAMENTO",
      payload: {
        mentoriaId: mentoria.id,
        registradoPor,
        acompanhamento: {
          statusAcompanhamento: statusAcompanhamento || undefined,
          numEncontrosAcompanhamento,
          observacaoEmpreendedor,
          observacaoMentor,
          motivoCancelamento: motivoFinalizacao || undefined,
        },
      },
    });

    // Atualiza a previsão do próximo encontro se fornecida
    if (previsaoProximoEncontro) {
      dispatch({
        type: "ATUALIZAR_PROXIMO_ENCONTRO",
        payload: {
          mentoriaId: mentoria.id,
          dataISO: previsaoProximoEncontro,
        },
      });
    }

    onClose();
  };

  if (!mentoria) return null;

  const dataUltimaAtualizacao = mentoria.ultimaAtualizacaoISO
    ? new Date(mentoria.ultimaAtualizacaoISO).toLocaleDateString('pt-BR')
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] mx-4 overflow-hidden flex flex-col">
        
        {/* Header do Modal */}
        <div className="flex justify-between items-start p-6 border-b bg-blue-900 text-white">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1 text-yellow-400">Acompanhamento</h2>
            <p className="text-sm text-blue-100">
              {mentoria.empreendedor} • {projeto?.nome || "—"} • {mentor?.nome || "Sem mentor"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 text-2xl leading-none ml-4"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

       
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Campo obrigatório: Quem está registrando
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <label className="text-sm font-bold text-yellow-800 flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4" />
              Quem está registrando? *
            </label>
            <select
              value={registradoPor}
              onChange={(e) => setRegistradoPor(e.target.value)}
              className={`w-full text-sm border rounded-md px-3 py-2 bg-white ${!registradoPor ? 'border-yellow-400' : 'border-green-400'}`}
              required
            >
              <option value="">Selecione seu nome...</option>
              {FUNCIONARIOS.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </select>
            {mentoria.ultimoRegistroPor && (
              <p className="text-xs text-gray-500 mt-2">
                Último registro por <strong>{mentoria.ultimoRegistroPor}</strong>
                {mentoria.ultimoRegistroDataISO && ` em ${new Date(mentoria.ultimoRegistroDataISO).toLocaleDateString('pt-BR')}`}
              </p>
            )}
          </div> */}

          {/* Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome do(a) Empreendedor(a)
              </label>
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                {mentoria.empreendedor}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data do último acompanhamento/atualização
              </label>
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                {dataUltimaAtualizacao}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Número de Encontros Realizados (Registro da Plataforma)
              </label>
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                {numEncontrosPlataforma}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Número de Encontros Realizados (Registro de Acompanhamento)
              </label>
              <input
                type="number"
                min="0"
                value={numEncontrosAcompanhamento}
                onChange={(e) => setNumEncontrosAcompanhamento(parseInt(e.target.value) || 0)}
                className="w-full text-sm border rounded-md px-3 py-2 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Status de Acompanhamento
              </label>
              <select
                value={statusAcompanhamento}
                onChange={(e) => setStatusAcompanhamento(e.target.value as StatusAcompanhamento | "")}
                className="w-full text-sm border rounded-md px-3 py-2 bg-white"
              >
                <option value="">Selecione um status</option>
                {Object.entries(STATUS_ACOMPANHAMENTO_MAP).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              {mentoria.statusAcompanhamentoPor && (
                <p className="text-xs text-blue-500 mt-1">
                  Alterado por <strong>{mentoria.statusAcompanhamentoPor}</strong>
                  {mentoria.statusAcompanhamentoDataISO && ` em ${new Date(mentoria.statusAcompanhamentoDataISO).toLocaleDateString('pt-BR')}`}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Previsão do Próximo encontro
              </label>
              <input
                type="date"
                value={previsaoProximoEncontro}
                onChange={(e) => setPrevisaoProximoEncontro(e.target.value)}
                className="w-full text-sm border rounded-md px-3 py-2 bg-white"
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Observação/Histórico Empreendedor
                </label>
                {mentoria.observacaoEmpreendedorPor && (
                  <span className="text-xs text-purple-500">
                    Alterado por <strong>{mentoria.observacaoEmpreendedorPor}</strong>
                    {mentoria.observacaoEmpreendedorDataISO && ` em ${new Date(mentoria.observacaoEmpreendedorDataISO).toLocaleDateString('pt-BR')}`}
                  </span>
                )}
              </div>
              <textarea
                value={observacaoEmpreendedor}
                onChange={(e) => setObservacaoEmpreendedor(e.target.value)}
                rows={4}
                placeholder="Digite as observações sobre o empreendedor..."
                className="w-full text-sm border rounded-md px-3 py-2 bg-white resize-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Observação/Histórico Mentor
                </label>
                {mentoria.observacaoMentorPor && (
                  <span className="text-xs text-green-600">
                    Alterado por <strong>{mentoria.observacaoMentorPor}</strong>
                    {mentoria.observacaoMentorDataISO && ` em ${new Date(mentoria.observacaoMentorDataISO).toLocaleDateString('pt-BR')}`}
                  </span>
                )}
              </div>
              <textarea
                value={observacaoMentor}
                onChange={(e) => setObservacaoMentor(e.target.value)}
                rows={4}
                placeholder="Digite as observações sobre o mentor..."
                className="w-full text-sm border rounded-md px-3 py-2 bg-white resize-none"
              />
            </div>
          </div>

          {/* Motivo da Finalização */}
          {(mentoria.status === "concluida" || mentoria.status === "cancelada") && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Motivo da Finalização
              </label>
              <input
                type="text"
                value={motivoFinalizacao}
                onChange={(e) => setMotivoFinalizacao(e.target.value)}
                placeholder="Digite o motivo da finalização..."
                className="w-full text-sm border rounded-md px-3 py-2 bg-white"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
          onClick={handleSalvar}
          className="bg-blue-900 text-white hover:bg-blue-800"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}

