import React from "react";
import { Header } from "../components/sections/Header";
import { Footer } from "../components/sections/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useCrm } from "../store/CrmContext";
import { MentoriaKanban } from "../components/crm/MentoriaKanban";
import { MentoriaLista } from "../components/crm/MentoriaLista";
import { MentorList } from "../components/crm/MentorList";
import { RelatosFeed } from "../components/crm/RelatosFeed";
import { Filter, Users, KanbanSquare, List, NotebookPen, ProjectorIcon, Projector } from "lucide-react";

type Aba = "kanban" | "lista de Mentorados" | "mentores" | "relatos";

export default function CRMPage() {
  const { state, dispatch } = useCrm();
  const [aba, setAba] = React.useState<Aba>("kanban");

  const totals = React.useMemo(() => {
    const byStatus = state.mentorias.reduce<Record<string, number>>((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {});
    return {
      ativas: byStatus["ativa"] || 0,
      aguardando: (byStatus["nova"] || 0) + (byStatus["triagem"] || 0) + (byStatus["agendada"] || 0),
      concluidas: byStatus["concluida"] || 0,
      canceladas: byStatus["cancelada"] || 0,
    };
  }, [state.mentorias]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Título + KPIs */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900">ADM de Mentorias</h1>
          <p className="text-gray-700 mt-1">Gerencie mentores e relatos em um só lugar.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-xs text-gray-500">Ativas</p>
            <p className="text-2xl font-bold text-blue-900">{totals.ativas}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500">Aguardando</p>
            <p className="text-2xl font-bold text-blue-900">{totals.aguardando}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500">Concluídas</p>
            <p className="text-2xl font-bold text-blue-900">{totals.concluidas}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500">Canceladas</p>
            <p className="text-2xl font-bold text-blue-900">{totals.canceladas}</p>
          </Card>
        </div>

        {/* Filtros *
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={state.filtro.status ?? "todas"}
                onChange={(e) => dispatch({ type: "SET_FILTER", payload: { status: e.target.value as any } })}
              >
                <option value="todas">Todos</option>
                <option value="nova">Nova</option>
                <option value="ativa">Ativa</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Mentor</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={state.filtro.mentorId ?? "todos"}
                onChange={(e) => dispatch({ type: "SET_FILTER", payload: { mentorId: e.target.value } })}
              >
                <option value="todos">Todos</option>
                {state.mentores.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Projeto</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={state.filtro.projetoId ?? "todos"}
                onChange={(e) => dispatch({ type: "SET_FILTER", payload: { projetoId: e.target.value } })}
              >
                <option value="todos">Todos</option>
                {state.projetos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Busca</label>
              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="Empreendedor, negócio, palavra-chave..."
                value={state.filtro.busca ?? ""}
                onChange={(e) => dispatch({ type: "SET_FILTER", payload: { busca: e.target.value } })}
              />
            </div>

            <div className="sm:self-end">
              <Button variant="default" className="bg-blue-900 hover:bg-blue-800">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </Card>
        */}

        {/* Abas */}
        <div className="flex gap-2 mb-4">
          <TabButton icon={<KanbanSquare className="w-4 h-4" />} label="Gestão de Mentorias" active={aba === "kanban"} onClick={() => setAba("kanban")} />
          <TabButton icon={<List className="w-4 h-4" />} label="Lista de Mentorados" active={aba === "lista de Mentorados"} onClick={() => setAba("lista de Mentorados")} />
          <TabButton icon={<Users className="w-4 h-4" />} label="Mentores" active={aba === "mentores"} onClick={() => setAba("mentores")} />
          <TabButton icon={<Projector className="w-4 h-4" />} label="Projeto" active={aba === "relatos"} onClick={() => setAba("relatos")} /> 
        </div>

        {aba === "kanban" && <MentoriaKanban />}
        {aba === "lista de Mentorados" && <MentoriaLista />}
        {aba === "mentores" && <MentorList />}
         {aba === "relatos" && <RelatosFeed />} 
      </main>

      <Footer />
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
        active ? "bg-yellow-400 text-blue-900" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
