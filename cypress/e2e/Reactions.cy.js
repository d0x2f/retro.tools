/// <reference types="cypress" />

context('Reactions', () => {
  let boardUrl;

  before(() => {
    cy.login('owner');
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type('Reactions Test Board');
    cy.get('[data-name=create-button]').click();
    cy.get('[data-name=create-button]:visible').should('have.length', 0);

    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-text-input]')
      .type('Reaction card');
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-author-input]')
      .type('Tester{enter}');
    cy.get('[data-name=card]:visible').should('exist');

    cy.url().then((url) => {
      boardUrl = url;
    });
  });

  beforeEach(() => {
    cy.login('owner');
    cy.visit(boardUrl);
    cy.get('[data-name=card]:visible').should('exist');
  });

  it('can add and remove an emoji reaction', () => {
    // Add reaction
    cy.intercept('PUT', '**/react').as('putReact');
    cy.get('[data-name=card]:visible')
      .first()
      .find('[data-name=react-drawer-button]')
      .click();
    cy.get("[data-name=emoji-button][data-emoji='👍']").click();
    cy.wait('@putReact');
    cy.get('[data-name=card]:visible')
      .first()
      .find('[data-name=react-drawer-button]')
      .should('contain', '👍');

    // Remove reaction (clicking same emoji routes to undoReact)
    cy.intercept('DELETE', '**/react').as('deleteReact');
    cy.get('[data-name=card]:visible')
      .first()
      .find('[data-name=react-drawer-button]')
      .click();
    cy.get("[data-name=emoji-button][data-emoji='👍']").click();
    cy.wait('@deleteReact');
    cy.get('[data-name=card]:visible')
      .first()
      .find('[data-name=react-drawer-button] .badge')
      .should('not.contain', '👍');
  });

  after(() => {
    cy.deleteAllBoards();
  });
});
