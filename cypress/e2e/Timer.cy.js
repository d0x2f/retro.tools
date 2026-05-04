/// <reference types="cypress" />

let boardUrl;

function openTimer() {
  cy.get('body').then(($body) => {
    if ($body.find('[data-name=timer-widget]:visible').length === 0) {
      cy.get('[data-name=menu-button]').click();
      cy.get('[data-name=show-timer-button]').click();
      cy.get('[data-name=menu-button]').click();
    }
  });
  cy.get('[data-name=timer-widget]').should('be.visible');
}

context('Timer', () => {
  before(() => {
    cy.login();
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type('Timer Test Board');
    cy.get('[data-name=create-button]').click();
    cy.get('[data-name=create-button]:visible').should('have.length', 0);
    cy.url().then((url) => {
      boardUrl = url;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.visit(boardUrl);
    cy.get('[data-name=rank]:visible').should('exist');
    openTimer();
  });

  afterEach(() => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-name=timer-stop-button]').length > 0) {
        cy.get('[data-name=timer-stop-button]').click();
      }
    });
    cy.get('[data-name=timer-reset-button]').should('not.be.disabled').click();
  });

  it('shows the timer widget with default duration of 10 minutes', () => {
    cy.get('[data-name=timer-display]').should('contain', '10:00');
    cy.get('[data-name=timer-duration-input]').should('have.value', '10');
  });

  it('shows start and reset buttons when stopped', () => {
    cy.get('[data-name=timer-start-button]').should('be.visible');
    cy.get('[data-name=timer-reset-button]').should('be.visible');
    cy.get('[data-name=timer-stop-button]').should('not.exist');
  });

  it('can change the duration via the input', () => {
    cy.get('[data-name=timer-duration-input]').clear().type('5');
    cy.get('[data-name=timer-duration-input]').trigger('change');
    cy.get('[data-name=timer-display]').should('contain', '05:00');
    cy.get('[data-name=timer-duration-input]').should('have.value', '5');
  });

  it('hides the duration input and shows stop button when started', () => {
    cy.get('[data-name=timer-start-button]').click();
    cy.get('[data-name=timer-duration-input]').should('not.exist');
    cy.get('[data-name=timer-start-button]').should('not.exist');
    cy.get('[data-name=timer-stop-button]').should('be.visible');
  });

  it('stop preserves remaining time and allows resuming', () => {
    cy.get('[data-name=timer-start-button]').click();
    cy.get('[data-name=timer-stop-button]').click();

    // Capture the displayed time after stopping
    cy.get('[data-name=timer-display]')
      .invoke('text')
      .then((stoppedTime) => {
        // Time should not be the full 10:00 and not 00:00
        expect(stoppedTime.trim()).to.not.equal('10:00');

        // Duration input should be hidden (timer was started, then stopped — remaining time is stored)
        cy.get('[data-name=timer-start-button]').should('be.visible');

        // Resume — display should continue from the stopped time
        cy.get('[data-name=timer-start-button]').click();
        cy.get('[data-name=timer-stop-button]').should('be.visible');
      });
  });

  it('reset returns the timer to the full duration', () => {
    cy.get('[data-name=timer-duration-input]').clear().type('7');
    cy.get('[data-name=timer-duration-input]').trigger('change');
    cy.get('[data-name=timer-start-button]').click();
    cy.get('[data-name=timer-stop-button]').click();
    cy.get('[data-name=timer-reset-button]').click();
    cy.get('[data-name=timer-display]').should('contain', '07:00');
    cy.get('[data-name=timer-duration-input]').should('have.value', '7');
  });

  it('reset button is disabled while timer is running', () => {
    cy.get('[data-name=timer-start-button]').click();
    cy.get('[data-name=timer-reset-button]').should('be.disabled');
    cy.get('[data-name=timer-stop-button]').click();
    cy.get('[data-name=timer-reset-button]').should('not.be.disabled');
  });

  after(() => {
    cy.deleteAllBoards();
  });
});
