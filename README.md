# Finanças AI

Aplicação simples para administrar finanças pessoais com login, dashboard, saldo, extrato e cadastro de gastos realizados ou futuros.

## Como abrir no computador

Clique duas vezes em `ABRIR_FINANCAS_AI.bat`.

Se preferir, também dá para abrir o arquivo `index.html` direto no navegador.

## Como abrir no celular

1. Deixe o computador e o celular no mesmo Wi-Fi.
2. Clique duas vezes em `ABRIR_NO_CELULAR.bat`.
3. A janela vai mostrar um endereço parecido com `http://192.168.0.10:5500`.
4. Digite esse endereço no navegador do celular.
5. Mantenha a janela aberta enquanto estiver usando no celular.

Se o Windows perguntar sobre firewall/rede, permita o acesso na rede privada.

## Como hospedar no GitHub Pages

Este projeto já está pronto para GitHub Pages porque é um site estático com `index.html` na raiz.

Depois de enviar para um repositório no GitHub:

1. Entre no repositório no GitHub.
2. Vá em `Settings`.
3. Abra `Pages`.
4. Em `Build and deployment`, escolha `Deploy from a branch`.
5. Em `Branch`, escolha `master` e pasta `/root`.
6. Salve.

O GitHub vai gerar um link parecido com:

`https://seu-usuario.github.io/financas-ai/`

## Como ativar sincronização com Supabase

Hoje o app funciona em dois modos:

- Sem Supabase configurado: salva no navegador atual com `localStorage`.
- Com Supabase configurado: usa login real e salva os lançamentos na nuvem.

Para ativar a sincronização entre computador e celular:

1. Crie um projeto em `https://supabase.com`.
2. No Supabase, abra `SQL Editor`.
3. Cole e execute o conteúdo do arquivo `supabase-schema.sql`.
4. Vá em `Project Settings` > `API`.
5. Copie a `Project URL`.
6. Copie a chave pública `anon`.
7. Abra o arquivo `supabase-config.js`.
8. Preencha assim:

```js
window.FINANCAS_AI_SUPABASE = {
  url: "https://SEU-PROJETO.supabase.co",
  anonKey: "SUA_CHAVE_ANON_PUBLICA",
};
```

9. Salve, faça commit e envie para o GitHub.

Importante: use apenas a chave pública `anon`. Nunca coloque `service_role` no site.

Conta demo:

- Usuário: `thiago@financas.ai`
- Senha: `123456`

## O que já tem

- Login com usuário e senha local.
- Login real com Supabase quando configurado.
- Criação de conta local no próprio navegador.
- Layout responsivo para computador e celular.
- Tema escuro com detalhes em roxo e alternância para tema claro.
- Dashboard com saldo atual, entradas do mês, gastos do mês e saldo projetado.
- Extrato com filtros por tipo e status.
- Cadastro de gastos já realizados ou futuros.
- Cadastro de entradas para compor o saldo.
- Exportação do extrato em CSV.
- Sincronização entre dispositivos via Supabase.

## Observação importante

Sem Supabase configurado, os dados continuam salvos no `localStorage` do navegador. Com Supabase configurado, os dados passam a ser salvos na nuvem com regras de segurança por usuário.
