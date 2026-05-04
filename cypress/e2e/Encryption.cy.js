/// <reference types="cypress" />

let boardUrl;

context('Encryption', () => {
  const boardPassword = 'test-password-123';

  before(() => {
    cy.login();
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type('Encrypted Test Board');
    cy.get('[data-name=more-settings-button]').click();
    cy.get('[data-name=encrypt-board-checkbox]').click();
    cy.get('[data-name=board-password-input]').type(boardPassword);
    cy.get('[data-name=create-button]').click();
    cy.get('[data-name=create-button]:visible').should('have.length', 0);
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-text-input]')
      .type('Secret card content');
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-author-input]')
      .type('Secret Author{enter}');
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-text-input]')
      .should('have.value', '');
    cy.url().then((url) => {
      boardUrl = url;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.visit(boardUrl);
  });

  it('shows encrypted placeholder without a password', () => {
    cy.get('[data-name=password-wall-input]').should('exist');
    cy.get('[data-name=card]').should('not.exist');
  });

  it('decrypts card content after entering the correct password', () => {
    cy.get('[data-name=password-wall-input]').type(boardPassword);
    cy.get('[data-name=password-wall-unlock-button]').click();
    cy.get('[data-name=password-wall-input]').should('not.exist');
    cy.get('[data-name=card]:visible').should('have.length', 1);
    cy.get('[data-name=card]:visible').should('not.contain', '(Encrypted)');
    cy.get('[data-name=card]:visible').should('contain', 'Secret card content');
    cy.get('[data-name=card]:visible').should('contain', 'Secret Author');
  });

  it('shows encrypted placeholder after entering the wrong password', () => {
    cy.get('[data-name=password-wall-input]').type('wrong-password');
    cy.get('[data-name=password-wall-unlock-button]').click();
    // PasswordWall should remain (shake animation, then input cleared)
    cy.get('[data-name=password-wall-input]').should('exist');
    cy.get('[data-name=card]').should('not.exist');
  });

  it('CSV export contains decrypted card content', () => {
    cy.get('[data-name=password-wall-input]').type(boardPassword);
    cy.get('[data-name=password-wall-unlock-button]').click();
    cy.get('[data-name=password-wall-input]').should('not.exist');
    cy.get('[data-name=card]:visible').should('have.length', 1);

    const csv = { content: null };
    cy.window().then((win) => {
      const original = win.URL.createObjectURL.bind(win.URL);
      cy.stub(win.URL, 'createObjectURL').callsFake((blob) => {
        blob.text().then((text) => {
          csv.content = text;
        });
        return original(blob);
      });
    });

    cy.get('[data-name=menu-button]').click();
    cy.get('[data-name=download-csv-button]').click();

    cy.wrap(csv)
      .its('content')
      .should('contain', 'Secret card content')
      .and('contain', 'Secret Author');
  });

  after(() => {
    cy.deleteAllBoards();
  });
});
