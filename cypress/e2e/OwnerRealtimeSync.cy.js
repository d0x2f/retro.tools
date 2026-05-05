/// <reference types="cypress" />

let boardUrl;
let boardId;

context('OwnerRealtimeSync', () => {
  before(() => {
    cy.login('owner');
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type('Owner Realtime Sync Board');
    cy.get('[data-name=create-button]').click();
    cy.get('[data-name=create-button]:visible').should('have.length', 0);

    cy.url().then((url) => {
      boardUrl = url;
      boardId = url.split('/').pop();
    });

    // Wait for onMount to finish — the store subscription is set up after ranks appear
    cy.get('[data-name=rank]:visible').should('exist');

    // Enable open_permission
    cy.get('[data-name=menu-button]').click();
    cy.intercept('PATCH', '**/boards/**').as('enablePermission');
    cy.get('[data-name=anyone-is-owner-button]').click();
    cy.wait('@enablePermission');
    cy.get('[data-name=menu-button]').click();

    // Add a card so vote buttons are rendered
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-text-input]')
      .type('Test card{enter}');
    cy.get('[data-name=card]:visible').should('exist');
  });

  it('owner sees live setting change when open_permission is active', () => {
    // Owner loads the board — with the fix, a Firestore subscription is established
    // for owners when open_permission is active
    cy.login('owner');
    // Capture the session cookie now, before cy.visit() causes the app to call
    // /auth again. In Firefox, that re-auth can overwrite __session with a new
    // anonymous-user token that doesn't own the board, causing PATCH → 403.
    cy.getCookie('__session').as('ownerSession');
    cy.visit(boardUrl);
    cy.get('[data-name=rank]:visible').should('exist');
    cy.get('[data-name=vote-button]:visible').should('exist');

    // PATCH the board via REST, bypassing the Svelte store entirely.
    // Only the Firestore subscription — not the local store listener — can deliver this update.
    cy.get('@ownerSession').then((cookie) => {
      cy.request(`/boards/${boardId}`).then(({ body }) => {
        let data = body.data;
        try {
          data = JSON.parse(data);
        } catch {}
        cy.request({
          method: 'PATCH',
          url: `/boards/${boardId}`,
          body: { ...body, data, voting_open: false },
          headers: { Cookie: `__session=${cookie.value}` },
        });
      });
    });

    // Firestore pushes the change to the owner's active subscription — no page reload needed
    cy.get('[data-name=vote-button]:visible').should('not.exist');
  });

  after(() => {
    cy.deleteAllBoards();
  });
});
