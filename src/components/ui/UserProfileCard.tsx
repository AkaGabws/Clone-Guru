import { User } from "lucide-react";

interface UserProfileCardProps {
  name: string;
  role: string;
  onLogout?: () => void;
}

export function UserProfileCard({ name, role, onLogout }: UserProfileCardProps) {
  return (
    <div className="w-full max-w-xs text-white">
      {/* Header com Avatar e Nome */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white">
          <User className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-base font-bold">{name}</h1>
          {onLogout ? (
            <button 
              onClick={onLogout}
              className="text-[10px] text-blue-200 hover:text-white uppercase tracking-wide"
            >
              {role}
            </button>
          ) : (
            <p className="text-[10px] text-blue-200">{role}</p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="space-y-1.5">
        <button className="w-full rounded-md bg-white py-1.5 px-3 text-[10px] font-bold text-gray-900 transition-colors hover:bg-gray-100 uppercase tracking-wide">
          Editar Perfil
        </button>
        <button className="w-full rounded-md bg-white py-1.5 px-3 text-[10px] font-bold text-gray-900 transition-colors hover:bg-gray-100 uppercase tracking-wide">
          Áreas de Interesse
        </button>
        <button className="w-full rounded-md bg-white py-1.5 px-3 text-[10px] font-bold text-gray-900 transition-colors hover:bg-gray-100 uppercase tracking-wide">
          Configurações de Notificações
        </button>
      </div>
    </div>
  );
}

