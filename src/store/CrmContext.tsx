import React, { createContext, useContext, useReducer, useMemo, ReactNode, useEffect } from "react";
import { CRMState, Mentoria, Mentor, Relato, StatusMentoria } from "../types/crm";
import { crmMock } from "../data/crmMock";

type Action =
  | { type: "SET_FILTER"; payload: Partial<CRMState["filtro"]> }
  | { type: "MUDAR_STATUS"; payload: { mentoriaId: string; status: StatusMentoria } }
  | { type: "ATRIBUIR_MENTOR"; payload: { mentoriaId: string; mentorId?: string } }
  | { type: "ATUALIZAR_MENTOR"; payload: { mentor: Mentor } }
  | { type: "ADICIONAR_RELATO"; payload: { relato: Relato } };

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
