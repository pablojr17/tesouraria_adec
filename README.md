# ADEC Tesouraria

## Visão Geral do Projeto

Este é o projeto `AdecTesouraria`, uma aplicação desenvolvida com **Angular** que serve como uma ferramenta para **gerenciamento de entradas e saídas financeiras**. Ela permite aos usuários registrar transações (receitas e despesas), visualizar o histórico e acompanhar o **saldo atual**, proporcionando uma visão clara da movimentação financeira.

---

## Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias e ferramentas:

* **Angular CLI**: Versão `18.2.10` (ou superior) para gerenciamento do projeto.
* **Angular**: Framework principal para construção da Single Page Application (SPA).
* **TypeScript**: Superconjunto tipado de JavaScript, usado para desenvolvimento.
* **SCSS**: Pré-processador CSS para estilização flexível e organizada.
* **Serviços e APIs**: Utilização de serviços (como `LancamentoService`) para interação com a camada de dados e persistência dos lançamentos.
* **Internacionalização (i18n)**: Configuração do locale `pt-BR` para formatação correta de moeda e datas.

---

## Pré-requisitos

Para configurar e rodar este projeto em seu ambiente de desenvolvimento, você precisará ter as seguintes ferramentas instaladas:

* **Node.js**: Recomendado na versão `18.x` ou superior.
* **npm** (Node Package Manager) ou **Yarn**: Gerenciador de pacotes (geralmente vem com o Node.js).
* **Angular CLI**: Instale globalmente com o comando:
    ```bash
    npm install -g @angular/cli
    ```

---

## Como Rodar o Projeto

Siga estes passos para colocar a aplicação em funcionamento:

### 1. Clonar o Repositório

Primeiro, clone o repositório para sua máquina local e navegue até o diretório do projeto:

```bash
git clone <URL_DO_SEU_REPOSITORIO> # Substitua pela URL real do seu repositório
cd AdecTesouraria
