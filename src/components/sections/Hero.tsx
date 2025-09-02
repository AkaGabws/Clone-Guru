import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, Check, Zap } from "lucide-react";
import { hero } from "../../constants/assets";

export function Hero() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-blue-900 via-blue-700 to-yellow-400 text-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
          
              <h1 className="font-heading text-4xl lg:text-6xl font-bold leading-tight text-white">
                Seja uma pessoa mentora e transforme negócios
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                No Programa de Mentoria Guru de Negócios da Aliança Empreendedora, conectamos mentores e mentoras voluntários com microempreendedores que precisam de apoio e suporte para potencializar seus negócios. Através de uma orientação personalizada e focada, buscamos fortalecer cada passo da jornada empreendedora, ajudando-os a superar desafios e a desenvolver as habilidades essenciais para o crescimento e sucesso.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 text-lg px-8" onClick={() => document.querySelector('#participar')?.scrollIntoView({ behavior: 'smooth' })}>
                Quero ser mentor(a)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-white/90">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-yellow-400" />
                <span>Mentorias 100% voluntárias</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-yellow-400" />
                <span>Impacto real em pequenos negócios</span>
              </div>
             <div className="flex justify-center">
                <img 
                  src={hero}
                  alt="hero"
                  className="hidden md:block absolute right-[200px] top-1/2 -translate-y-1/3 w-[520px] h-[520px] rounded-full bg-yellow-300 z-0" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </section>
  );
}


