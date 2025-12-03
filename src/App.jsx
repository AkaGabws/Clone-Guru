import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pode importar sem extensão mesmo, o bundler resolve .tsx
import RootLayout from "./pages/layout";
import LandingPage from "./pages/page";
import MentoriasPage from "./pages/MentoriasPage";
import MentoriaAcompanhamento from "./pages/MentoriaAcompanhamento";
import { Header } from "./components/sections/Header";
import CRMPage from "./pages/CRMPage";
import { AuthProvider } from "./store/AuthContext";

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/crm" element={<CRMPage />} />


        {/* Home com seu layout */}
        <Route path="/" element={<RootLayout><LandingPage /></RootLayout>} />

        {/* Lista de mentorias */}
        <Route path="/mentorias" element={<MentoriasPage />} />

        {/* Acompanhamento - manter no singular para casar com os navigate() já existentes */}
        <Route path="/mentoria-acompanhamento" element={<MentoriaAcompanhamento />} />

        {/* (Opcional) Suporta também o caminho no plural, caso algum link antigo use */}
        <Route path="/mentorias-acompanhamento" element={<MentoriaAcompanhamento />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}