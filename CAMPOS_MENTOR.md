# Campos do Mentor - Documentação

Este documento descreve todos os campos disponíveis para o objeto Mentor no sistema CRM.

## 📋 Campos Base (Interface Mentor)

Campos definidos em `src/types/crm.ts`:

```typescript
interface Mentor {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  area?: string;          // ex.: Marketing, Finanças
  bio?: string;
  ativo: boolean;
  fotoUrl?: string;
  projetosIds?: string[];
}
```

## 🆕 Campos Adicionais (Estendidos)

Campos extras que podem ser adicionados ao objeto mentor:

### Dados Pessoais
- **genero** / **gender**: `string`
  - Opções: "Homem", "Mulher", "Outro", "Prefiro não informar"
  - Exemplo: `"Homem"`

- **cpf**: `string`
  - Formato: "000.000.000-00"
  - Exemplo: `"564.887.458-84"`

- **ddd**: `string`
  - Exemplo: `"11"`

### Localização
- **cidade**: `string`
  - Exemplo: `"São Paulo"`

- **estado** / **uf**: `string`
  - Exemplo: `"SP"`

- **cep**: `string`
  - Formato: "00000-000"
  - Exemplo: `"08431-150"`

### Competências e Conhecimento
- **competencias**: `string[]`
  - Lista de áreas de interesse do mentor
  - Exemplo: `["Marketing/Vendas", "Finanças", "Bem-estar"]`

- **areasConhecimento**: `string[]`
  - Top 3 principais áreas de conhecimento
  - Exemplo: `["Marketing Digital", "Gestão Financeira", "Liderança"]`

### Informações Profissionais
- **motivacao** / **motivacaoMentor**: `string`
  - Principal motivação para ser mentor
  - Exemplo: `"Compartilhar Conhecimento e Experiências"`

- **experiencia** / **experienciaProfissional**: `string`
  - Descrição da experiência profissional
  - Exemplo: `"10 anos de experiência em marketing digital..."`

## 🎨 Visualização no Modal de Detalhes

Quando o usuário clica em "Detalhes" no `MentorList`, o modal exibe:

### Seção de Estatísticas (topo)
- Total de Mentorias
- Mentorias Ativas
- Mentorias Concluídas
- Mentorias Pausadas
- Mentorias Canceladas
- Total de Encontros

### Coluna 1
- **Dados Pessoais**: Gênero, CPF
- **Contato**: Email, Telefone com DDD
- **Localização**: Cidade, Estado, CEP
- **Status**: Ativo/Inativo

### Coluna 2
- **Áreas de Interesse**: Badges com competências
- **Principais Áreas de Conhecimento**: Lista numerada (top 3)
- **Bio**: Biografia do mentor
- **Motivação para ser Mentor**: Destaque visual com borda azul
- **Experiência Profissional**: Texto descritivo

## 📦 Como Usar os Dados Mock

Veja o arquivo `src/data/mentoresMock.ts` para exemplos completos de objetos mentor com todos os campos preenchidos.

### Exemplo Completo:

```typescript
const mentorCompleto = {
  // Campos base
  id: "mentor-1",
  nome: "Gabriel Silva",
  email: "gabriel@aliancaempreendedora.org.br",
  telefone: "94084277",
  area: "Marketing",
  ativo: true,
  
  // Dados pessoais
  ddd: "11",
  genero: "Homem",
  cpf: "564.887.458-84",
  
  // Localização
  cidade: "São Paulo",
  estado: "SP",
  cep: "08431-150",
  
  // Competências
  competencias: [
    "Marketing/Vendas",
    "Finanças",
    "Bem-estar"
  ],
  
  // Top 3 áreas
  areasConhecimento: [
    "Marketing Digital",
    "Gestão Financeira",
    "Liderança"
  ],
  
  // Informações profissionais
  motivacao: "Compartilhar Conhecimento e Experiências",
  experiencia: "10 anos de experiência...",
  bio: "Especialista em marketing digital..."
};
```

## 🎯 Opções Padrão

### Gênero
- Homem
- Mulher
- Outro
- Prefiro não informar

### Motivação para ser Mentor
- Ampliar Rede de Contatos, Conexões e Network
- Compartilhar Conhecimento e Experiências
- Contribuir para o Desenvolvimento e no empoderamento de Pessoas
- Desenvolvimento Pessoal, Profissional e liderança
- Empoderamento Feminino e Igualdade de Gênero
- Fomento e Expansão de Negócios Locais e comunitários
- Gerar impacto social e positivo através do empreendedorismo
- Missão, Propósito de Vida e Realização Pessoal
- Promover crescimento sustentável nos negócios

### Áreas de Interesse (Competências)
- Marketing/Vendas
- Finanças
- Ofertas de Crédito
- Formalização/MEI
- Comportamento Empreendedor
- Bem-estar
- Precificação

## 🔍 Filtros Disponíveis

O componente `MentorList` oferece os seguintes filtros:

1. **Busca por palavras-chave**: Nome, email, telefone, área, bio, estado, cidade, competências, motivação
2. **Filtro por Projeto**: Dropdown com todos os projetos
3. **Filtro por Estado**: Dropdown com todos os estados disponíveis
4. **Filtro por Competência**: Dropdown com todas as competências disponíveis
5. **Filtro por Mentorias Ativas**: 0, 1-3, 4-6, 7-10, 11+, Custom
6. **Paginação**: 20, 50 ou 100 itens por página

## 🚀 Próximos Passos

Para adicionar esses campos aos seus mentores:

1. Acesse o contexto CRM onde os mentores são gerenciados
2. Adicione os campos extras aos objetos mentor existentes
3. Use o arquivo `src/data/mentoresMock.ts` como referência
4. Os campos serão automaticamente exibidos no modal de detalhes se estiverem presentes

