import { Mentoria } from '../types/mentoria';

export const mentoriasMock: Mentoria[] = [
  {
    id: '1',
    titulo: 'Mentoria Gratuita > Marketing / Vendas',
    iniciadoEm: '2025-08-19',
    metaMinutos: 210,
    status: 'ativa',
    empreendedor: {
      nome: 'Gabriel Marques Alves',
      desafios: 'Preciso melhorar a captação de novos clientes e fortalecer a presença digital do meu negócio',
      sobreNegocio: 'Trabalho com serviços de marketing e vendas para pequenos negócios, oferecendo consultoria e suporte na criação de estratégias comerciais',
      areaAtuacao: 'Serviço',
      setor: 'Vendas/Marketing',
      inscritoDesde: '2025-05-23',
      whatsapp: '5511948464703',
      cursosCompletados: [
        {
          texto: 'Gestão de Negócios para Costureiras de Reparo',
          url: 'https://tamojunto.aliancaempreendedora.org.br/cursos/gestao-de-negocios-para-costureiras-de-reparo',
        },
      ],
      cursosEmAndamento: [],
    },
  },
];

