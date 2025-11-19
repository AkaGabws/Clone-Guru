export type StatusMentoria =
  | "nova"
  | "ativa"
  | "pausada"
  | "concluida"
  | "cancelada"
  | "expirada";

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
  titulo?: string;
  texto: string;
}

export interface Mentoria {
  id: string;
  empreendedor: string;
  negocio?: string;
  projetoId: string;
  status: StatusMentoria;
  mentorId?: string;
  desafio?: string;
  dataCriacaoISO: string;
  ultimaAtualizacaoISO: string;
  progresso?: number;    // 0-100 caso use
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
