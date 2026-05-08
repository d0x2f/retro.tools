// Firefox aborts in-flight fetch() calls during navigation and surfaces them
// as "NetworkError when attempting to fetch resource" unhandled rejections.
// Chrome drops the same aborted requests silently. Returning false here tells
// Cypress not to fail the test for this browser-specific behaviour.
Cypress.on('uncaught:exception', (err) => {
  // Firefox reports aborted fetch calls during navigation as NetworkError.
  if (err.message.includes('NetworkError when attempting to fetch resource')) {
    return false;
  }
  // Firebase auth can fail with this when the browser is in a simulated
  // offline state (navigator.onLine = false in Firefox).
  if (err.message.includes('auth/network-request-failed')) {
    return false;
  }
});

Cypress.Commands.add('login', (name = 'owner') => {
  cy.session(
    name,
    () => {
      cy.intercept('boards').as('getBoards');
      cy.visit('/');
      cy.wait('@getBoards');
    },
    {
      validate() {
        cy.getCookie('__session').should('exist');
      },
    }
  );
});

Cypress.Commands.add('deleteAllBoards', () => {
  cy.login('owner');
  cy.request('GET', '/boards').then((response) => {
    response.body.forEach((board) => {
      cy.request('DELETE', `/boards/${board.id}`);
    });
  });
});
