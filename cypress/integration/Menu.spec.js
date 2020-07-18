/// <reference types="cypress" />

context('Menu', () => {
  before(() => {
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type('Test Board Name');
    cy.get('[data-name=create-button]').click();
  });

  it('has new cards allowed by default', () => {
    cy.get('[data-name=cards-open-button]')
      .children()
      .first()
      .its('data-checked')
      .should('be', 'true');
  });

  it('has voting disallowed by default', () => {
    cy.get('[data-name=voting-open-button]')
      .children()
      .first()
      .its('data-checked')
      .should('be', 'false');
  });

  it('should not be sorted by default', () => {
    cy.get('[data-name=sort-button]')
      .children()
      .first()
      .its('data-checked')
      .should('be', 'false');
  });

  it('should not show the qr code by default', () => {
    cy.get('[data-name=show-qr-button]')
      .children()
      .first()
      .its('data-checked')
      .should('be', 'false');
  });

  describe('when the menu button is clicked', () => {
    before(() => {
      cy.get('[data-name=menu-button]').click();
    });

    it('shows the cards allowed button', () => {
      cy.get('[data-name=cards-open-button]').should('be.visible');
    });

    it('shows the voting allowed button', () => {
      cy.get('[data-name=voting-open-button]').should('be.visible');
    });

    it('shows the sort button', () => {
      cy.get('[data-name=sort-button]').should('be.visible');
    });

    it('shows the qr code button', () => {
      cy.get('[data-name=show-qr-button]').should('be.visible');
    });

    it('shows the copy link button', () => {
      cy.get('[data-name=copy-link-button]').should('be.visible');
    });

    it('shows the download csv button', () => {
      cy.get('[data-name=download-csv-button]').should('be.visible');
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
      cy.get('[data-name=delete-button]:visible').each(($el) => $el.click());
      cy.get('[data-name=confirm-button]:visible').each(($el) => $el.click());
      cy.get('[data-name=card]').should('not.exist');
    });
  });

  context('voting', () => {
    before(() => {
      cy.get('[data-name=menu-button]').click();
      cy.get('[data-name=cards-open-button]').click();
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
      });

      it('shows the vote button', () => {
        cy.get('[data-name=vote-button]:visible').should('exist');
      });
    });

    after(() => {
      cy.get('[data-name=delete-button]:visible').each(($el) => $el.click());
      cy.get('[data-name=confirm-button]:visible').each(($el) => $el.click());
      cy.get('[data-name=card]').should('not.exist');
    });
  });

  context('sorting', () => {
    before(() => {
      cy.get('[data-name=rank]:visible')
        .first()
        .find('[data-name=card-text-input]')
        .type('Test card content{enter}')
        .should('have.value', '');
      cy.get('[data-name=rank]:visible')
        .first()
        .find('[data-name=card-text-input]')
        .type('Another test card{enter}')
        .should('have.value', '');
      cy.get('[data-name=vote-button]:visible').last().click();
    });

    describe('when sorting is disabled', () => {
      it('shows the cards in order of creation', () => {
        cy.get('[data-name=card]').first().find('[data-name=vote-count]').should('have.text', '0');
        cy.get('[data-name=card]').last().find('[data-name=vote-count]').should('have.text', '1');
      });
    });

    describe('when sorting is enabled', () => {
      before(() => {
        cy.get('[data-name=menu-button]').click();
        cy.get('[data-name=sort-button]').click();
      });

      it('shows the cards in order of vote count', () => {
        cy.get('[data-name=card]').first().find('[data-name=vote-count]').should('have.text', '1');
        cy.get('[data-name=card]').last().find('[data-name=vote-count]').should('have.text', '0');
      });
    });

    after(() => {
      cy.get('[data-name=delete-button]:visible').each(($el) => $el.click());
      cy.get('[data-name=confirm-button]:visible').each(($el) => $el.click());
      cy.get('[data-name=card]').should('not.exist');
    });
  });

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
      });

      it('shows the qr code', () => {
        cy.get('[data-name=qr-code]').should('exist');
      });
    });
  });

  // TOOD: this doesn't seem possible to test at the moment
  //       see: https://github.com/cypress-io/cypress/issues/949
  // context('csv download', () => {
  //   describe('when clicked', () => {
  //     before(() => {
  //       cy.get('[data-name=menu-button]').click();
  //       cy.get('[data-name=download-csv-button]').click();
  //     });

  //     it('prompts to save the csv file', () => {});
  //   });
  // });

  after(() => {
    cy.visit('/');
    cy.get('[data-name=delete-button]').each(($el) => $el.click());
    cy.get('[data-name=delete-confirm-button]').each(($el) => $el.click());
    cy.get('[data-name=board-table]').should('not.exist');
  });
});
