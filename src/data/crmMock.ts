import { CRMState } from "../types/crm";

export const crmMock: CRMState = {
  projetos: [
    { id: "p1", nome: "Mentoria Gratuita" },
    { id: "p2", nome: "Meu Negócio é Meu País" },
    { id: "p3", nome: "Negócio Raiz" },
    { id: "p4", nome: "Empreenda Mulher" },
    { id: "p5", nome: "Jovens Inovadores" },
    { id: "p6", nome: "Transforma Vidas" },
  ],
  mentores: (() => {
    const base = [
      { id: "m1", nome: "Ana Marques", email: "ana.marques@ex.com", area: "Marketing", ativo: true, projetosIds: ["p3"] },
      { id: "m2", nome: "Carlos Dias", email: "carlos.dias@ex.com", area: "Finanças", ativo: true, projetosIds: ["p1", "p2"] },
      { id: "m3", nome: "Júlia Azevedo", email: "julia.azevedo@ex.com", area: "Vendas", ativo: false, projetosIds: ["p2"] },
      { id: "m4", nome: "Bruno Silva", email: "bruno.silva@ex.com", area: "Tecnologia", ativo: true, projetosIds: ["p4", "p5"] },
      { id: "m5", nome: "Fernanda Lima", email: "fernanda.lima@ex.com", area: "Gestão", ativo: false, projetosIds: ["p6"] },
      { id: "m6", nome: "Rafael Torres", email: "rafael.torres@ex.com", area: "Marketing", ativo: true, projetosIds: ["p2", "p5"] },
      { id: "m7", nome: "Patrícia Souza", email: "patricia.souza@ex.com", area: "Vendas", ativo: true, projetosIds: ["p1", "p4"] },
    ];

    const areas = ["Marketing", "Finanças", "Vendas", "Tecnologia", "Gestão", "RH", "Operações", "Design"];
    const projetosIds = ["p1","p2","p3","p4","p5","p6"];
    const firstNames = ["Lucas","Mariana","Gabriel","Beatriz","Felipe","Camila","Eduardo","Isabela","Thiago","Laura","André","Mariana","Roberto","Bianca","Diego","Carolina","Gustavo","Mariana","Paulo","Natália"];
    const lastNames = ["Almeida","Barbosa","Cardoso","Dias","E Silva","Ferreira","Gomes","Henrique","Ibrahim","Jardim","Klein","Leal","Medeiros","Nunes","Oliveira","Pereira","Queiroz","Ribeiro","Santos","Teixeira"];

    const generated: any[] = [];

    // gera 80 mentores adicionais (m8..m87) com nomes gerados realisticamente
    for (let i = 8; i <= 87; i++) {
      const id = `m${i}`;
      const fn = firstNames[(i * 3) % firstNames.length];
      const ln = lastNames[(i * 5 + 1) % lastNames.length];
      const nome = `${fn} ${ln}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase().replace(/\s+/g, "")}${i}@example.com`;
      const area = areas[i % areas.length];
      const ativo = i % 4 !== 0; // ~75% ativos
      const p1 = projetosIds[i % projetosIds.length];
      const p2 = projetosIds[(i + 2) % projetosIds.length];
      const projetosFor = i % 3 === 0 ? [p1] : [p1, p2];

      generated.push({
        id,
        nome,
        email,
        area,
        ativo,
        projetosIds: projetosFor,
      });
    }

    return base.concat(generated);
  })(),

  // gera 120 mentorias com datas realistas entre 2025-01-01 e 2025-11-18
  mentorias: (() => {
    const statuses = ["nova", "ativa", "concluida", "cancelada", "expirada", "pausada"];
    const projetosIds = ["p1","p2","p3","p4","p5","p6"];
    // usa todos os mentores gerados (m1..m87)
    const mentoresIds = Array.from({ length: 87 }, (_, k) => `m${k + 1}`);
    const itens: any[] = [];
    const start = new Date("2025-01-01T00:00:00.000Z").getTime();
    const end = new Date("2025-11-18T23:59:59.000Z").getTime();

    // determinístico simples para simular "aleatório" por índice
    function pseudoRandom(seed: number) {
      // LCG parameters
      const a = 1664525, c = 1013904223, m = 2 ** 32;
      let x = (seed * 9301 + 49297) >>> 0;
      x = (a * x + c) % m;
      return x / m;
    }

    const firstNames = ["Ana","Bruno","Carla","Diego","Elisa","Felipe","Gabriela","Hugo","Isabela","João","Karen","Lucas","Mariana","Nico","Olga","Pedro","Quésia","Rafael","Sofia","Thiago","Vanessa","Wesley","Yara","Zeca"];
    const lastNames = ["Almeida","Barbosa","Costa","Dias","Esteves","Faria","Guedes","Henrique","Ibrahim","Jardim","Klein","Lopes","Mendes","Nogueira","Oliveira","Pereira","Queiroz","Ribeiro","Silva","Teixeira"];

    for (let i = 1; i <= 120; i++) {
      const id = `s${i}`;
      const projetoId = projetosIds[(i - 1) % projetosIds.length];

      // status com pesos via pseudoRandom
      const r = Math.floor(pseudoRandom(i) * 100);
      let status = "ativa";
      if (r < 10) status = "nova";
      else if (r < 55) status = "ativa";
      else if (r < 70) status = "pausada";
      else if (r < 82) status = "concluida";
      else if (r < 92) status = "cancelada";
      else status = "expirada";

      // Mentorias novas e expiradas não devem ter mentor atribuído
      // (novas: ainda não atribuídas; expiradas: nenhum mentor aceitou)
      const hasMentor = status !== "nova" && status !== "expirada" && i % 5 !== 0;
      // escolhe mentor entre todos os mentores gerados
      const mentorId = hasMentor ? mentoresIds[(i * 7) % mentoresIds.length] : undefined;

      // progresso baseado no status
      let progresso = 0;
      if (status === "concluida") progresso = 100;
      else if (status === "ativa") progresso = Math.min(90, Math.floor(pseudoRandom(i + 10) * 90));
      else if (status === "pausada") progresso = Math.min(60, Math.floor(pseudoRandom(i + 20) * 60));
      else if (status === "cancelada") progresso = Math.min(30, Math.floor(pseudoRandom(i + 30) * 30));

      // datas entre start .. end
      const createdTs = start + Math.floor(pseudoRandom(i + 40) * (end - start));
      const updatedTs = createdTs + Math.floor(pseudoRandom(i + 50) * (end - createdTs));
      const created = new Date(createdTs).toISOString();
      const updated = new Date(updatedTs).toISOString();

      // nome empreendedor mais realista
      const fn = firstNames[(i * 3) % firstNames.length];
      const ln = lastNames[(i * 5 + 1) % lastNames.length];
      const empreendedor = `${fn} ${ln}`;

      // Status de acompanhamento baseado no status e índice
      const statusAcompanhamentos: any[] = [
        "mentoria_ocorrendo",
        "mentoria_nao_iniciada",
        "mentoria_parada",
        "aguardando_retorno_empreendedor",
        "aguardando_retorno_mentor",
        "mentor_empreendedor_nao_responde",
        "mentoria_finalizada",
        "mentoria_cancelada",
        "empreendedor_desistiu",
        "mentoria_atrasada",
      ];
      
      // Define status de acompanhamento baseado no status da mentoria
      let statusAcompanhamento: string | undefined;
      if (status === "ativa") {
        statusAcompanhamento = statusAcompanhamentos[i % 6]; // Varia entre os primeiros 6
      } else if (status === "concluida") {
        statusAcompanhamento = "mentoria_finalizada";
      } else if (status === "cancelada") {
        statusAcompanhamento = i % 2 === 0 ? "mentoria_cancelada" : "empreendedor_desistiu";
      } else if (status === "nova") {
        statusAcompanhamento = "mentoria_nao_iniciada";
      } else if (status === "pausada") {
        statusAcompanhamento = "mentoria_parada";
      }

      // Dados de acompanhamento mockados - mais ricos e realistas
      const temAcompanhamento = i % 5 !== 0; // ~80% têm acompanhamento
      const numEncontrosAcompanhamento = temAcompanhamento && hasMentor 
        ? Math.floor(pseudoRandom(i + 100) * 12) + 1 
        : undefined;
      
      // Observações ricas e variadas para empreendedores
      const observacoesEmpreendedorLista = [
        `Empreendedor muito motivado e engajado. Implementou todas as sugestões do último encontro com sucesso.`,
        `Demonstra dificuldade em organizar o tempo para aplicar as estratégias. Necessita de acompanhamento mais frequente.`,
        `Teve uma melhora significativa nas vendas após aplicar técnicas de precificação discutidas na mentoria.`,
        `Está passando por momento difícil pessoal, mas mantém o negócio funcionando. Sugerir mais flexibilidade.`,
        `Muito receptivo às ideias, porém precisa de mais apoio na área financeira. Considerar workshops adicionais.`,
        `Empreendedor já possui boa base de conhecimento. Focar em estratégias avançadas de crescimento.`,
        `Relata que a mentoria tem sido transformadora. Conseguiu seu primeiro cliente grande após implementar MVP.`,
        `Precisa de mais suporte em marketing digital. Tem dificuldade com redes sociais.`,
        `Excelente progresso! Dobrou o faturamento no último mês. Agora quer expandir para delivery.`,
        `Empreendedor tímido, mas com muito potencial. Trabalhar autoconfiança e técnicas de venda.`,
        `Apresentou o pitch para investidores. Recebeu feedback positivo mas precisa refinar proposta de valor.`,
        `Teve problemas com fornecedor e precisou pausar operações. Retornando gradualmente.`,
        `Está considerando contratar primeiro funcionário. Discutir aspectos legais e financeiros.`,
        `Lançou produto novo com sucesso. Vendas superaram expectativas. Manter monitoramento.`,
        `Enfrenta concorrência forte na região. Trabalhando diferenciação e proposta única de valor.`,
      ];
      
      // Observações ricas e variadas para mentores
      const observacoesMentorLista = [
        `${new Date(updated).toLocaleDateString('pt-BR')}: Encontro produtivo. Empreendedor demonstrou evolução significativa desde o início. Próximos passos: definir metas de vendas para o mês.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Notei que precisa de mais apoio na gestão financeira. Enviei planilhas de controle. Agendar próximo encontro focado em fluxo de caixa.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Sessão focada em marketing. Criamos calendário de conteúdo para redes sociais. Empreendedor muito animado com as novas estratégias.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Discutimos precificação. Identificamos que estava vendendo abaixo do mercado. Ajustamos preços e criamos pacotes promocionais.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Mentoria seguindo conforme planejado. Empreendedor cumpriu todas as tarefas. Próximo passo: análise de concorrência.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Encontro de alinhamento. Revisamos metas e ajustamos cronograma. Empreendedor precisou de mais tempo para implementar mudanças.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Sessão prática de vendas. Simulamos atendimento ao cliente. Identificamos pontos de melhoria na abordagem.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Revisamos plano de negócios. Atualizamos projeções financeiras com dados reais dos últimos 3 meses.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Foco em liderança. Empreendedor vai contratar primeiro funcionário. Discutimos processo seletivo e integração.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Analisamos resultados do mês. Vendas cresceram 30%. Definimos estratégias para manter o crescimento.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Sessão de resolução de problemas. Empreendedor enfrentou crise com cliente. Trabalhamos gestão de conflitos.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Encontro de celebração! Empreendedor alcançou primeira meta importante. Definimos próximos desafios.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Precisamos acompanhar mais de perto. Empreendedor está sobrecarregado. Sugerir ferramentas de produtividade.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Mentoria entrando na reta final. Preparando empreendedor para caminhar sozinho. Foco em autonomia.`,
        `${new Date(updated).toLocaleDateString('pt-BR')}: Ótimo progresso! Empreendedor está pronto para próximo nível. Recomendo participação em programa avançado.`,
      ];
      
      const observacaoEmpreendedor = temAcompanhamento && i % 2 === 0
        ? observacoesEmpreendedorLista[i % observacoesEmpreendedorLista.length]
        : undefined;
      const observacaoMentor = temAcompanhamento && i % 2 !== 0
        ? observacoesMentorLista[i % observacoesMentorLista.length]
        : undefined;

      // Nomes dos funcionários que fazem os registros de acompanhamento
      const funcionariosAcompanhamento = [
        "Leonardo", "Suellen", "Jheni"
      ];
      
      // Gera dados de rastreamento de quem fez os registros
      const funcionarioIdx = i % funcionariosAcompanhamento.length;
      const funcionarioObsEmp = funcionariosAcompanhamento[(i + 1) % funcionariosAcompanhamento.length];
      const funcionarioObsMentor = funcionariosAcompanhamento[(i + 3) % funcionariosAcompanhamento.length];
      const funcionarioStatus = funcionariosAcompanhamento[(i + 5) % funcionariosAcompanhamento.length];
      
      // Datas de registro (variando para parecer realista)
      const dataRegistroBase = new Date(updatedTs);
      const dataObsEmp = new Date(dataRegistroBase);
      dataObsEmp.setDate(dataObsEmp.getDate() - Math.floor(pseudoRandom(i + 200) * 7));
      const dataObsMentor = new Date(dataRegistroBase);
      dataObsMentor.setDate(dataObsMentor.getDate() - Math.floor(pseudoRandom(i + 210) * 5));
      const dataStatus = new Date(dataRegistroBase);
      dataStatus.setDate(dataStatus.getDate() - Math.floor(pseudoRandom(i + 220) * 3));

      itens.push({
        id,
        empreendedor,
        negocio: i % 3 === 0 ? `Negócio ${i}` : (i % 4 === 0 ? "—" : `Comércio ${i}`),
        projetoId,
        status,
        mentorId,
        desafio: `Desafio número ${i}: melhorar ${i % 7 === 0 ? 'finanças' : i % 5 === 0 ? 'marketing' : 'organização'} do negócio.`,
        dataCriacaoISO: created,
        ultimaAtualizacaoISO: updated,
        progresso,
        statusAcompanhamento,
        numEncontrosAcompanhamento,
        observacaoEmpreendedor,
        observacaoMentor,
        // Rastreamento de quem fez as alterações
        ultimoRegistroPor: funcionariosAcompanhamento[funcionarioIdx],
        ultimoRegistroDataISO: updated,
        statusAcompanhamentoPor: statusAcompanhamento ? funcionarioStatus : undefined,
        statusAcompanhamentoDataISO: statusAcompanhamento ? dataStatus.toISOString() : undefined,
        observacaoEmpreendedorPor: observacaoEmpreendedor ? funcionarioObsEmp : undefined,
        observacaoEmpreendedorDataISO: observacaoEmpreendedor ? dataObsEmp.toISOString() : undefined,
        observacaoMentorPor: observacaoMentor ? funcionarioObsMentor : undefined,
        observacaoMentorDataISO: observacaoMentor ? dataObsMentor.toISOString() : undefined,
      });
    }

    // preserva caso especial s2 / relatos
    if (itens[1]) {
      itens[1] = {
        ...itens[1],
        id: "s2",
        empreendedor: "Francisco Oceano",
        projetoId: "p1",
        status: "ativa",
        mentorId: "m2",
        desafio: "Novo álbum parado há anos.",
        progresso: 60,
      };
    }

    return itens;
  })(),

  relatos: (() => {
    const titulos = [
      "Primeira sessão",
      "Alinhamento inicial",
      "Diagnóstico do negócio",
      "Análise de mercado",
      "Estratégia de vendas",
      "Marketing digital",
      "Redes sociais",
      "Gestão financeira",
      "Fluxo de caixa",
      "Precificação",
      "Plano de negócios",
      "Proposta de valor",
      "Público-alvo",
      "Canais de venda",
      "Atendimento ao cliente",
      "Fidelização",
      "Crescimento",
      "Expansão",
      "Checkpoint semanal",
      "Revisão de metas",
      "Resolução de problemas",
      "Feedback e ajustes",
      "Preparação para pitch",
      "Contratação de funcionário",
      "Legalização do negócio",
      "Parcerias estratégicas",
      "Novos produtos",
      "Análise de resultados",
      "Celebração de conquistas",
      "Encerramento",
    ];

    const textos = [
      "Realizamos o diagnóstico inicial do negócio. Identificamos pontos fortes na qualidade do produto e oportunidades de melhoria na gestão financeira. Empreendedor muito receptivo às sugestões.",
      "Mapeamos o público-alvo e criamos personas. Definimos estratégias de comunicação específicas para cada segmento identificado.",
      "Análise detalhada da concorrência. Identificamos 5 concorrentes diretos e 3 indiretos. Criamos matriz comparativa e definimos diferenciais competitivos.",
      "Sessão focada em precificação. Revisamos custos fixos e variáveis, margem de contribuição e ponto de equilíbrio. Ajustamos preços de 8 produtos.",
      "Criamos calendário de conteúdo para Instagram e Facebook. Definimos linha editorial, frequência de posts e tipos de conteúdo (educativo, inspiracional, promocional).",
      "Trabalhamos fluxo de caixa. Empreendedor agora controla entradas e saídas diariamente. Implementamos planilha de controle financeiro.",
      "Desenvolvemos pitch de 3 minutos para captação de clientes. Praticamos técnicas de apresentação e trabalhamos linguagem corporal.",
      "Mapeamos jornada do cliente. Identificamos 3 pontos de atrito no processo de compra. Criamos plano de ação para melhorias.",
      "Sessão de brainstorming para novos produtos/serviços. Listamos 15 ideias e priorizamos 3 para desenvolvimento imediato.",
      "Revisamos plano de negócios. Atualizamos análise SWOT e definimos metas SMART para os próximos 6 meses.",
      "Trabalhamos técnicas de venda consultiva. Simulamos atendimentos e identificamos oportunidades de upsell e cross-sell.",
      "Discutimos estratégias de fidelização. Criamos programa de pontos e definimos benefícios para clientes recorrentes.",
      "Analisamos métricas do mês anterior. Vendas cresceram 25%! Identificamos canais mais efetivos e realocamos investimentos.",
      "Sessão de resolução de problemas. Cliente insatisfeito gerou crise nas redes sociais. Trabalhamos gestão de crise e comunicação.",
      "Preparação para contratação do primeiro funcionário. Revisamos aspectos legais, definimos perfil da vaga e critérios de seleção.",
      "Exploramos oportunidades de parceria. Identificamos 5 negócios complementares para colaborações estratégicas.",
      "Desenvolvemos proposta de valor única. Criamos slogan e mensagens-chave para comunicação da marca.",
      "Trabalhamos gestão do tempo. Empreendedor estava sobrecarregado. Implementamos matriz de Eisenhower e rotina produtiva.",
      "Sessão focada em delivery e vendas online. Configuramos conta no iFood e criamos loja no Instagram Shopping.",
      "Discutimos legalização do negócio. Apresentamos opções de formalização (MEI, ME) e próximos passos para regularização.",
      "Análise de fornecedores. Mapeamos 10 fornecedores, negociamos prazos e conseguimos redução de 15% nos custos.",
      "Trabalhamos identidade visual. Definimos cores, tipografia e aplicações da marca. Empreendedor ficou muito satisfeito.",
      "Sessão sobre gestão de estoque. Implementamos controle de entrada e saída, ponto de reposição e giro de estoque.",
      "Exploramos canais de venda alternativos. Cadastramos em 3 marketplaces e participamos de grupo de vendas local.",
      "Celebramos conquistas! Empreendedor bateu meta de faturamento pela primeira vez. Definimos próximos desafios.",
      "Mentoria focada em autoconhecimento. Trabalhamos forças, fraquezas e estilo de liderança do empreendedor.",
      "Discutimos expansão do negócio. Analisamos viabilidade de segunda unidade e franquias.",
      "Sessão de follow-up. Empreendedor implementou 80% das ações acordadas. Ajustamos cronograma para pendências.",
      "Trabalhamos apresentação para investidor. Revisamos deck, projeções financeiras e modelo de negócio.",
      "Encerramento da mentoria. Revisamos toda a jornada, conquistas e aprendizados. Empreendedor muito grato!",
    ];

    const horarios = ["09:00", "10:00", "10:30", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
    const duracoes = [30, 45, 60, 60, 60, 90, 90, 120];

    const relatosGerados: any[] = [];
    let idCounter = 1;

    // Gera relatos para as primeiras 60 mentorias ativas (com mentor)
    for (let mentoriaIdx = 1; mentoriaIdx <= 80; mentoriaIdx++) {
      const mentoriaId = `s${mentoriaIdx}`;
      // Cada mentoria tem entre 2 e 8 encontros
      const numEncontros = 2 + (mentoriaIdx % 7);
      const mentorId = `m${(mentoriaIdx * 7) % 87 + 1}`;
      
      // Data base para os encontros desta mentoria
      const baseDate = new Date(2025, 0, 15 + mentoriaIdx);
      
      for (let encontro = 0; encontro < numEncontros; encontro++) {
        const encontroDate = new Date(baseDate);
        encontroDate.setDate(baseDate.getDate() + (encontro * 7)); // Um encontro por semana
        const horario = horarios[(encontro + mentoriaIdx) % horarios.length];
        const [hora, minuto] = horario.split(':').map(Number);
        encontroDate.setHours(hora, minuto, 0, 0);

        // Evita datas futuras a Dezembro 2025
        if (encontroDate > new Date(2025, 11, 3)) continue;

        const titulo = encontro === 0 
          ? titulos[0] // Primeira sessão
          : encontro === numEncontros - 1 && mentoriaIdx % 4 === 0
            ? titulos[titulos.length - 1] // Encerramento
            : titulos[(encontro + mentoriaIdx) % (titulos.length - 2) + 1]; // Outros títulos

        const texto = textos[(encontro + mentoriaIdx) % textos.length];
        const duracao = duracoes[(encontro + mentoriaIdx) % duracoes.length];

        relatosGerados.push({
          id: `r${idCounter}`,
          mentoriaId,
          mentorId: mentoriaIdx % 5 !== 0 ? mentorId : undefined,
          dataISO: encontroDate.toISOString(),
          dataEncontroISO: encontroDate.toISOString(),
          duracaoMinutos: duracao,
          titulo,
          texto,
        });

        idCounter++;
      }
    }

    // Preserva alguns relatos especiais para mentoria s2 (Francisco Oceano)
    const relatosS2 = [
      { id: `r${idCounter++}`, mentoriaId: "s2", mentorId: "m2", dataISO: "2025-08-21T14:00:00.000Z", dataEncontroISO: "2025-08-21T14:00:00.000Z", duracaoMinutos: 60, titulo: "Checkpoint criativo", texto: "Definimos backlog das próximas 2 semanas focando no novo álbum. Francisco apresentou 5 faixas em desenvolvimento." },
      { id: `r${idCounter++}`, mentoriaId: "s2", mentorId: "m2", dataISO: "2025-08-28T10:30:00.000Z", dataEncontroISO: "2025-08-28T10:30:00.000Z", duracaoMinutos: 90, titulo: "Estratégia de lançamento", texto: "Validação de público-alvo e proposta de valor para o álbum. Criamos cronograma de lançamento com teasers e single." },
      { id: `r${idCounter++}`, mentoriaId: "s2", mentorId: "m2", dataISO: "2025-09-04T14:00:00.000Z", dataEncontroISO: "2025-09-04T14:00:00.000Z", duracaoMinutos: 60, titulo: "Marketing musical", texto: "Desenvolvemos estratégia de divulgação em plataformas de streaming. Configuramos Spotify for Artists e planejamos playlist pitching." },
      { id: `r${idCounter++}`, mentoriaId: "s2", mentorId: "m2", dataISO: "2025-09-11T10:00:00.000Z", dataEncontroISO: "2025-09-11T10:00:00.000Z", duracaoMinutos: 75, titulo: "Parcerias e collabs", texto: "Mapeamos artistas para possíveis parcerias. Francisco vai contatar 3 produtores para features no álbum." },
      { id: `r${idCounter++}`, mentoriaId: "s2", mentorId: "m2", dataISO: "2025-09-18T15:00:00.000Z", dataEncontroISO: "2025-09-18T15:00:00.000Z", duracaoMinutos: 60, titulo: "Monetização", texto: "Discutimos formas de monetização além do streaming: shows, merch, licenciamento. Francisco animado com as possibilidades." },
      { id: `r${idCounter++}`, mentoriaId: "s2", mentorId: "m2", dataISO: "2025-09-25T14:00:00.000Z", dataEncontroISO: "2025-09-25T14:00:00.000Z", duracaoMinutos: 90, titulo: "Review do single", texto: "Primeiro single pronto! Ouvimos juntos e demos feedback. Definimos data de lançamento para outubro." },
      { id: `r${idCounter++}`, mentoriaId: "s2", mentorId: "m2", dataISO: "2025-10-02T10:30:00.000Z", dataEncontroISO: "2025-10-02T10:30:00.000Z", duracaoMinutos: 60, titulo: "Preparação de lançamento", texto: "Criamos press release e lista de imprensa. Francisco gravou conteúdo para redes sociais." },
      { id: `r${idCounter++}`, mentoriaId: "s2", mentorId: "m2", dataISO: "2025-10-09T14:00:00.000Z", dataEncontroISO: "2025-10-09T14:00:00.000Z", duracaoMinutos: 45, titulo: "Análise pós-lançamento", texto: "Single lançado! 5000 streams na primeira semana. Analisamos métricas e planejamos próximos passos." },
    ];

    return [...relatosGerados, ...relatosS2];
  })(),
  filtro: { status: "todas", mentorId: "todos", projetoId: "todos", busca: "" },
};
