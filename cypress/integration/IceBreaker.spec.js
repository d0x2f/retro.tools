/// <reference types="cypress" />

context('IceBreaker', () => {
  describe('With Ice breaker question', () => {
    before(() => {
      cy.visit('/');
      cy.get('[data-name=board-name-input]').type('IceBreaker Board Name');
      cy.get('[data-name=more-settings-button]').click();
      cy.get('[data-name=ice-breaker-question-input]').type(
        'Testing ice breaker question'
      );
      cy.get('[data-name=create-button]').click();
    });

    it('should exist an ice breaker question', () => {
      cy.get('[data-name=ice-breaker-message]:visible')
        .should('have.length', 1)
        .should('have.text', 'Testing ice breaker question');
    });
  });

  describe('Without Ice breaker question', () => {
    before(() => {
      cy.visit('/');
      cy.get('[data-name=board-name-input]').type('IceBreaker Board Name');
      cy.get('[data-name=create-button]').click();
    });

    it('should not exist an ice breaker question', () => {
      cy.get('[data-name=ice-breaker-message]:visible').should('not.exist');
    });
  });
});
