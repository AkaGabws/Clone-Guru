import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Check, user, Users, Target, Rocket, Heart } from "lucide-react";

export function ImpactSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-blue-900">Nosso impacto</h2>
          <p className="text-xl text-slate-600">O Guru de Negócios é um programa focado no apoio qualitativo ao microempreendedor brasileiro. Seu impacto é medido por meio de indicadores de desempenho diretamente relacionados aos resultados dos participantes:.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="space-y-3">
              <Users className="w-10 h-10 text-blue-900 shrink-0" />
              <div className="mt-4"><span className="text-3xl font-bold text-blue-900">+82%</span></div>
              <div className="flex items-center space-x-3 text-slate-700"><span>dos empreendedores relataram aumento na confiança para gerir seus negócios</span></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            
            <CardContent className="space-y-3">
              <Rocket className="w-10 h-10 text-blue-900 shrink-0" />
              <div className="mt-4"><span className="text-3xl font-bold text-blue-900">+74%</span></div>
              <div className="flex items-center space-x-3 text-slate-700"><span>conseguiram expandir suas empresas.</span></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="space-y-3">
              <Target className="w-10 h-10 text-blue-900 shrink-0" />
              <div className="mt-4"><span className="text-3xl font-bold text-blue-900">+70%</span></div>
              <div className="flex items-center space-x-3 text-slate-700"><span>afirmaram se sentir mais confiantes para tomar decisões.</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}


