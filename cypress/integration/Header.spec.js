/// <reference types="cypress" />

context('Header', () => {
  before(() => {
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type('Test Board Name');
    cy.get('[data-name=create-button]').click();
  });

  it('shows the app title, board title and configuration buttons', () => {
    cy.get('[data-name=board-title]:visible')
      .should('have.length', 1)
      .should('have.text', 'Test Board Name');
    cy.get('[data-name=home-link]')
      .should('be.visible')
      .should('have.text', 'retro.tools');
    cy.get('[data-name=locale-select-button]').should('be.visible');
    cy.get('[data-name=menu-button]').should('be.visible');
  });

  // Title is only editable on viewports with width >= 992px
  if (Cypress.config('viewportWidth') >= 992) {
    it('allows updating the board title', () => {
      cy.get('[data-name=board-title]:visible').click();
      cy.get('[data-name=board-title-edit-field]')
        .should('have.length', 1)
        .should('have.value', 'Test Board Name')
        .clear()
        .type('My New Board Title{enter}')
        .should('not.exist');
      cy.get('[data-name=board-title]:visible')
        .should('have.length', 1)
        .should('have.text', 'My New Board Title');
    });
  }

  describe('when the app title is clicked', () => {
    before(() => {
      cy.intercept('boards').as('getBoards');
      cy.get('[data-name=home-link]').click();
      cy.wait('@getBoards');
    });

    it('navigates to the splash page', () => {
      cy.url().should('match', new RegExp(`${Cypress.config().baseUrl}/?`));
    });

    after(() => {
      cy.go('back');
      cy.url().should(
        'match',
        new RegExp(`${Cypress.config().baseUrl}/[a-zA-Z0-9]+`)
      );
    });
  });

  after(() => {
    cy.intercept('boards').as('getBoards');
    cy.visit('/');
    cy.wait('@getBoards');
    cy.get('[data-name=board-list-button]').click();
    cy.get('[data-name=delete-button]').click({ multiple: true });
    cy.get('[data-name=delete-confirm-button]').click({ multiple: true });
    cy.get('[data-name=board-table]').should('not.exist');
  });
});
