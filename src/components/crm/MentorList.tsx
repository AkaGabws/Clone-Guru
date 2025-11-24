import React from "react";
import { useCrm } from "../../store/CrmContext";
import { Button } from "../../components/ui/button";

export function MentorList() {
  const { state } = useCrm();
  const [editId, setEditId] = React.useState<string | null>(null);

  if (!state || !Array.isArray(state.mentores)) {
    return <div className="p-6 text-red-600">Erro: contexto CRM não disponível ou lista de mentores não encontrada.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.mentores.map((m) => (
          <div key={m.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-900 font-bold">{m.nome}</h3>
              <span className={`text-xs ${m.ativo ? "text-green-700" : "text-gray-500"}`}>{m.ativo ? "Ativo" : "Inativo"}</span>
            </div>
            <p className="text-sm text-gray-600">{m.area ?? "Área não informada"}</p>
            {m.email && <p className="text-sm text-gray-600">{m.email}</p>}
            <div className="mt-3 flex items-center gap-2">
              <Button
                className="bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-500 rounded-full"
                onClick={() => setEditId(m.id)}
              >
                Editar perfil
              </Button>
            </div>
          </div>
        ))}
      </div>
      {editId && <MentorEditor mentorId={editId} onClose={() => setEditId(null)} />}
    </>
  );
}

function MentorEditor({ mentorId, onClose }: { mentorId: string; onClose: () => void }) {
  const { state, dispatch } = useCrm();
  const mentor = state.mentores.find((x) => x.id === mentorId)!;

  const [form, setForm] = React.useState({
    nome: mentor.nome,
    email: mentor.email ?? "",
    telefone: mentor.telefone ?? "",
    area: mentor.area ?? "",
    ativo: mentor.ativo,
    inativo: !mentor.ativo,
  });

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

  function salvar() {
    dispatch({ type: "ATUALIZAR_MENTOR", payload: { mentor: { ...mentor, ...form } } });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900">Editar Mentor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <Input label="Nome" value={form.nome} onChange={(v) => setForm((f) => ({ ...f, nome: v }))} />
          <Input label="Email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
          <Input label="Telefone" value={form.telefone} onChange={(v) => setForm((f) => ({ ...f, telefone: v }))} />
          <Input label="Área" value={form.area} onChange={(v) => setForm((f) => ({ ...f, area: v }))} />
          <div className="flex items-center gap-2">
            <input 
              id="ativo" 
              type="checkbox" 
              checked={form.ativo} 
              onChange={(e) => setForm((f) => ({ ...f, ativo: e.target.checked }))} 
              className="w-4 h-4"
            />
            <label htmlFor="ativo" className="text-sm">Ativo</label>
          </div>
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-blue-900 hover:bg-blue-800" onClick={salvar}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-sm">
      <span className="block text-xs text-gray-500 mb-1">{label}</span>
      <input className="w-full border rounded-md px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-sm">
      <span className="block text-xs text-gray-500 mb-1">{label}</span>
      <textarea className="w-full border rounded-md px-3 py-2" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
