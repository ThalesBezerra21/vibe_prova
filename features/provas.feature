# language: pt
Funcionalidade: Gerenciamento de Provas
  Como um professor
  Eu quero poder criar, visualizar, exportar, editar e excluir provas
  Para estruturar os testes dos alunos e manter um histórico

  Cenário: Criar uma nova prova selecionando questões do banco
    Dado que eu tenho pelo menos 2 questões cadastradas
    E eu estou na página de "Criar Prova"
    Quando eu preencho o título com "Prova B1"
    E eu seleciono 2 questões disponíveis na listagem
    E eu clico em "Salvar Prova"
    Então eu devo ver uma notificação "Prova criada com sucesso!"
    E a prova "Prova B1" deve aparecer na listagem de provas

  Cenário: Visualizar e Exportar a prova em PDF
    Dado que existe uma prova chamada "Prova de Matemática B1" com 2 questões
    Quando eu clico no botão de download de PDF ou visualizar a prova "Prova de Matemática B1"
    Então deve ser gerado um PDF formatado contendo o título da prova e o texto das questões

  Cenário: Editar uma prova
    Dado que existe uma prova chamada "Prova P1"
    Quando eu clico no botão de "Editar" da prova "Prova P1"
    E eu removo uma das questões listadas
    E eu adiciono uma nova questão diferente
    E clico em "Salvar Prova"
    Então a prova "Prova P1" deve ser atualizada e constar com a nova questão na listagem
