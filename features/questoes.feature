# language: pt
Funcionalidade: Gerenciamento de Questões
  Como um professor
  Eu quero poder criar, visualizar, editar e excluir questões
  Para poder utilizá-las na elaboração de provas

  Cenário: Criar uma nova questão
    Dado que estou na página de "Criar Questão"
    Quando eu preencho o enunciado com "Qual a capital do Brasil?"
    E eu adiciono a alternativa "A" com o texto "São Paulo"
    E eu adiciono a alternativa "B" com o texto "Brasília" marcando-a como correta
    E eu clico em "Salvar Questão"
    Então eu devo ver uma mensagem de sucesso "Questão criada com sucesso!"
    E a questão "Qual a capital do Brasil?" deve aparecer na lista de questões

  Cenário: Editar uma questão existente
    Dado que existe uma questão chamada "Qual a capital do Brasil?"
    E eu estou na página de listagem de questões
    Quando eu clico em "Editar" na questão "Qual a capital do Brasil?"
    E eu altero o enunciado para "Qual a atual capital do Brasil?"
    E eu clico em "Salvar"
    Então eu devo ver uma mensagem de sucesso "Questão atualizada com sucesso!"
    E o novo enunciado deve aparecer na listagem

  Cenário: Excluir uma questão
    Dado que existe uma questão com enunciado de teste
    E eu estou na página de listagem de questões
    Quando eu clico em "Excluir" na questão
    E eu confirmo a exclusão
    Então a questão não deve mais estar na lista
    E eu devo ver uma mensagem "Questão removida"