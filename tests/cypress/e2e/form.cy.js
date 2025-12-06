describe('Fluxo de Geração de Declaração', () => {
  beforeEach(() => {
    // Para este teste funcionar, o frontend deve estar sendo servido
    // via live-server na porta 5500 ou 8080 (ajuste a URL abaixo)
    cy.visit('http://127.0.0.1:5500/public/index.html');
  });

  it('Deve preencher o formulário, buscar CEP e solicitar o download', () => {
    // 1. Mock do ViaCEP
    cy.intercept('GET', '**/ws/70000000/json/', {
      statusCode: 200,
      body: {
        logradouro: 'Setor Comercial Norte',
        bairro: 'Asa Norte',
        localidade: 'Brasília',
        uf: 'DF',
        erro: false
      }
    }).as('buscaCep');

    // 2. Mock da API de geração (Backend)
    // Respondemos com um Blob fake para não precisar do backend rodando no teste de interface
    cy.intercept('POST', '**/gerar', {
        statusCode: 200,
        headers: { 'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
        body: 'conteudo-binario-falso-docx' 
    }).as('postGerar');

    // Preencher dados pessoais
    cy.get('#nome').type('João da Silva');
    cy.get('#rg').type('1.234.567');
    cy.get('#cpf').type('123.456.789-00');

    // Testar busca de CEP
    cy.get('#cep').type('70000000');
    cy.get('#btnBuscarCep').click();
    cy.wait('@buscaCep');

    // Verificar se preencheu
    cy.get('#logradouro').should('have.value', 'Setor Comercial Norte');
    cy.get('#bairro').should('have.value', 'Asa Norte');
    cy.get('#cidade_uf').should('have.value', 'Brasília/DF');

    // Terminar preenchimento
    cy.get('#numero').type('100');
    cy.get('#complemento').type('Bloco A');
    cy.get('#data').type('05 de Dezembro de 2025');

    // Submeter
    cy.get('#btnGerar').click();
    
    // Verificar requisição ao backend
    cy.wait('@postGerar').then((interception) => {
        expect(interception.request.body).to.have.property('nome', 'João da Silva');
        expect(interception.request.body).to.have.property('logradouro', 'Setor Comercial Norte');
    });

    // Verificar se houve alerta de sucesso
    cy.on('window:alert', (str) => {
        expect(str).to.contain('sucesso');
    });
  });
});