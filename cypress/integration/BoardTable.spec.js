/// <reference types="cypress" />

context('BoardTable', () => {
  before(() => {
    // Clear cookie so we get a fresh session
    cy.clearCookie('__session');

    cy.visit('/');

    // Ensure there are no existing boards for a clean slate
    cy.get('[data-name=board-table]').should('not.exist');
  });

  context('With no existing boards', () => {
    it('does not show the board list table', () => {
      cy.get('[data-name=board-table]').should('not.exist');
    });
  });

  context('With an existing board', () => {
    before(() => {
      cy.get('[data-name=board-name-input]').type('Test Board Name');
      cy.get('[data-name=create-button]').click();
      cy.visit('/');
    });

    context('As the owner', () => {
      it('shows the board list table', () => {
        cy.get('[data-name=board-table]').should('exist');
      });

      it('shows the board row', () => {
        cy.get('[data-name=board-row]').should('have.length', 1);
      });

      it('shows the delete button', () => {
        cy.get('[data-name=board-row]')
          .first()
          .find('[data-name=delete-button]')
          .should('exist');
      });
    });

    context('As a participant', () => {
      let ownerSessionId;
      let boardId;
      before(() => {
        // Find the board id
        cy.get('[data-name=board-row]')
          .first()
          .invoke('attr', 'data-board-id')
          .then((v) => {
            boardId = v;

            // Store and clear session cookie
            ownerSessionId = cy.getCookie('__session').then((cookie) => {
              ownerSessionId = cookie.value;
              cy.clearCookie('__session');

              // Visit the board and come back to generate a session as a participant
              cy.visit(`/${boardId}`);
              cy.visit('/');
            });
          });
      });

      it('shows the board list table', () => {
        cy.get('[data-name=board-table]').should('exist');
      });

      it('shows the board row', () => {
        cy.get('[data-name=board-row]').should('have.length', 1);
      });

      it('is the expected board', () => {
        cy.get('[data-name=board-row]')
          .first()
          .should('have.attr', 'data-board-id', boardId);
      });

      it('does not show the delete button', () => {
        cy.get('[data-name=board-row]')
          .first()
          .find('[data-name=delete-button]')
          .should('not.exist');
      });

      after(() => {
        // Restore board owner session
        cy.setCookie('__session', ownerSessionId);
      });
    });

    after(() => {
      cy.visit('/');
      cy.get('[data-name=delete-button]').each($el => $el.click());
      cy.get('[data-name=delete-confirm-button]').each($el => $el.click());
      cy.get('[data-name=board-table]').should('not.exist');
    });
  });
});
