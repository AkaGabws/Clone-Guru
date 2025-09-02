import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { people, peoples } from "../../constants/assets";

export function HistorySection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const historyItems = [
    {
      year: "2013",
      description: "Criamos o Guru de Negócios, um projeto voltado a oferecer mentoria para empreendedores, independentemente de sua participação em treinamentos anteriores da Aliança Empreendedora.",
      bgColor: "bg-gray-100"
    },
    {
      year: "2015",
      description: " Surge a ideia de criar uma Plataforma de Mentoria, marcando o início do desenvolvimento de um método próprio para conectar empreendedores a mentores especializados..",
      bgColor: "bg-yellow-400"
    },
    {
      year: "2016",
      description: " A mentoria passa a integrar os projetos da Aliança Empreendedora. Programas como Academia Assaí e Parceiros em Ação começam a contar com o apoio de mentores voluntários, ampliando o impacto do trabalho.",
      bgColor: "bg-gray-100"
    },
    {
      year: "2018",
      description: " Criamos o Guru de Negócios, um projeto voltado a oferecer mentoria para empreendedores, independentemente de sua participação em treinamentos anteriores da Aliança Empreendedora.",
      bgColor: "bg-gray-100"
    },
    {
      year: "2019",
      description: "Com o sucesso da primeira edição, realizamos a segunda edição do Guru de Negócios e demos início ao desenvolvimento da Plataforma de Mentoria",
      bgColor: "bg-yellow-400"
    },
    {
      year: "2020",
      description: " Lançamos oficialmente o Guru de Negócios. Uma avaliação de impacto confirmou que empreendedores participantes do programa apresentaram melhores resultados financeiros em seus negócios.",
      bgColor: "bg-gray-100"
    }
  ];

  const next = () => setCurrentIndex((i) => (i + 1) % historyItems.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + historyItems.length) % historyItems.length);

  return (
    <section id="historia" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-blue-900">
            Nossa história
          </h2>
        </div>

        {/* Timeline/Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Cards do timeline */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {historyItems.map((item, index) => (
              <div
                key={index}
                className={`${item.bgColor} p-6 rounded-lg shadow-md transition-all duration-300 ${
                  index === currentIndex ? 'scale-105' : 'scale-100'
                }`}
              >
                <div className="text-2xl font-bold text-blue-900 mb-4">
                  {item.year}
                </div>
                <p className={`text-sm leading-relaxed ${
                  item.bgColor === 'bg-yellow-400' ? 'text-blue-900' : 'text-gray-700'
                }`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Botões de navegação */}
          <button
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-full p-3 hover:bg-gray-700 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-full p-3 hover:bg-gray-700 transition-colors"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Pontos de paginação */}
          <div className="flex justify-center gap-2">
            {historyItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Seção com foto e texto lado a lado */}
        <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
          {/* Foto do grupo */}
          <div className="order-2 md:order-1">
            <img
              src={peoples}
              alt="Grupo de pessoas do Guru de Negócios"
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Texto ao lado da foto */}
          <div className="order-1 md:order-2 space-y-6">
            <h3 className="font-heading text-3xl lg:text-4xl font-bold text-blue-900">
            Como fazer um projeto com a gente
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
            Se a sua organização quer fazer parte da transformação potencializando microempreendedores através da mentoria ou engajando seus colaboradores em um projeto de voluntariado corporativo, entre em contato com nossa equipe e conheça mais o nosso trabalho! Entre em contato com a gente pelo e-mail: falecom@aliancaempreendedora.org.br
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
