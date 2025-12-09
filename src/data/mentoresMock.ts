/**
 * Dados Mock para Mentores
 * 
 * Use este arquivo como referência para adicionar campos adicionais aos mentores
 */

export const mentoresMockExemplo = [
  {
    id: "mentor-1",
    nome: "Gabriel Silva",
    email: "gabriel@aliancaempreendedora.org.br",
    telefone: "94084277",
    ddd: "11",
    area: "Marketing",
    ativo: true,
    fotoUrl: "",
    
    // Dados Pessoais
    genero: "Homem",
    cpf: "564.887.458-84",
    
    // Localização
    cidade: "São Paulo",
    estado: "SP",
    cep: "08431-150",
    
    // Áreas de Interesse (Competências)
    competencias: [
      "Marketing/Vendas",
      "Finanças",
      "Ofertas de Crédito",
      "Formalização/MEI",
      "Comportamento Empreendedor",
      "Bem-estar",
      "Precificação"
    ],
    
    // Principais Áreas de Conhecimento (top 3)
    areasConhecimento: [
      "Marketing Digital e Redes Sociais",
      "Gestão Financeira e Planejamento",
      "Desenvolvimento de Lideranças"
    ],
    
    // Motivação para ser Mentor
    motivacao: "Compartilhar Conhecimento e Experiências",
    
    // Experiência Profissional
    experiencia: "Trabalho há 10 anos com marketing digital e empreendedorismo social. Atuo como consultor de negócios e já ajudei mais de 50 empreendedores a estruturarem suas empresas. Experiência em gestão de projetos, marketing de conteúdo e vendas online.",
    
    // Bio
    bio: "Especialista em marketing digital com foco em pequenas e médias empresas. Apaixonado por empreendedorismo social e desenvolvimento de comunidades."
  },
  {
    id: "mentor-2",
    nome: "Maria Santos",
    email: "maria.santos@email.com",
    telefone: "98765432",
    ddd: "21",
    area: "Finanças",
    ativo: true,
    
    genero: "Mulher",
    cpf: "123.456.789-00",
    
    cidade: "Rio de Janeiro",
    estado: "RJ",
    cep: "20000-000",
    
    competencias: [
      "Finanças",
      "Ofertas de Crédito",
      "Comportamento Empreendedor"
    ],
    
    areasConhecimento: [
      "Gestão Financeira",
      "Análise de Investimentos",
      "Planejamento Estratégico"
    ],
    
    motivacao: "Contribuir para o Desenvolvimento e no empoderamento de Pessoas",
    
    experiencia: "15 anos de experiência em consultoria financeira para PMEs. Formada em Administração com MBA em Finanças. Já acompanhei mais de 100 empresas em processos de reestruturação financeira.",
    
    bio: "Consultora financeira especializada em pequenas empresas e empreendedorismo."
  },
  {
    id: "mentor-3",
    nome: "João Pedro",
    email: "joao.pedro@email.com",
    telefone: "91234567",
    ddd: "11",
    area: "Tecnologia",
    ativo: true,
    
    genero: "Homem",
    cpf: "987.654.321-00",
    
    cidade: "Curitiba",
    estado: "PR",
    cep: "80000-000",
    
    competencias: [
      "Marketing/Vendas",
      "Formalização/MEI",
      "Precificação"
    ],
    
    areasConhecimento: [
      "Desenvolvimento de Software",
      "Transformação Digital",
      "Metodologias Ágeis"
    ],
    
    motivacao: "Gerar impacto social e positivo através do empreendedorismo",
    
    experiencia: "Desenvolvedor e empreendedor tech há 8 anos. Fundei duas startups e atuo como mentor em aceleradoras. Experiência em desenvolvimento de produtos digitais e gestão de equipes de tecnologia.",
    
    bio: "Empreendedor de tecnologia focado em soluções para negócios de impacto social."
  },
  {
    id: "mentor-4",
    nome: "Ana Carolina",
    email: "ana.carolina@email.com",
    telefone: "99887766",
    ddd: "85",
    area: "Gestão",
    ativo: false,
    
    genero: "Mulher",
    cpf: "456.789.123-00",
    
    cidade: "Fortaleza",
    estado: "CE",
    cep: "60000-000",
    
    competencias: [
      "Comportamento Empreendedor",
      "Bem-estar",
      "Desenvolvimento Pessoal"
    ],
    
    areasConhecimento: [
      "Gestão de Pessoas",
      "Coaching Empresarial",
      "Cultura Organizacional"
    ],
    
    motivacao: "Desenvolvimento Pessoal, Profissional e liderança",
    
    experiencia: "Coach executiva há 12 anos. Formada em Psicologia com especialização em Gestão de Pessoas. Trabalhei em grandes empresas antes de me dedicar ao coaching e mentoria de empreendedores.",
    
    bio: "Coach e mentora especializada em desenvolvimento de lideranças e gestão de pessoas."
  }
];

/**
 * OPÇÕES PADRÃO BASEADAS NAS IMAGENS
 */

export const OPCOES_GENERO = [
  "Homem",
  "Mulher",
  "Outro",
  "Prefiro não informar"
];

export const OPCOES_MOTIVACAO = [
  "Ampliar Rede de Contatos, Conexões e Network",
  "Compartilhar Conhecimento e Experiências",
  "Contribuir para o Desenvolvimento e no empoderamento de Pessoas",
  "Desenvolvimento Pessoal, Profissional e liderança",
  "Empoderamento Feminino e Igualdade de Gênero",
  "Fomento e Expansão de Negócios Locais e comunitários",
  "Gerar impacto social e positivo através do empreendedorismo",
  "Missão, Propósito de Vida e Realização Pessoal",
  "Promover crescimento sustentável nos negócios"
];

export const AREAS_INTERESSE = [
  "Marketing/Vendas",
  "Finanças",
  "Ofertas de Crédito",
  "Formalização/MEI",
  "Comportamento Empreendedor",
  "Bem-estar",
  "Precificação"
];

export const ESTADOS_BRASIL = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

