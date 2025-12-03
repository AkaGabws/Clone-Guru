export type StatusMentoria =
  | "nova"
  | "ativa"
  | "pausada"
  | "concluida"
  | "cancelada"
  | "expirada";

export type StatusAcompanhamento =
  | "mentoria_ocorrendo"
  | "mentoria_nao_iniciada"
  | "mentoria_parada"
  | "aguardando_retorno_empreendedor"
  | "aguardando_retorno_mentor"
  | "mentor_empreendedor_nao_responde"
  | "mentoria_finalizada"
  | "mentoria_cancelada"
  | "empreendedor_desistiu"
  | "mentoria_atrasada";

export interface Projeto {
  id: string;
  nome: string; // ex.: "Negócio Raiz", "Mentoria Gratuita"
}

export interface Mentor {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  area?: string;          // ex.: Marketing, Finanças
  bio?: string;
  ativo: boolean;         // se o mentor está disponível/ativo
  fotoUrl?: string;
  projetosIds?: string[]; // projetos em que atua
}

export interface Relato {
  id: string;
  mentoriaId: string;
  mentorId?: string;
  dataISO: string;       // new Date().toISOString()
  dataEncontroISO?: string; // Data do encontro (quando ocorreu)
  duracaoMinutos?: number;  // Duração do encontro em minutos
  titulo?: string;
  texto: string;
}

export interface Mentoria {
  id: string;
  empreendedor: string;
  telefoneEmpreendedor?: string; // Telefone do empreendedor para contato
  negocio?: string;
  projetoId: string;
  status: StatusMentoria;
  mentorId?: string;
  desafio?: string;
  dataCriacaoISO: string;
  ultimaAtualizacaoISO: string;
  progresso?: number;    // 0-100 caso use
  proximoEncontroDataISO?: string; // Data do próximo encontro (YYYY-MM-DD)
  proximoEncontroHorario?: string; // Horário do próximo encontro (HH:mm)
  motivoCancelamento?: string; // Motivo do cancelamento (quando status é "cancelada")
  // Campos de acompanhamento interno
  numEncontrosPlataforma?: number; // Número de encontros registrados na plataforma
  numEncontrosAcompanhamento?: number; // Número de encontros no registro de acompanhamento
  observacaoEmpreendedor?: string; // Observação/Histórico do Empreendedor
  observacaoMentor?: string; // Observação/Histórico do Mentor
  statusAcompanhamento?: StatusAcompanhamento; // Status de acompanhamento interno
  
  // Rastreamento de quem fez as alterações no acompanhamento
  ultimoRegistroPor?: string; // Nome de quem fez a última alteração geral
  ultimoRegistroDataISO?: string; // Data da última alteração geral
  statusAcompanhamentoPor?: string; // Quem alterou o status de acompanhamento
  statusAcompanhamentoDataISO?: string; // Quando alterou o status
  observacaoEmpreendedorPor?: string; // Quem alterou a obs do empreendedor
  observacaoEmpreendedorDataISO?: string; // Quando alterou a obs do empreendedor
  observacaoMentorPor?: string; // Quem alterou a obs do mentor
  observacaoMentorDataISO?: string; // Quando alterou a obs do mentor
}

export interface CRMState {
  projetos: Projeto[];
  mentores: Mentor[];
  mentorias: Mentoria[];
  relatos: Relato[];
  filtro: {
    status?: StatusMentoria | "todas";
    mentorId?: string | "todos";
    projetoId?: string | "todos";
    busca?: string;
  };
}
