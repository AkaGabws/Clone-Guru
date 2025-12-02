import React from "react";
import { useCrm } from "../../../store/CrmContext";
import { Button } from "../../../components/ui/button";
import { Mentoria } from "../../../types/crm";
import { Edit2, Save, X } from "lucide-react";

export function ProximoEncontroSection({ mentoria }: { mentoria: Mentoria }) {
    const { dispatch } = useCrm();
    const [isEditing, setIsEditing] = React.useState(false);
    const [dataEncontro, setDataEncontro] = React.useState(
        mentoria.proximoEncontroDataISO ? new Date(mentoria.proximoEncontroDataISO).toISOString().split('T')[0] : ''
    );
    const [horario, setHorario] = React.useState(mentoria.proximoEncontroHorario || '');

    const handleSave = () => {
        const dataISO = dataEncontro ? new Date(dataEncontro + 'T00:00:00').toISOString() : undefined;
        dispatch({
            type: "ATUALIZAR_PROXIMO_ENCONTRO",
            payload: {
                mentoriaId: mentoria.id,
                dataISO,
                horario: horario || undefined
            }
        });
        setIsEditing(false);
    }

    const handleCancel = () => {
        setDataEncontro(mentoria.proximoEncontroDataISO ? new Date(mentoria.proximoEncontroDataISO).toISOString().split('T')[0] : '');
        setHorario(mentoria.proximoEncontroHorario || '');
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-blue-900">📅 Próximo Encontro</h3>
                    <div className="flex gap-1">
                        <button onClick={handleCancel} className="p-1 text-gray-400 hover:text-gray-600" title="Cancelar">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Data</label>
                        <input
                            type="date"
                            className="w-full text-sm p-2 border rounded bg-white"
                            value={dataEncontro}
                            onChange={(e) => setDataEncontro(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Horário (HH:mm)</label>
                        <input
                            type="time"
                            className="w-full text-sm p-2 border rounded bg-white"
                            value={horario}
                            onChange={(e) => setHorario(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={handleCancel} className="h-8 text-xs">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} className="h-8 bg-blue-600 hover:bg-blue-700 text-xs">
                        <Save className="w-3 h-3 mr-1" /> Salvar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-blue-900">📅 Próximo Encontro</h3>
                <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-blue-600" title="Editar">
                    <Edit2 className="w-4 h-4" />
                </button>
            </div>
            <div className="text-sm text-gray-700">
                {mentoria.proximoEncontroDataISO ? (
                    <>
                        <p>Data: <strong>{new Date(mentoria.proximoEncontroDataISO).toLocaleDateString('pt-BR')}</strong></p>
                        {mentoria.proximoEncontroHorario && (
                            <p>Horário: <strong>{mentoria.proximoEncontroHorario}</strong></p>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 italic">Nenhum encontro agendado</p>
                )}
            </div>
        </div>
    );
}

