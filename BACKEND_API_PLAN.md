# Backend – Plano Inicial de API e Dados

## 1. Visão geral
- Aplicação CRM interno para gestão de mentorias (mentores, mentorias, projetos, relatos, vinculações).
- Frontend atual usa React (guru-clone) com estado mock (CrmContext). Objetivo: expor dados reais via API REST.
- Stack sugerida: Node.js (NestJS/Express) + DB relacional (PostgreSQL). Autenticação via JWT + RBAC (admin, mentor, equipe).

## 2. Domínios principais
| Entidade | Campos principais | Observações |
| --- | --- | --- |
| Projeto | id (UUID), nome, status (ativo/inativo), created_at | usado em RelatosFeed; precisa de flag para ativação/desativação. |
| Mentor | id, nome, email, telefone, área, bio, ativo, foto_url, projetos_ids[] | possui relacionamento N:N com Projetos. |
| Mentoria | id, empreendedor, negocio, projeto_id, status, mentor_id, desafio, data_criacao, ultima_atualizacao, progresso, proximo_encontro_data, proximo_encontro_horario | usada em MentoriaLista/Kanban; status enumerados (nova, ativa, pausada, concluida, cancelada, expirada, triagem, agendada). |
| Relato | id, mentoria_id, mentor_id, data_iso, data_encontro_iso, duracao_minutos, titulo, texto | editável via modal; precisa histórico e edição segura. |
| VinculaçãoMentorProjeto | mentor_id, projeto_id, created_at | usado no RelatosFeed (grid). |

## 3. Endpoints sugeridos
### 3.1 Autenticação / Usuários
- `POST /auth/login` – retorna JWT.
- `GET /auth/me` – perfil atual (permissões: admin, mentor, equipe).
- Futuro: `POST /auth/impersonate` para fluxo “entrar como” (usa roles e audit trail).

### 3.2 Projetos
- `GET /projects` – suporta filtros (`status`, `q`). Usado no grid + filtros do RelatosFeed.
- `POST /projects` – criar projeto.
- `GET /projects/:id`
- `PATCH /projects/:id` – atualizar nome/status.
- `PATCH /projects/:id/status` – body `{ status: 'ativo' | 'inativo' }`. Acionado pelo botão “Desativar projeto” no modal.

### 3.3 Mentores
- `GET /mentors` – filtros: `ativo`, `projectId`, `q`.
- `POST /mentors`
- `GET /mentors/:id`
- `PATCH /mentors/:id` – edição inline do MentorList (nome, email, telefone, área, ativo).
- `PATCH /mentors/:id/assign-projects` – body `{ projectIds: [] }`. Usado pelos botões de “Atribuir todos” / “Remover todos” no RelatosFeed.

### 3.4 Mentorias
- `GET /mentorships` – filtros: `status`, `mentorId`, `projectId`, `q`, `dateRange`. Alimenta MentoriaLista + Kanban (tab pendentes/ativas, status local).
- `POST /mentorships`
- `GET /mentorships/:id`
- `PATCH /mentorships/:id` – atualiza status, mentor vinculado, campos gerais.
- `PATCH /mentorships/:id/status` – body `{ status }` (dropdown da tabela & Kanban).
- `PATCH /mentorships/:id/mentor` – body `{ mentorId }` (botão “Selecionar mentor”).
- `PATCH /mentorships/:id/next-meeting` – body `{ dateISO, time }` (modal de detalhes).

### 3.5 Relatos
- `GET /mentorships/:id/reports`
- `POST /mentorships/:id/reports`
- `PATCH /reports/:id` – edição (texto, data encontro, duração).
- `DELETE /reports/:id` – usa novo modal de confirmação.

### 3.6 Vinculação Mentores-Projetos
- `GET /projects/:id/mentors?vinculated=true/false`
- `POST /projects/:id/mentors` – body `{ mentorId }` (toggle).
- `DELETE /projects/:id/mentors/:mentorId`
- Endpoints em massa (opcional): `POST /projects/:id/mentors/bulk-assign`, `POST /projects/:id/mentors/bulk-remove`.

## 4. Fluxos relevantes
### 4.1 RelatosFeed (Gestão de Mentores por Projeto)
1. `GET /projects?status=&q=` para montar grid e filtros.
2. Ao abrir modal: `GET /projects/:id/mentors?vinculated=true/false` (ou único endpoint com flag).
3. Botão “Desativar projeto”: `PATCH /projects/:id/status`.
4. Botões de massa: `POST /projects/:id/mentors/bulk-assign`, `bulk-remove`.

### 4.2 MentoriaLista
1. `GET /mentorships` com filtros (status local + global, projeto, data).
2. Dropdown status → `PATCH /mentorships/:id/status`.
3. Botão “Selecionar mentor” → listagem `GET /mentors?ativo=true&q=` e `PATCH /mentorships/:id/mentor`.
4. Modal “Encontros”: `GET /mentorships/:id/reports`, `PATCH /mentorships/:id/next-meeting`, edição/exclusão de relatos.
5. Botão WhatsApp/“Entrar como” depende de dados extras (telefone mentor, rota impersonate).

### 4.3 MentoriaKanban
1. `GET /mentorships` com filtros por aba (pendentes = status nova, ativas = status ativa).
2. Seleção de mentor/alteração de status usa os mesmos endpoints do item 4.2.

### 4.4 MentorList
1. `GET /mentors` – exibe info básica.
2. Editar mentor → `PATCH /mentors/:id`.
3. Campo `ativo` impacta disponibilidade em RelatosFeed (mentores disponíveis filtram por ativo).

## 5. Modelagem de dados (SQL aproximado)
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo','inativo')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mentors (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  area TEXT,
  bio TEXT,
  active BOOLEAN DEFAULT true,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mentor_projects (
  mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  PRIMARY KEY (mentor_id, project_id)
);

CREATE TABLE mentorships (
  id UUID PRIMARY KEY,
  entrepreneur TEXT NOT NULL,
  business TEXT,
  project_id UUID REFERENCES projects(id),
  status TEXT CHECK (...enum...),
  mentor_id UUID REFERENCES mentors(id),
  challenge TEXT,
  next_meeting_date DATE,
  next_meeting_time TIME,
  progress INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE reports (
  id UUID PRIMARY KEY,
  mentorship_id UUID REFERENCES mentorships(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES mentors(id),
  recorded_at TIMESTAMPTZ,
  meeting_date DATE,
  duration_minutes INTEGER,
  title TEXT,
  body TEXT
);
```

## 6. Considerações adicionais
- **Auditoria**: logar alterações críticas (atribuição de mentor, mudança de status do projeto, edição de relatos).
- **Permissões**: 
  - Admin/equipe: CRUD completo.
  - Mentor: listar mentorias atribuídas, registrar relatos, editar encontro.
  - Impersonate: restrito a admins, com registro em tabela `impersonation_logs`.
- **Sincronização frontend**: migrar CrmContext para buscar dados via SWR/React Query; tratar estados locais (ex.: `projetosStatus`) com dados vindos do backend.
- **Fila/Jobs** (futuro): disparo de notificações quando próxima reunião estiver sem confirmação.

Esse documento serve como base para alinhamento com o sênior sobre arquitetura de dados, endpoints e prioridades de implementação.

