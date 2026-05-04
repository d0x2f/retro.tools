/// <reference types="cypress" />

context('Drag Card', () => {
  before(() => {
    cy.viewport(1280, 800);
    cy.login();
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type('Drag Test Board');
    cy.get('[data-name=create-button]').click();
    cy.get('[data-name=create-button]:visible').should('have.length', 0);

    // Add a card to the first rank
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-text-input]')
      .type('Drag me');
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-author-input]')
      .type('Tester{enter}');
  });

  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.login();
    cy.visit('/');
    cy.get('[data-name=board-list-button]').click();
    cy.get('[data-name=board-row] td').first().click();
    cy.get('[data-name=create-button]:visible').should('have.length', 0);
  });

  it('can drag a card from one column to another', () => {
    cy.get('[data-name=rank]:visible').should('have.length.gte', 2);

    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card]')
      .as('card');
    cy.get('[data-name=rank]:visible').eq(1).as('targetRank');

    // Verify the card starts in the first rank
    cy.get('@card').should('exist');

    cy.get('@card').then(($card) => {
      const cardRect = $card[0].getBoundingClientRect();
      const startX = cardRect.left + cardRect.width / 2;
      const startY = cardRect.top + cardRect.height / 2;

      cy.get('@targetRank').then(($rank) => {
        const rankRect = $rank[0].getBoundingClientRect();
        const endX = rankRect.left + rankRect.width / 2;
        const endY = rankRect.top + 100;

        cy.get('@card')
          .trigger('mousedown', { which: 1, clientX: startX, clientY: startY })
          .trigger('mousemove', { clientX: startX + 10, clientY: startY });

        cy.get('@targetRank')
          .trigger('mousemove', { clientX: endX, clientY: endY, force: true })
          .trigger('mouseup', { clientX: endX, clientY: endY, force: true });
      });
    });

    // Card should now be in the second rank, not the first
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card]')
      .should('not.exist');
    cy.get('[data-name=rank]:visible')
      .eq(1)
      .find('[data-name=card]')
      .should('exist');
  });

  after(() => {
    cy.deleteAllBoards();
  });
});
