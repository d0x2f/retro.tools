Cypress.Commands.add('login', (name = "user") => {
  cy.session(name, () => {
    cy.intercept('boards').as('getBoards');
    cy.visit('/');
    cy.wait('@getBoards');
  },{
    validate() {
      cy.getCookie('__session').should('exist');
    }
  })
});