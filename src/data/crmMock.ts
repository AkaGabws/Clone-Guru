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
      const hasMentor = i % 5 !== 0;
      // escolhe mentor entre todos os mentores gerados
      const mentorId = hasMentor ? mentoresIds[(i * 7) % mentoresIds.length] : undefined;

      // status com pesos via pseudoRandom
      const r = Math.floor(pseudoRandom(i) * 100);
      let status = "ativa";
      if (r < 10) status = "nova";
      else if (r < 55) status = "ativa";
      else if (r < 70) status = "pausada";
      else if (r < 82) status = "concluida";
      else if (r < 92) status = "cancelada";
      else status = "expirada";

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

  relatos: [
    { id: "r1", mentoriaId: "s2", mentorId: "m2", dataISO: "2025-08-21T14:00:00.000Z", titulo: "Checkpoint", texto: "Definimos backlog das próximas 2 semanas." },
    { id: "r2", mentoriaId: "s2", mentorId: "m2", dataISO: "2025-08-28T10:30:00.000Z", titulo: "Sessão 2", texto: "Validação de público-alvo e proposta de valor." },
    { id: "r3", mentoriaId: "s4", mentorId: "m4", dataISO: "2025-08-22T10:00:00.000Z", titulo: "Primeira sessão", texto: "Mapeamos canais de venda e definimos próximos passos." },
    { id: "r4", mentoriaId: "s6", mentorId: "m5", dataISO: "2025-08-20T16:00:00.000Z", titulo: "Sessão inicial", texto: "Análise de custos e sugestões de precificação." },
    { id: "r5", mentoriaId: "s7", mentorId: "m6", dataISO: "2025-08-10T12:00:00.000Z", titulo: "Encerramento", texto: "Mentoria concluída com plano de ação para marketing digital." },
    { id: "r6", mentoriaId: "s8", mentorId: "m7", dataISO: "2025-08-21T14:00:00.000Z", titulo: "Redes sociais", texto: "Definimos calendário de postagens e tipos de conteúdo." },
    { id: "r7", mentoriaId: "s4", mentorId: "m4", dataISO: "2025-08-29T09:00:00.000Z", titulo: "Sessão 2", texto: "Avaliação dos resultados das vendas online." },
  ],
  filtro: { status: "todas", mentorId: "todos", projetoId: "todos", busca: "" },
};
