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

  it('shows the card', () => {
    cy.get('[data-name=card]:visible').should('have.length', 1);
  });

  it('shows the author', () => {
    cy.get('[data-name=card]:visible').contains('Test Author');
  });

  it('contains the card text', () => {
    cy.get('[data-name=card]:visible').contains('Test card content');
  });

  it('has vote count of zero', () => {
    cy.get('[data-name=card]:visible')
      .find('[data-name=vote-count]')
      .should('have.text', '0');
  });

  it('does not show the vote button', () => {
    cy.get('[data-name=vote-button]:visible').should('not.exist');
  });

  it('shows a delete button', () => {
    cy.get('[data-name=card]:visible')
      .find('[data-name=delete-button]')
      .should('have.length', 1);
  });

  describe('with voting opened', () => {
    before(() => {
      cy.get('[data-name=menu-button]').click();
      cy.get('[data-name=voting-open-button]').click();
      cy.get('[data-name=menu-button]').click();
    });

    it('has vote count of zero', () => {
      cy.get('[data-name=card]:visible')
        .find('[data-name=vote-count]')
        .should('have.text', '0');
    });

    it('shows the vote button with the non-voted style', () => {
      cy.get('[data-name=vote-button]:visible')
        .should('have.length', 1)
        .children()
        .should('have.class', 'unvoted');
    });

    describe('with the vote made', () => {
      before(() => {
        cy.get('[data-name=vote-button]:visible').click();
      });

      it('shows the vote button with the voted style', () => {
        cy.get('[data-name=vote-button]:visible')
          .should('have.length', 1)
          .children()
          .should('not.have.class', 'unvoted');
      });

      it('has vote count of one', () => {
        cy.get('[data-name=card]:visible')
          .find('[data-name=vote-count]')
          .should('have.text', '1');
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
        cy.get('[data-name=card]:visible').should('exist');
      });

      it('removes the confirm/cancel buttons', () => {
        cy.get('[data-name=card]:visible')
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
    cy.get('[data-name=delete-button]').each(($el) => $el.click());
    cy.get('[data-name=delete-confirm-button]').each(($el) => $el.click());
    cy.get('[data-name=board-table]').should('not.exist');
  });
});
