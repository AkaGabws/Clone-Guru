import React from "react";
import { svgIdeia, svgMessage, svgReunion } from "../../constants/assets";

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Cadastro",
      desc: "Realize seu cadastro, descrevendo suas experiências e selecionando as habilidades nas quais você pode oferecer apoio a um empreendedor.",
      image: svgIdeia,
    },
    {
      number: 2,
      title: "Treinamento",
      desc: "Após concluir o cadastro, acesse o conteúdo de preparação necessário para começar a mentoria. Nesse treinamento você vai conhecer nossas bases metodológicas, seu papel no processo e técnicas e dicas.",
      image: svgMessage,
    },
    {
      number: 3,
      title: "Início da mentoria",
      desc: "Depois de visualizar o conteúdo de preparação, você já pode começar! Basta aguardar as solicitações de mentoria e aceitá-las.",
      image: svgReunion,
    },
  ];

  const impactNumbers = [
    { value: "1300", label: "Mentorias Realizadas" },
    { value: "8", label: "Projetos Realizados" },
    { value: "8000", label: "Horas de Mentoria" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Passos numerados */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-start">
              {/* Para o passo 2, a imagem fica acima do texto */}
              {step.number === 2 && (
                <img src={step.image} alt={step.title} className="w-full max-w-[293px] mb-4 object-contain" />
              )}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-white font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-slate-600 mb-4">{step.desc}</p>
              {step.number !== 2 && (
                <img src={step.image} alt={step.title} className="w-full max-w-[293px] object-contain" />
              )}
            </div>
            
          ))}
        </div>
        {/* Números de impacto */}
        <div className="bg-blue-900 text-white rounded-xl p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-lg font-semibold">Números de impacto:</div>
          <div className="flex flex-wrap justify-center gap-12">
            {impactNumbers.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold">{item.value}</div>
                <div className="text-sm opacity-80">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
