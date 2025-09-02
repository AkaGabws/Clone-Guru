import React from "react";
import { logoGuru, logoAEWhite, aliancaEmpreendedoraSelos, seloDireitosHumanos, mitSolveWhite, odsWhiteLogo } from "../../constants/assets";

export function Footer() {
  return (
    <footer id="contato" className="bg-gray-800 text-white">
      {/* Conteúdo principal do footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Coluna 1: REALIZAÇÃO */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase">REALIZAÇÃO:</h3>
            <div className="space-y-4">
              {/* Logo do Guru */}
              <img src={logoGuru} alt="Guru de Negócios" className="h-12 w-auto" />
              
              {/* Logo Aliança Empreendedora */}
              <img src={logoAEWhite} alt="Aliança Empreendedora" className="h-12 w-auto" />
            </div>
          </div>

          {/* Coluna 2: ENDEREÇOS */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase">ENDEREÇOS:</h3>
            <div className="space-y-4">
              <div>
                <div className="font-bold mb-2">Curitiba - Matriz</div>
                <div className="text-sm space-y-1">
                  <div>Alameda Júlia Costa, 362</div>
                  <div>Casa 2 - Mercês - Curitiba - PR</div>
                  <div>CEP: 80410-078</div>
                </div>
              </div>
              <div>
                <div className="font-bold mb-2">São Paulo - Filial</div>
                <div className="text-sm space-y-1">
                  <div>Rua Capitão Cavalcanti, 38</div>
                  <div>Vila Mariana, São Paulo/SP</div>
                  <div>CEP: 04017-000</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 3: CONTATOS */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase">CONTATOS:</h3>
            <div className="space-y-4">
              <a href="mailto:falecom@aliancaempreendedora.org.br" className="text-white underline hover:text-yellow-400 transition-colors">
                Envie-nos um e-mail
              </a>
            </div>
          </div>

          {/* Coluna 4: LINKS PRINCIPAIS */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase">LINKS PRINCIPAIS:</h3>
            <div className="space-y-2">
              <a href="#" className="block text-white underline hover:text-yellow-400 transition-colors">Início</a>
              <a href="#" className="block text-white underline hover:text-yellow-400 transition-colors">Mentorias</a>
              <a href="#" className="block text-white underline hover:text-yellow-400 transition-colors">Quem somos?</a>
            </div>
          </div>

          {/* Coluna 5: PRÊMIOS E SELOS */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg uppercase">PRÊMIOS E SELOS:</h3>
            <div className="space-y-4">
              {/* MIT SOLVE */}
              <img src={mitSolveWhite} alt="MIT SOLVE" className="h-8 w-auto" />

              {/* ODS */}
              <img src={odsWhiteLogo} alt="Objetivos de Desenvolvimento Sustentável" className="h-8 w-auto" />

              {/* Selo Direitos Humanos */}
              <img src={seloDireitosHumanos} alt="Selo Municipal de Direitos Humanos" className="h-8 w-auto" />

              {/* Selos circulares */}
              <div className="grid grid-cols-3 gap-2">
                <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center text-center">
                  <div className="text-xs">
                    <div>MELHORES</div>
                    <div>ONGS</div>
                    <div>2023</div>
                  </div>
                </div>
                <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center text-center">
                  <div className="text-xs">
                    <div>MELHORES</div>
                    <div>ONGS</div>
                    <div>2022</div>
                  </div>
                </div>
                <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center text-center">
                  <div className="text-xs">
                    <div>✅</div>
                    <div>VALIDADO</div>
                    <div>INSTITUTO</div>
                    <div>DOAR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          Nós acreditamos que todos e todas podem empreender © 2024 Tamo Junto - Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}


