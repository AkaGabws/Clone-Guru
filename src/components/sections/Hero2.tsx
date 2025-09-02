import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, Check, Zap } from "lucide-react";
import { hero2 } from "../../constants/assets";

export function Hero2() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-yellow-400 via-yellow-400 to-white text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-heading text-4xl lg:text-6xl font-bold leading-tight text-white">
                Sobre o Guru de Negócios
              </h1>
              <p className="text-xl text-black leading-relaxed">
                O Programa Guru de Negócios, uma iniciativa da Aliança Empreendedora, foi criado para oferecer suporte personalizado a empreendedores, ajudando-os a desenvolver habilidades essenciais e identificar oportunidades ao iniciar ou expandir seus negócios, promovendo a troca de experiências.
              </p>
              <p className="text-xl text-black leading-relaxed">
                Acreditamos que, com o acompanhamento de um mentor, o empreendedor tem mais chances de alcançar o sucesso. Por meio da mentoria, buscamos empoderar os participantes, melhorar sua renda e fortalecer seus negócios, tornando-os mais sustentáveis.
              </p>
              <p className="text-xl text-black leading-relaxed">
                O Guru de Negócios atua como uma ponte, conectando microempreendedores a mentores experientes de forma gratuita. Nossa plataforma mobiliza voluntários, que são cadastrados, capacitados em nossa metodologia e conectados a empreendedores para até quatro sessões de mentoria, abordando temas fundamentais de gestão e autoconhecimento.
              </p>
                
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
