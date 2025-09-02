export interface CursoLink {
  texto: string;
  url: string;
}

export interface Empreendedor {
  nome: string;
  desafios?: string;
  sobreNegocio?: string;
  areaAtuacao?: string;
  setor?: string;
  inscritoDesde?: string; // ISO yyyy-mm-dd
  whatsapp?: string;      // 55 + DDD + número
  cursosCompletados?: CursoLink[];
  cursosEmAndamento?: string[];
}

export type MentoriaStatus = 'ativa' | 'cancelada';

export interface Mentoria {
  id: string;
  titulo: string;         // ex: "Mentoria Gratuita > Marketing / Vendas"
  iniciadoEm: string;     // ISO yyyy-mm-dd
  metaMinutos: number;    // ex: 210
  status: MentoriaStatus;
  empreendedor: Empreendedor;
}

export interface Encontro {
  id: string;
  descricao: string;
  duracaoMin: number;
  proximoEncontroISO: string | null; // ISO yyyy-mm-dd
  criadoEmISO: string;               // ISO yyyy-mm-dd
}