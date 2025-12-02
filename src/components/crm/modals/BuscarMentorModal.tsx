import React from "react";

interface BuscarMentorModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentores: Array<{ id: string; nome: string; email?: string; area?: string }>;
    onSelecionar: (mentorId: string) => void;
}

export function BuscarMentorModal({ isOpen, onClose, mentores, onSelecionar }: BuscarMentorModalProps) {
    const [buscarMentor, setBuscarMentor] = React.useState("");

    const mentoresFiltrados = React.useMemo(() => {
        if (!buscarMentor) return mentores;
        
        const buscaLower = buscarMentor.toLowerCase();
        return mentores.filter((m) => 
            m.nome.toLowerCase().includes(buscaLower) ||
            m.email?.toLowerCase().includes(buscaLower) ||
            m.area?.toLowerCase().includes(buscaLower)
        );
    }, [mentores, buscarMentor]);

    React.useEffect(() => {
        if (!isOpen) {
            setBuscarMentor("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-semibold">Buscar mentor</h4>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-gray-600 hover:text-gray-800"
                    >
                        Fechar
                    </button>
                </div>

                <input
                    type="text"
                    value={buscarMentor}
                    onChange={(e) => setBuscarMentor(e.target.value)}
                    placeholder="Pesquisar por nome, email ou competência..."
                    className="w-full border rounded px-3 py-2 mb-3 text-sm"
                />

                <div className="max-h-64 overflow-auto divide-y border-t border-b">
                    {mentoresFiltrados.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500">Nenhum mentor encontrado</div>
                    ) : (
                        mentoresFiltrados.map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                    onSelecionar(m.id);
                                    onClose();
                                }}
                                className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                            >
                                <div className="font-medium text-sm">{m.nome}</div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    {m.email && <span>{m.email}</span>}
                                    {m.area && (
                                        <>
                                            {m.email && <span>•</span>}
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                {m.area}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

