import React, { createContext, useContext, useReducer, useMemo, ReactNode, useEffect } from "react";
import { CRMState, Mentoria, Mentor, Relato, StatusMentoria, StatusAcompanhamento } from "../types/crm";
import { crmMock } from "../data";

type Action =
  | { type: "SET_FILTER"; payload: Partial<CRMState["filtro"]> }
  | { type: "MUDAR_STATUS"; payload: { mentoriaId: string; status: StatusMentoria } }
  | { type: "ATRIBUIR_MENTOR"; payload: { mentoriaId: string; mentorId?: string } }
  | { type: "ATUALIZAR_MENTOR"; payload: { mentor: Mentor } }
  | { type: "ADICIONAR_RELATO"; payload: { relato: Relato } }
  | { type: "EDITAR_RELATO"; payload: { relatoId: string; relato: Partial<Relato> } }
  | { type: "EXCLUIR_RELATO"; payload: { relatoId: string } }
  | { type: "ATUALIZAR_PROXIMO_ENCONTRO"; payload: { mentoriaId: string; dataISO?: string; horario?: string } }
  | { type: "ATUALIZAR_ACOMPANHAMENTO"; payload: { mentoriaId: string; registradoPor?: string; acompanhamento: Partial<Pick<Mentoria, "numEncontrosPlataforma" | "numEncontrosAcompanhamento" | "observacaoEmpreendedor" | "observacaoMentor" | "motivoCancelamento" | "statusAcompanhamento">> } }
  | { type: "ADICIONAR_MENTORIA"; payload: { mentoria: Mentoria } };

const CrmContext = createContext<{
  state: CRMState;
  dispatch: React.Dispatch<Action>;
}>({ state: crmMock, dispatch: () => {} });

function crmReducer(state: CRMState, action: Action): CRMState {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filtro: { ...state.filtro, ...action.payload } };

    case "MUDAR_STATUS": {
      const { mentoriaId, status } = action.payload;
      const mentorias = state.mentorias.map((m) =>
        m.id === mentoriaId
          ? { ...m, status, ultimaAtualizacaoISO: new Date().toISOString() }
          : m
      );
      return { ...state, mentorias };
    }

    case "ATRIBUIR_MENTOR": {
      const { mentoriaId, mentorId } = action.payload;
      const mentorias = state.mentorias.map((m) =>
        m.id === mentoriaId ? { ...m, mentorId, ultimaAtualizacaoISO: new Date().toISOString() } : m
      );
      return { ...state, mentorias };
    }

    case "ATUALIZAR_MENTOR": {
      const { mentor } = action.payload;
      const mentores = state.mentores.map((m) => (m.id === mentor.id ? { ...mentor } : m));
      return { ...state, mentores };
    }

    case "ADICIONAR_RELATO": {
      const relatos = [...state.relatos, action.payload.relato];
      return { ...state, relatos };
    }

    case "EDITAR_RELATO": {
      const { relatoId, relato } = action.payload;
      const relatos = state.relatos.map((r) =>
        r.id === relatoId ? { ...r, ...relato } : r
      );
      return { ...state, relatos };
    }

    case "EXCLUIR_RELATO": {
      const { relatoId } = action.payload;
      const relatos = state.relatos.filter((r) => r.id !== relatoId);
      return { ...state, relatos };
    }

    case "ATUALIZAR_PROXIMO_ENCONTRO": {
      const { mentoriaId, dataISO, horario } = action.payload;
      const mentorias = state.mentorias.map((m) =>
        m.id === mentoriaId
          ? {
              ...m,
              proximoEncontroDataISO: dataISO,
              proximoEncontroHorario: horario,
              ultimaAtualizacaoISO: new Date().toISOString(),
            }
          : m
      );
      return { ...state, mentorias };
    }

    case "ATUALIZAR_ACOMPANHAMENTO": {
      const { mentoriaId, registradoPor, acompanhamento } = action.payload;
      const agora = new Date().toISOString();
      const mentorias = state.mentorias.map((m) => {
        if (m.id !== mentoriaId) return m;
        
        const updates: Partial<Mentoria> = {
          ...acompanhamento,
          ultimaAtualizacaoISO: agora,
        };
        
        // Rastreia quem fez o registro geral
        if (registradoPor) {
          updates.ultimoRegistroPor = registradoPor;
          updates.ultimoRegistroDataISO = agora;
        }
        
        // Rastreia alteração no status de acompanhamento
        if (acompanhamento.statusAcompanhamento !== undefined && 
            acompanhamento.statusAcompanhamento !== m.statusAcompanhamento && 
            registradoPor) {
          updates.statusAcompanhamentoPor = registradoPor;
          updates.statusAcompanhamentoDataISO = agora;
        }
        
        // Rastreia alteração na observação do empreendedor
        if (acompanhamento.observacaoEmpreendedor !== undefined && 
            acompanhamento.observacaoEmpreendedor !== m.observacaoEmpreendedor && 
            registradoPor) {
          updates.observacaoEmpreendedorPor = registradoPor;
          updates.observacaoEmpreendedorDataISO = agora;
        }
        
        // Rastreia alteração na observação do mentor
        if (acompanhamento.observacaoMentor !== undefined && 
            acompanhamento.observacaoMentor !== m.observacaoMentor && 
            registradoPor) {
          updates.observacaoMentorPor = registradoPor;
          updates.observacaoMentorDataISO = agora;
        }
        
        return { ...m, ...updates };
      });
      return { ...state, mentorias };
    }

    case "ADICIONAR_MENTORIA": {
      const mentorias = [...state.mentorias, action.payload.mentoria];
      return { ...state, mentorias };
    }

    default:
      return state;
  }
}

export function CrmProvider({ children }: { children: ReactNode }) {
  // opcional: persistência em localStorage para demo
  const STORAGE_KEY = "crm-state-v1";

  const [state, baseDispatch] = useReducer(crmReducer, undefined as any, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CRMState) : crmMock;
    } catch {
      return crmMock;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const dispatch = baseDispatch;

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  return useContext(CrmContext);
}
