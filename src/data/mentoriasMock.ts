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
      desafios: 'TESTE',
      sobreNegocio: 'TESTE',
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

