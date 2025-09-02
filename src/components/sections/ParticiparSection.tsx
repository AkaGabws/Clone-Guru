import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function ParticiparSection() {
  const skillsCards = [
    {
      title: "Escuta ativa",
      description: "Capacidade de ouvir atentamente e compreender as necessidades dos microempreendedores.",
      icon: "👂"
    },
    {
      title: "Orientação e feedback",
      description: "Habilidade em fornecer orientações claras e feedback construtivo.",
      icon: "🎯"
    },
    {
      title: "Empatia e sensibilidade",
      description: "Compreensão das dificuldades e desafios do empreendedorismo.",
      icon: "❤️"
    },
    {
      title: "Pensamento crítico",
      description: "Capacidade de analisar situações e propor soluções práticas.",
      icon: "🧠"
    },
    {
      title: "Conhecimento em empreendedorismo",
      description: "Entendimento sólido sobre processos de abertura e crescimento de negócios.",
      icon: "🏢"
    },
    {
      title: "Flexibilidade",
      description: "Capacidade de adaptar o suporte às necessidades individuais de cada empreendedor.",
      icon: "🔄"
    },
    {
      title: "Colaboração",
      description: "Agir com compaixão pelo todo e por todas, fazendo a diferença na vida dos participantes e transformando juntos as suas jornadas.",
      icon: "🤝"
    },
    {
      title: "Dedicação",
      description: "Sugerimos um tempo de dedicação de 2,5 horas por mês dependendo do número de sessões.",
      icon: "💡"
    }
  ];

  return (
    <section id="participar" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Título e descrição */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
            Como participar
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            O programa conecta microempreendedores com mentores para suporte personalizado, 
            ajudando-os a desenvolver habilidades e identificar oportunidades de crescimento. 
            Os participantes se cadastram e passam por treinamento online para se tornarem mentores.
          </p>
        </div>

        {/* Subtítulo */}
        <div className="text-center mb-8">
          <div className="bg-blue-900 text-white p-4 rounded-lg inline-block">
            <h3 className="text-lg font-semibold">
              As habilidades necessárias para ser mentor incluem:
            </h3>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
          {skillsCards.map((card, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">{card.icon}</div>
                <CardTitle className="font-heading text-xl text-blue-900">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-center leading-relaxed">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botão de call-to-action */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-blue-900 text-white hover:bg-blue-800 text-lg px-8 py-4"
            onClick={() => document.querySelector('#participar')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Quero ser Mentor
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}


