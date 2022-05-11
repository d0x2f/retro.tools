/// <reference types="cypress" />

context('IceBreaker', () => {
  before(() => {
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type('IceBreaker Board Name');
    cy.get('[data-name=more-settings-button]').click();
    cy.get('[data-name=ice-breaker-question-input]').type('Testing ice breaker question');
    cy.get('[data-name=create-button]').click();
  });

  it('should exist an ice breaker question', () => {
    cy.get('[data-name=ice-breaker-message]').should(
      'have.text',
      'Testing ice breaker question'
    );
  });
});
