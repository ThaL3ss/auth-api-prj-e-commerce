# Auth API

API de autenticação e gerenciamento de usuários de um e-commerce acadêmico com arquitetura de microsserviços.

## Tecnologias

- **NestJS** — framework backend
- **Prisma** — ORM
- **MySQL** — banco de dados
- **JWT** — autenticação com access token e refresh token
- **bcrypt** — hash de senhas

## Rodando o projeto

```bash
npm install
npx prisma generate
npm run start:dev
```

A API sobe na porta **3006**.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha os valores antes de rodar.
