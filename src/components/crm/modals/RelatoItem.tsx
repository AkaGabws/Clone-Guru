import React from "react";
import { useCrm } from "../../../store/CrmContext";
import { Button } from "../../../components/ui/button";
import { Relato } from "../../../types/crm";
import { Edit2, Trash2, Save, Calendar, Clock } from "lucide-react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

export function RelatoItem({ relato }: { relato: Relato }) {
    const { dispatch } = useCrm();
    const dispatchAny = dispatch as unknown as (action: any) => void;

    const [isEditing, setIsEditing] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [textoEditado, setTextoEditado] = React.useState(relato.texto);
    const [dataEncontro, setDataEncontro] = React.useState(
        relato.dataEncontroISO ? new Date(relato.dataEncontroISO).toISOString().split('T')[0] : ''
    );
    const [duracaoMinutos, setDuracaoMinutos] = React.useState(
        relato.duracaoMinutos?.toString() || ''
    );

    const handleSave = () => {
        const dataEncontroISO = dataEncontro ? new Date(dataEncontro + 'T00:00:00').toISOString() : undefined;
        const duracao = duracaoMinutos ? parseInt(duracaoMinutos, 10) : undefined;
        
        dispatchAny({ 
            type: "EDITAR_RELATO", 
            payload: { 
                relatoId: relato.id, 
                relato: {
                    texto: textoEditado,
                    dataEncontroISO,
                    duracaoMinutos: duracao
                }
            } 
        });
        setIsEditing(false);
    }

    const handleCancel = () => {
        setTextoEditado(relato.texto);
        setDataEncontro(relato.dataEncontroISO ? new Date(relato.dataEncontroISO).toISOString().split('T')[0] : '');
        setDuracaoMinutos(relato.duracaoMinutos?.toString() || '');
        setIsEditing(false);
    }

    const handleDelete = () => {
        dispatchAny({ type: "EXCLUIR_RELATO", payload: { relatoId: relato.id } });
        setShowDeleteConfirm(false);
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <div className="border rounded-md p-3 bg-yellow-50 border-yellow-200">
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Data do Encontro</label>
                        <input
                            type="date"
                            className="w-full text-sm p-2 border rounded"
                            value={dataEncontro}
                            onChange={(e) => setDataEncontro(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Duração (minutos)</label>
                        <input
                            type="number"
                            className="w-full text-sm p-2 border rounded"
                            placeholder="Ex: 60"
                            value={duracaoMinutos}
                            onChange={(e) => setDuracaoMinutos(e.target.value)}
                            min="0"
                        />
                    </div>
                </div>
                <textarea
                    className="w-full text-sm p-2 border rounded mb-2"
                    rows={3}
                    value={textoEditado}
                    onChange={(e) => setTextoEditado(e.target.value)}
                    placeholder="Descrição do encontro..."
                />
                <div className="flex gap-2 justify-end">
                     <Button variant="ghost" onClick={handleCancel} className="h-8">
                        Cancelar
                     </Button>
                     <Button onClick={handleSave} className="h-8 bg-blue-600 hover:bg-blue-700">
                        <Save className="w-3 h-3 mr-1" /> Salvar
                    </Button>
                </div>
            </div>
        )
    }

    if (!relato || !relato.id) return null;

    return (
        <>
            <div className="border rounded-md p-3 hover:shadow-sm transition-shadow bg-white">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        {relato.dataISO && (
                            <div className="text-xs font-semibold text-gray-500 mb-1 flex items-center">
                                Registrado em: {new Date(relato.dataISO).toLocaleString('pt-BR')}
                            </div>
                        )}
                        {relato.dataEncontroISO && (
                            <div className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>Data do encontro: {new Date(relato.dataEncontroISO).toLocaleDateString('pt-BR')}</span>
                            </div>
                        )}
                        {relato.duracaoMinutos && (
                            <div className="text-xs font-semibold text-green-700 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Duração: {relato.duracaoMinutos} minutos</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-blue-600" title="Editar">
                            <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(true)} className="p-1 text-gray-400 hover:text-red-600" title="Excluir">
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{relato.texto || 'Sem descrição'}</p>
            </div>

            {/* Modal de Confirmação de Exclusão */}
            {showDeleteConfirm && (
                <ConfirmDeleteModal
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                    title="Excluir Relato"
                    message="Tem certeza que deseja excluir este relato? Esta ação não pode ser desfeita."
                />
            )}
        </>
    );
}

