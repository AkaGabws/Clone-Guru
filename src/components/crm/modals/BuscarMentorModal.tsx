import React from "react";

interface BuscarMentorModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentores: Array<{ id: string; nome: string; email?: string; area?: string }>;
    onSelecionar: (mentorId: string) => void;
    areaSugerida?: string; // Área da mentoria para filtro automático
}

export function BuscarMentorModal({ isOpen, onClose, mentores, onSelecionar, areaSugerida }: BuscarMentorModalProps) {
    const [buscarMentor, setBuscarMentor] = React.useState("");
    const [mostrarTodos, setMostrarTodos] = React.useState(false);

    const mentoresFiltrados = React.useMemo(() => {
        let resultado = mentores;
        
        // Filtro automático por área (se não estiver mostrando todos)
        if (areaSugerida && !mostrarTodos) {
            resultado = resultado.filter((m) => 
                m.area?.toLowerCase().includes(areaSugerida.toLowerCase())
            );
        }
        
        // Filtro de busca manual
        if (buscarMentor) {
            const buscaLower = buscarMentor.toLowerCase();
            resultado = resultado.filter((m) => 
                m.nome.toLowerCase().includes(buscaLower) ||
                m.email?.toLowerCase().includes(buscaLower) ||
                m.area?.toLowerCase().includes(buscaLower)
            );
        }
        
        return resultado;
    }, [mentores, buscarMentor, areaSugerida, mostrarTodos]);

    React.useEffect(() => {
        if (!isOpen) {
            setBuscarMentor("");
            setMostrarTodos(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const totalMentoresArea = areaSugerida 
        ? mentores.filter(m => m.area?.toLowerCase().includes(areaSugerida.toLowerCase())).length 
        : 0;

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

                {/* Alerta de filtro automático */}
                {areaSugerida && !mostrarTodos && (
                    <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-blue-800">
                                <strong>Filtro automático:</strong> Mostrando apenas mentores de <strong>{areaSugerida}</strong> ({totalMentoresArea})
                            </p>
                            <button
                                onClick={() => setMostrarTodos(true)}
                                className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap ml-2"
                            >
                                Ver todos
                            </button>
                        </div>
                    </div>
                )}

                {areaSugerida && mostrarTodos && (
                    <div className="mb-3 p-2 bg-gray-50 border border-gray-200 rounded-md">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-700">
                                Mostrando todos os mentores ({mentores.length})
                            </p>
                            <button
                                onClick={() => setMostrarTodos(false)}
                                className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap ml-2"
                            >
                                Filtrar por {areaSugerida}
                            </button>
                        </div>
                    </div>
                )}

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

