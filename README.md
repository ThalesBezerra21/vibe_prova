# Vibe Prova 📝

Vibe Prova é uma aplicação moderna desenvolvida para simplificar a vida de professores e educadores, permitindo o gerenciamento completo de bancos de questões, elaboração rápida de provas personalizadas e a correção automática das respostas dos alunos através de importação de planilhas CSV. 

O sistema empodera automatismos avançados, exportações de PDF formatados e uma interface polida baseada no ecossistema atual do React.

## 🚀 Principais Funcionalidades

- **Banco de Questões**: Crie, edite, exclua e categorize perguntas interativas (múltipla escolha, múltiplas corretas ou somatório).
- **Elaboração de Provas**: Selecione questões do seu banco, agregue-as em pacotes de provas e visualize tudo num único lugar.
- **Geração de PDF (e Múltiplas Versões)**: Com um clique, gere e baixe PDFs de suas avaliações perfeitamente diagramadas para impressão, já com embaralhamento automatizado de questões e de opções - e receba ainda o `gabarito.csv` de brinde.
- **Correção Automática por CSV**: Insira a planilha de respostas do aluno e o gabarito do sistema, escolha o nível de rigor (pontuação exata ou proporcional) e obtenha a nota calculada na hora. 

## 💻 Stacks de Tecnologia Utilizadas

- **[Next.js](https://nextjs.org/)**: Framework React com Server Actions nativos para otimização de SSR e requisições front/back-end rápidas.
- **[Playwright](https://playwright.dev/) & [Cucumber](https://cucumber.io/)**: Testes de aceitação `end-to-end` em padrão BDD (Behavior Driven Development).
- **[Drizzle ORM](https://orm.drizzle.team/) & SQLite/Better-SQLite3**: Banco de dados relacional robusto e tipado, totalmente integrado de forma minimalista via SQLite integrado.
- **[Shadcn/UI](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)**: Biblioteca de componentes estéticos consistentes, modais, tema escuro e pop-ups (`sonner`).
- **[react-pdf](https://react-pdf.org/)**: Renderização dinâmica em DOM e componentes nativos de PDFs complexos via front-end.
- **PapaParse & JSZip**: Leitores ultrarrápidos para o ecossistema de relatórios locais via Excel, arquivos textos e compressores para donwloads simultâneos.

## ⚙️ Pré-requisitos e Executando o Projeto

Você precisa do [Node.js](https://nodejs.org/) instalado na sua máquina.

1. **Clone ou baixe** este projeto no seu ambiente.
2. **Instale as dependências** root:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
4. Navegue até seu navegador em `http://localhost:3000`. O banco SQLite local será dinamicamente providenciado e abastecido em segundo plano.

---

## 🧪 Testes Automatizados End-to-End (E2E)

O Vibe Prova conta com testes de aceitação automatizados (Behavior-Driven Development) cobrindo todo o negócio (Criação de Provas, Questões e Correção Automática). Tudo roda em Background usando Playwright abrindo a própria página compilada isolada.

### Como rodar os testes:

1. Assegure-se de que todas as dependências estão rodando corretamente.
2. **Deixe o servidor principal da aplicação rodando**: Para que o Playwright emule os acessos na UI, é necessário deixar o app on-line. Em uma aba deixe o `npm run dev` ativo.
3. Abra **outro** terminal na raiz do projeto e execute uma única vez a injeção do Browser Test:
   ```bash
   npx playwright install chromium
   ```
4. Para **disparar a grade de testes**, digite:
   ```bash
   npm run test:e2e
   ```

O console exibirá ponto por ponto se as features foram executadas e validadas com sucesso pela arquitetura Gherkin 🥒.