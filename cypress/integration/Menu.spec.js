/// <reference types="cypress" />

context('Menu', () => {
  before(() => {
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type('Test Board Name');
    cy.get('[data-name=create-button]').click();
  });

  it('has the expected default settings', () => {
    cy.get('[data-name=cards-open-button]')
      .children()
      .first()
      .should('have.attr', 'data-checked', 'true');
    cy.get('[data-name=voting-open-button]')
      .children()
      .first()
      .should('have.attr', 'data-checked', 'false');
    cy.get('[data-name=sort-button]')
      .children()
      .first()
      .should('have.attr', 'data-checked', 'false');
    cy.get('[data-name=show-qr-button]')
      .children()
      .first()
      .should('have.attr', 'data-checked', 'false');
  });

  describe('when the menu button is clicked', () => {
    before(() => {
      cy.get('[data-name=menu-button]').click();
    });

    it('shows all the buttons', () => {
      cy.get('[data-name=cards-open-button]').should('be.visible');
      cy.get('[data-name=voting-open-button]').should('be.visible');
      cy.get('[data-name=sort-button]').should('be.visible');
      cy.get('[data-name=copy-link-button]').should('be.visible');
      cy.get('[data-name=download-csv-button]').should('be.visible');

      // This button only shows on viewports with width >= 992px
      if (Cypress.config('viewportWidth') >= 992) {
        cy.get('[data-name=show-qr-button]').should('be.visible');
      } else {
        cy.get('[data-name=show-qr-button]').should('not.be.visible');
      }
    });

    after(() => {
      cy.get('[data-name=menu-button]').click();
    });
  });

  context('card creation', () => {
    describe('when card creation is allowed and creation is attempted', () => {
      before(() => {
        cy.get('[data-name=rank]:visible')
          .first()
          .find('[data-name=card-text-input]')
          .type('Test card content{enter}')
          .should('have.value', '');
      });

      it('creates the card', () => {
        cy.get('[data-name=card]:visible').should('exist');
      });
    });

    describe('when card creation is not allowed and creation is attempted', () => {
      before(() => {
        cy.get('[data-name=menu-button]').click();
        cy.get('[data-name=cards-open-button]').click();
        cy.get('[data-name=menu-button]').click();
        cy.get('[data-name=rank]:visible')
          .first()
          .find('[data-name=card-text-input]')
          .type('Test card content{enter}')
          .should('have.value', 'Test card content')
          .clear();
      });

      it('shows a warning alert', () => {
        cy.get('[data-name=warning-alert]:visible').should(
          'have.text',
          'Card creation is disabled, enable it using the drop down menu in the top right.'
        );
        // Ensure it goes away
        cy.get('[data-name=warning-alert]').should('not.exist');
      });
    });

    after(() => {
      cy.get('[data-name=delete-button]:visible').click({ multiple: true });
      cy.get('[data-name=confirm-button]:visible').click({ multiple: true });
      cy.get('[data-name=card]').should('not.exist');
    });
  });

  context('voting', () => {
    before(() => {
      cy.get('[data-name=menu-button]').click();
      cy.get('[data-name=cards-open-button]').click();
      cy.get('[data-name=menu-button]').click();
      cy.get('[data-name=rank]:visible')
        .first()
        .find('[data-name=card-text-input]')
        .type('Test card content{enter}')
        .should('have.value', '');
    });

    describe('when voting is not allowed', () => {
      it('does not show the vote button', () => {
        cy.get('[data-name=vote-button]:visible').should('not.exist');
      });
    });

    describe('when voting is allowed', () => {
      before(() => {
        cy.get('[data-name=menu-button]').click();
        cy.get('[data-name=voting-open-button]').click();
        cy.get('[data-name=menu-button]').click();
      });

      it('shows the vote button', () => {
        cy.get('[data-name=vote-button]:visible').should('exist');
      });
    });

    after(() => {
      cy.get('[data-name=delete-button]:visible').click({ multiple: true });
      cy.get('[data-name=confirm-button]:visible').click({ multiple: true });
      cy.get('[data-name=card]').should('not.exist');
    });
  });

  // TODO: Sort test is janky
  // context('sorting', () => {
  //   before(() => {
  //     cy.get('[data-name=rank]:visible')
  //       .first()
  //       .find('[data-name=card-text-input]')
  //       .type('Test card content{enter}')
  //       .should('have.value', '');
  //     cy.get('[data-name=card]').should('exist');
  //     cy.get('[data-name=rank]:visible')
  //       .first()
  //       .find('[data-name=card-text-input]')
  //       .type('Another test card{enter}')
  //       .should('have.value', '');
  //     cy.get('[data-name=vote-button]:visible').last().click();
  //     cy.get('[data-name=card]')
  //       .last()
  //       .find('[data-name=vote-count]')
  //       .should('have.text', '1');
  //   });

  //   describe('when sorting is disabled', () => {
  //     it('shows the cards in order of creation', () => {
  //       cy.get('[data-name=card]')
  //         .first()
  //         .find('[data-name=vote-count]')
  //         .should('have.text', '0');
  //       cy.get('[data-name=card]')
  //         .last()
  //         .find('[data-name=vote-count]')
  //         .should('have.text', '1');
  //     });
  //   });

  //   describe('when sorting is enabled', () => {
  //     before(() => {
  //       cy.get('[data-name=menu-button]').click();
  //       cy.get('[data-name=sort-button]').click();
  //       cy.get('[data-name=menu-button]').click();
  //     });

  //     it('shows the cards in order of vote count', () => {
  //       cy.get('[data-name=card]')
  //         .first()
  //         .find('[data-name=vote-count]')
  //         .should('have.text', '1');
  //       cy.get('[data-name=card]')
  //         .last()
  //         .find('[data-name=vote-count]')
  //         .should('have.text', '0');
  //     });
  //   });

  //   after(() => {
  //     cy.get('[data-name=delete-button]:visible').click({ multiple: true });
  //     cy.get('[data-name=confirm-button]:visible').click({ multiple: true });
  //     cy.get('[data-name=card]').should('not.exist');
  //   });
  // });

  // This button only shows on viewports with width >= 992px
  if (Cypress.config('viewportWidth') >= 992) {
    context('qr code', () => {
      describe('when disabled', () => {
        it('does not show the qr code', () => {
          cy.get('[data-name=qr-code]').should('not.exist');
        });
      });

      describe('when enabled', () => {
        before(() => {
          cy.get('[data-name=menu-button]').click();
          cy.get('[data-name=show-qr-button]').click();
          cy.get('[data-name=menu-button]').click();
        });

        it('shows the qr code', () => {
          cy.get('[data-name=qr-code]').should('be.visible');
        });

        after(() => {
          cy.get('[data-name=menu-button]').click();
          cy.get('[data-name=show-qr-button]').click();
          cy.get('[data-name=menu-button]').click();
        });
      });
    });
  }

  // TOOD: This doesn't seem possible to test at the moment
  //       See: https://github.com/cypress-io/cypress/issues/949
  // context('csv download', () => {
  //   describe('when clicked', () => {
  //     before(() => {
  //       cy.get('[data-name=menu-button]').click();
  //       cy.get('[data-name=download-csv-button]').click();
  //     });

  //     it('prompts to save the csv file', () => {});
  //   });
  // });

  context('copy link', () => {
    it('has the board link as its clipboard data', () => {
      cy.get('[data-name=copy-link-button]')
        .should('have.attr', 'data-clipboard-text')
        .and('match', /http:\/\/localhost:5000\/[a-zA-Z0-9]+/i);
    });

    // TODO: Not sure how to check actual clipboard contents.
    // describe('when clicked', () => {
    //   before(() => {
    //     cy.get('[data-name=menu-button]').click();
    //     cy.get('[data-name=copy-link-button]').click();
    //     cy.get('[data-name=menu-button]').click();
    //   });

    //   it('copies the board link into the clipboard', () => {});
    // });
  });

  after(() => {
    cy.visit('/');
    cy.get('[data-name=board-list-button]').click();
    cy.get('[data-name=delete-button]').click({ multiple: true });
    cy.get('[data-name=delete-confirm-button]').click({ multiple: true });
    cy.get('[data-name=board-table]').should('not.exist');
  });
});
