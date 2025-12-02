import React from "react";
import { Button } from "../../../components/ui/button";
import { AlertTriangle } from "lucide-react";

export function ConfirmDeleteModal({ 
    onConfirm, 
    onCancel, 
    title, 
    message 
}: { 
    onConfirm: () => void; 
    onCancel: () => void; 
    title: string; 
    message: string;
}) {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onCancel();
            }
        };
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [onCancel]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
            <div className="relative z-[60] bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-sm text-gray-600">{message}</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Excluir
                    </Button>
                </div>
            </div>
        </div>
    );
}

