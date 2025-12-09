import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, Ear, Target, Heart, Brain, Building, RefreshCw, Handshake, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function ParticiparSection() {
  const skillsCards = [
    {
      title: "Escuta ativa",
      description: "Capacidade de ouvir atentamente e compreender as necessidades dos microempreendedores.",
      icon: Ear
    },
    {
      title: "Orientação e feedback",
      description: "Habilidade em fornecer orientações claras e feedback construtivo.",
      icon: Target
    },
    {
      title: "Empatia e sensibilidade",
      description: "Compreensão das dificuldades e desafios do empreendedorismo.",
      icon: Heart
    },
    {
      title: "Pensamento crítico",
      description: "Capacidade de analisar situações e propor soluções práticas.",
      icon: Brain
    },
    {
      title: "Conhecimento em empreendedorismo",
      description: "Entendimento sólido sobre processos de abertura e crescimento de negócios.",
      icon: Building
    },
    {
      title: "Flexibilidade",
      description: "Capacidade de adaptar o suporte às necessidades individuais de cada empreendedor.",
      icon: RefreshCw
    },
    {
      title: "Colaboração",
      description: "Agir com compaixão pelo todo e por todas, fazendo a diferença na vida dos participantes e transformando juntos as suas jornadas.",
      icon: Handshake
    },
    {
      title: "Dedicação",
      description: "Sugerimos um tempo de dedicação de 2,5 horas por mês dependendo do número de sessões.",
      icon: Lightbulb
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
          <p className="text-base text-gray-700 max-w-4xl mx-auto leading-relaxed">
            No Programa, você acompanha um microempreendedor em um processo de troca de experiências, desenvolvido para 
            oferecer suporte personalizado, para que estes empreendedores e desenvolver habilidades para crescer 
            e identificar oportunidades. Seja no abertura ou no crescimento dos negócios. Para isso, é necessário 
            se cadastrar e passar por um treinamento online, garantindo assim a sua capacidade de mentorar.
          </p>
        </div>

        {/* Grid de cards - Layout especial */}
        <div className="max-w-6xl mx-auto mb-12">
          {/* Primeira linha: Card grande + 2 cards pequenos */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Card grande azul - Header */}
            <Card className="border-2 bg-blue-900 text-white border-blue-900 shadow-md">
              <CardContent className=" bg-blue-900 text-white rounded-lg pt-6">
                <h3 className="font-bold text-white mb-11 font-heading text-2xl">As habilidades necessárias para ser mentor incluem:</h3>
              </CardContent>
            </Card>

            {/* Escuta ativa */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Ear className="w-8 h-8 text-blue-900 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">{skillsCards[0].title}:</h3>
                    <p className="text-sm text-gray-700">{skillsCards[0].description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orientação e feedback */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Target className="w-8 h-8 text-blue-900 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">{skillsCards[1].title}:</h3>
                    <p className="text-sm text-gray-700">{skillsCards[1].description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segunda linha: 3 cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Empatia e sensibilidade */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Heart className="w-8 h-8 text-blue-900 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">{skillsCards[2].title}:</h3>
                    <p className="text-sm text-gray-700">{skillsCards[2].description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pensamento crítico */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Brain className="w-8 h-8 text-blue-900 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">{skillsCards[3].title}:</h3>
                    <p className="text-sm text-gray-700">{skillsCards[3].description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conhecimento em empreendedorismo */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Building className="w-8 h-8 text-blue-900 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">{skillsCards[4].title}:</h3>
                    <p className="text-sm text-gray-700">{skillsCards[4].description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terceira linha: 3 cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Flexibilidade */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-8 h-8 text-blue-900 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">{skillsCards[5].title}:</h3>
                    <p className="text-sm text-gray-700">{skillsCards[5].description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colaboração */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Handshake className="w-8 h-8 text-blue-900 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">{skillsCards[6].title}:</h3>
                    <p className="text-sm text-gray-700">{skillsCards[6].description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dedicação */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-8 h-8 text-blue-900 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">{skillsCards[7].title}:</h3>
                    <p className="text-sm text-gray-700">{skillsCards[7].description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botão de call-to-action */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-blue-900 text-white hover:bg-blue-800 text-base font-bold px-12 py-6 rounded-full"
            onClick={() => document.querySelector('#participar')?.scrollIntoView({ behavior: 'smooth' })}
          >
            QUERO SER MENTOR
          </Button>
        </div>
      </div>
    </section>
  );
}


