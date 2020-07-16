/// <reference types="cypress" />

context('CreateForm', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows the form', () => {
    cy.get('[data-name=create-form]').should('exist');
  });
});
