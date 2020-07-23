/// <reference types="cypress" />

context('Card', () => {
  before(() => {
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type('Test Board Name');
    cy.get('[data-name=create-button]').click();
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-text-input]')
      .type('Test card content');
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-author-input]')
      .type('Test Author{enter}');
  });

  it('shows the card with expected content', () => {
    cy.get('[data-name=card]:visible')
      .should('have.length', 1)
      .contains('Test Author');
    cy.get('[data-name=card]:visible').contains('Test card content');
    cy.get('[data-name=card]:visible')
      .find('[data-name=vote-count]')
      .should('have.text', '0');
    cy.get('[data-name=vote-button]:visible').should('not.exist');
    cy.get('[data-name=card]:visible')
      .find('[data-name=delete-button]')
      .should('have.length', 1);
  });

  describe('when voting is open', () => {
    before(() => {
      cy.get('[data-name=menu-button]').click();
      cy.get('[data-name=voting-open-button]').click();
      cy.get('[data-name=menu-button]').click();
    });

    it('shows zero votes and an vote button', () => {
      cy.get('[data-name=card]:visible')
        .find('[data-name=vote-count]')
        .should('have.text', '0');
      cy.get('[data-name=vote-button]:visible')
        .should('have.length', 1)
        .children()
        .should('have.class', 'unvoted');
    });

    describe('when a vote is made', () => {
      before(() => {
        cy.get('[data-name=vote-button]:visible').click();
      });

      it('shows one vote and an activated vote button', () => {
        cy.get('[data-name=card]:visible')
          .find('[data-name=vote-count]')
          .should('have.text', '1');
        cy.get('[data-name=vote-button]:visible')
          .should('have.length', 1)
          .children()
          .should('not.have.class', 'unvoted');
      });
    });
  });

  describe('when the card body is clicked', () => {
    before(() => {
      cy.get('[data-name=card-body]:visible').click();
    });

    it('shows an edit box', () => {
      cy.get('[data-name=card-edit-field]').should('exist');
    });

    describe('when edit field is changed and submitted', () => {
      before(() => {
        cy.get('[data-name=card-edit-field]')
          .clear()
          .type('I changed my mind.{enter}');
      });

      it('removes the edit box and updates the card', () => {
        cy.get('[data-name=card-edit-field]').should('not.exist');
        cy.get('[data-name=card-content]').should(
          'contain',
          'I changed my mind.'
        );
      });
    });
  });

  describe('when delete is clicked', () => {
    before(() => {
      cy.get('[data-name=delete-button]:visible').click();
    });

    it('shows the confirm/cancel buttons', () => {
      cy.get('[data-name=card]:visible')
        .find('[data-name=cancel-button]')
        .should('exist');
      cy.get('[data-name=card]:visible')
        .find('[data-name=confirm-button]')
        .should('exist');
    });

    describe('when the delete is cancelled', () => {
      before(() => {
        cy.get('[data-name=cancel-button]:visible').click();
      });

      it('does not delete the card', () => {
        cy.get('[data-name=card]:visible')
          .should('exist')
          .find('[data-name=cancel-button]')
          .should('not.exist');
        cy.get('[data-name=card]:visible')
          .find('[data-name=confirm-button]')
          .should('not.exist');
      });

      after(() => {
        cy.get('[data-name=delete-button]:visible').click();
      });
    });

    describe('when the delete is confirmed', () => {
      before(() => {
        cy.get('[data-name=confirm-button]:visible').click();
      });

      it('deletes the card', () => {
        cy.get('[data-name=card]:visible').should('not.exist');
      });
    });
  });

  after(() => {
    cy.visit('/');
    cy.get('[data-name=board-list-button]').click();
    cy.get('[data-name=delete-button]').click({ multiple: true });
    cy.get('[data-name=delete-confirm-button]').click({ multiple: true });
    cy.get('[data-name=board-table]').should('not.exist');
  });
});
