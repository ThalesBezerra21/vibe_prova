# language: pt
Funcionalidade: Correção de Provas
  Como um professor
  Eu quero processar o CSV de gabaritos e o de respostas dos alunos
  Para gerar um relatório com o cálculo automático das notas e acertos

  Cenário: Correção de provas com arquivos de CSV válidos rigorosamente
    Dado que estou na página de "Corrigir Provas"
    Quando eu seleciono um "CSV de Gabarito" com dados válidos da "Prova B1"
    E eu seleciono um "CSV de Respostas" com um aluno com "Prova B1" contendo as alternativas corretas
    E eu escolho o rigor de correção "strict"
    E eu clico em "Corrigir Provas"
    Então um relatório de correções deve ser exibido na tela com a nota total do aluno
    E uma notificação de sucesso "Correção de provas realizada com sucesso!" deve aparecer

  Cenário: Correção de provas com arquivos de CSV válidos proporcionalmente
    Dado que estou na página de "Corrigir Provas"
    Quando eu seleciono um "CSV de Gabarito" com dados válidos de múltiplas alternativas da "Prova B1"
    E eu seleciono um "CSV de Respostas" com um aluno com metades as alternativas corretas
    E eu escolho o rigor de correção "partial"
    E eu clico em "Corrigir Provas"
    Então a nota do aluno deve ser calculada de forma proporcional aos acertos
    E uma notificação de sucesso "Correção de provas realizada com sucesso!" deve aparecer

  Cenário: Arquivos mal formatados na correção não geram dados
    Dado que estou na página de "Corrigir Provas"
    Quando eu seleciono um CSV de Respostas em branco ou mal formatado
    E um CSV de Gabarito válido
    E eu clico em "Corrigir Provas"
    Então uma notificação de erro deve aparecer informando "Nenhuma correção gerada. Verifique se o formato dos arquivos está correto e se compartilham as mesmas provas."
    E nenhum dado deve ser exibido na tela

  Cenário: Tentativa de correção sem enviar arquivos obrigatórios
    Dado que estou na página de "Corrigir Provas"
    Quando eu clico em "Corrigir Provas" sem selecionar ambos os arquivos CSV
    Então eu devo ver uma notificação informando "Por favor, selecione ambos os arquivos CSV."
    E nenhum processamento deve ocorrer
