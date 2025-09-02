import React from "react";
import { people, persons } from "../../constants/assets";

export function AboutSection() {
  const impactNumbers = [
    { value: "82%", label: "mulheres" },
    { value: "63%", label: "negras e negros" },
    { value: "74%", label: "renda de até 2 salários mínimos" },
  ];

  return (
    <section id="sobre" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Banner amarelo com números de impacto */}
        <div className="bg-yellow-400 text-blue-900 rounded-xl p-6 md:p-10 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Lado esquerdo - Título e números */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Perfil das pessoas apoiadas</h2>
              <div className="space-y-4">
                {impactNumbers.map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                    <span className="font-semibold">{item.value} {item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Lado direito - Texto descritivo */}
            <div className="space-y-4 text-sm">
              <p>
                Os micro e pequenos empreendedores desempenham um papel crucial na economia brasileira, representando 99% das empresas no país e gerando 52% dos empregos formais. Além disso, eles contribuem significativamente para o desenvolvimento econômico, sendo responsáveis por 30% do PIB nacional, com potencial para impulsionar ainda mais a geração de riqueza.
              </p>
              <p>
                Entre os microempreendedores apoiados pelo Guru de Negócios, a maioria é composta por mulheres, representando 88% do total. Além disso, 63% se identificam como negros, reforçando a importância de apoiar a diversidade racial no empreendedorismo. Jovens também estão fortemente representados, com 48% dos empreendedores tendo até 29 anos. Por fim, 74% dos apoiados possuem uma renda de até dois salários mínimos, destacando o impacto social da iniciativa em promover a inclusão e o fortalecimento de negócios em situação de vulnerabilidade econômica.
              </p>
            </div>
          </div>
        </div>

        {/* Foto embaixo */}
        <div className="flex justify-center">
          <img 
            src={people} 
            alt="Pessoas em mentoria" 
            className="rounded-xl w-full max-w-4xl object-cover shadow-lg" 
          />
        </div>
      </div>
    </section>
  );
}



