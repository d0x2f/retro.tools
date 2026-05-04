/// <reference types="cypress" />

context('LocaleSelect', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.removeItem('locale');
      },
    });
  });

  it('defaults to English when no locale preference is stored', () => {
    cy.get('[data-name=locale-select-button]').should(
      'contain.text',
      'English'
    );
    cy.get('[data-name=splash-hero]').should('have.text', 'Simple. Retros.');
  });

  it('switches the UI language when a locale is selected', () => {
    cy.get('[data-name=locale-select-button]').click();
    cy.get('[data-name=locale-select-de]').click();
    cy.get('[data-name=locale-select-button]').should(
      'contain.text',
      'Deutsch'
    );
    cy.get('[data-name=splash-hero]').should('have.text', 'Einfach. Retros.');
  });

  it('persists the selected locale across a page reload', () => {
    cy.get('[data-name=locale-select-button]').click();
    cy.get('[data-name=locale-select-de]').click();
    cy.reload();
    cy.get('[data-name=locale-select-button]').should(
      'contain.text',
      'Deutsch'
    );
    cy.get('[data-name=splash-hero]').should('have.text', 'Einfach. Retros.');
  });

  it('defaults to the browser navigator language when no locale is stored', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.removeItem('locale');
        Object.defineProperty(win.navigator, 'language', {
          value: 'de',
          configurable: true,
        });
      },
    });
    cy.get('[data-name=locale-select-button]').should(
      'contain.text',
      'Deutsch'
    );
    cy.get('[data-name=splash-hero]').should('have.text', 'Einfach. Retros.');
  });
});
