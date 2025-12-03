import React from "react";
import { useCrm } from "../../../store/CrmContext";
import { Button } from "../../../components/ui/button";
import { MessageCircle } from "lucide-react";
import { ProximoEncontroSection } from "./ProximoEncontroSection";
import { RelatoItem } from "./RelatoItem";

const STATUS_MAP: Record<string, string> = {
  nova: 'Nova',
  triagem: 'Triagem',
  agendada: 'Agendada',
  ativa: 'Ativa',
  pausada: 'Pausada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

export function MentoriaDetalhesModal({ mentoriaId, onClose }: { mentoriaId: string, onClose: () => void }) {
    const { state, dispatch } = useCrm();
    
    const m = state.mentorias.find(x => x.id === mentoriaId);
    const mentor = m?.mentorId ? state.mentores.find(x => x.id === m.mentorId) : null;
    const projeto = state.projetos.find(p => p.id === m?.projetoId);

    // Filtra relatos desta mentoria
    const relatos = React.useMemo(() => {
        const filtrados = state.relatos
            .filter(r => r.mentoriaId === mentoriaId)
            .sort((a, b) => (a.dataISO < b.dataISO ? 1 : -1));
        return filtrados;
    }, [state.relatos, mentoriaId]);

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

    if (!m) return null;
    const mentoriaAtual = m;

    // Mensagem para empreendedor
    const mensagemEmpreendedor = `Olá ${mentoriaAtual.empreendedor}! Aqui é da equipe de mentoria.`;
    const telefoneEmpreendedor = mentoriaAtual.telefoneEmpreendedor ?? "";
    
    // Mensagem para mentor
    const mensagemMentor = `Olá ${mentor?.nome || 'Mentor'}! Aqui é da equipe de mentoria.`;
    const telefoneMentor = mentor?.telefone ?? "";

    function handleWhatsappEmpreendedor() {
        const phone = telefoneEmpreendedor.replace(/\D/g, "");
        const baseUrl = phone ? `https://wa.me/${phone}` : "https://wa.me/";
        const url = `${baseUrl}?text=${encodeURIComponent(mensagemEmpreendedor)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    }

    function handleWhatsappMentor() {
        const phone = telefoneMentor.replace(/\D/g, "");
        const baseUrl = phone ? `https://wa.me/${phone}` : "https://wa.me/";
        const url = `${baseUrl}?text=${encodeURIComponent(mensagemMentor)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] mx-4 overflow-hidden flex flex-col">
                
                {/* Header do Modal */}
                <div className="flex justify-between items-start p-6 border-b bg-blue-900">
                    <div>
                        <h2 className="text-xl font-bold text-yellow-400">{m.empreendedor}</h2>
                        <p className="text-sm text-white mt-1">Projeto: {projeto?.nome} • Mentor: {mentor?.nome || 'Não atribuído'}</p>
                        <div className="mt-2">
                             <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                {STATUS_MAP[m.status] || m.status}
                             </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={handleWhatsappEmpreendedor}
                                className="h-9 px-3 rounded-full bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-colors text-sm"
                                title="Enviar mensagem para o empreendedor no WhatsApp"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Empreendedor</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleWhatsappMentor}
                                className="h-9 px-3 rounded-full bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-colors text-sm"
                                title="Enviar mensagem para o mentor no WhatsApp"
                            >
                                <span>Mentor</span>
                                <MessageCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                {/* Corpo com Scroll */}
                <div className="overflow-y-auto p-6 space-y-6 flex-1">
                    
                    {/* Seção 1: Próximo Encontro */}
                    <ProximoEncontroSection mentoria={m} />

                    {/* Seção 2: Informações da Mentoria */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-2 border-b pb-1">Informações</h3>
                        <div className="space-y-2 text-sm">
                            {m.negocio && (
                                <div>
                                    <span className="font-semibold text-gray-700">Negócio:</span>
                                    <p className="text-gray-600 mt-1">{m.negocio}</p>
                                </div>
                            )}
                            {m.desafio && (
                                <div>
                                    <span className="font-semibold text-gray-700">Desafio:</span>
                                    <p className="text-gray-600 mt-1">{m.desafio}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seção 3: Histórico de Relatos */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 border-b pb-1">Relatos</h3>
                        
                        {relatos.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Nenhum relato registrado.</p>
                        ) : (
                            <div className="space-y-3">
                                {relatos.map(relato => (
                                    <RelatoItem key={relato.id} relato={relato} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
}

