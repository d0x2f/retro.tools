/// <reference types="cypress" />

context('CreateForm', () => {
  it('shows the form', () => {
    cy.login();
    cy.visit('/');
    cy.get('[data-name=create-form]').should('exist');
  });
});
