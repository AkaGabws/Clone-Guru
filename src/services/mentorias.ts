import { Encontro, Mentoria, MentoriaStatus } from '../types/mentoria';
import { mentoriasMock } from '../data';

export async function getMentoriaById(id: string): Promise<Mentoria | null> {
  // quando tiver API: fetch(`/api/mentorias/${id}`)
  const fromMock = mentoriasMock.find((m) => m.id === id);
  if (!fromMock) return null;

  // prioriza status salvo localmente
  const status = getMentoriaStatus(id) ?? fromMock.status;
  return { ...fromMock, status };
}

export function getEncontros(id: string): Encontro[] {
  const raw = localStorage.getItem(`mentoria:${id}:encontros`);
  return raw ? (JSON.parse(raw) as Encontro[]) : [];
}

export function saveEncontro(id: string, encontro: Encontro): Encontro[] {
  const list = getEncontros(id);
  list.push(encontro);
  localStorage.setItem(`mentoria:${id}:encontros`, JSON.stringify(list));
  return list;
}

export function deleteEncontro(id: string, encontroId: string): Encontro[] {
  const list = getEncontros(id).filter((e) => e.id !== encontroId);
  localStorage.setItem(`mentoria:${id}:encontros`, JSON.stringify(list));
  return list;
}

export function computeTotalMinutos(id: string): number {
  return getEncontros(id).reduce((sum, e) => sum + (Number(e.duracaoMin) || 0), 0);
}

export function getMentoriaStatus(id: string): MentoriaStatus | null {
  return (localStorage.getItem(`mentoria:${id}:status`) as MentoriaStatus) || null;
}

export function setMentoriaStatus(id: string, status: MentoriaStatus): void {
  localStorage.setItem(`mentoria:${id}:status`, status);
}
