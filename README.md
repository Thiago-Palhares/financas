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

Conta demo:

- Usuário: `thiago@financas.ai`
- Senha: `123456`

## O que já tem

- Login com usuário e senha local.
- Criação de conta local no próprio navegador.
- Layout responsivo para computador e celular.
- Tema escuro com detalhes em roxo e alternância para tema claro.
- Dashboard com saldo atual, entradas do mês, gastos do mês e saldo projetado.
- Extrato com filtros por tipo e status.
- Cadastro de gastos já realizados ou futuros.
- Cadastro de entradas para compor o saldo.
- Exportação do extrato em CSV.

## Observação importante

Esta primeira versão salva os dados no `localStorage` do navegador. É ótima para protótipo e estudo, mas ainda não é autenticação segura de produção. O próximo passo natural é criar um backend com banco de dados e senha criptografada.
