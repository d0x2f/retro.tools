/// <reference types="cypress" />

// Uses Chrome DevTools Protocol to cut the network after the board has loaded,
// simulating a Firestore connection drop mid-session.

function goOffline() {
  cy.wrap(
    Cypress.automation("remote:debugger:protocol", {
      command: "Network.enable",
    }),
  );
  cy.wrap(
    Cypress.automation("remote:debugger:protocol", {
      command: "Network.emulateNetworkConditions",
      params: {
        offline: true,
        latency: 0,
        downloadThroughput: 0,
        uploadThroughput: 0,
      },
    }),
  );
}

function goOnline() {
  cy.wrap(
    Cypress.automation("remote:debugger:protocol", {
      command: "Network.emulateNetworkConditions",
      params: {
        offline: false,
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1,
      },
    }),
  );
}

let boardUrl;

context("ConnectionLost", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.get("[data-name=board-name-input]").type("Connection Lost Test Board");
    cy.get("[data-name=create-button]").click();
    cy.get("[data-name=create-button]:visible").should("have.length", 0);
    cy.url().then((url) => {
      boardUrl = url;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.visit(boardUrl);
    cy.get("[data-name=rank]:visible").should("exist");
  });

  afterEach(() => {
    goOnline();
  });

  it("shows a connection lost alert when the Firestore connection drops", () => {
    goOffline();

    // The error-alert (danger/red) for connection loss should appear.
    // This test will FAIL with the current code because:
    //   1. connectionLost in Board.svelte is never set to true
    //   2. connectionLost is plain `let`, not $state, so Svelte 5 would
    //      not react to assignments even if they existed
    //   3. none of the onSnapshot calls in firestore.js register an error callback
    cy.get("[data-name=error-alert]", { timeout: 15000 }).should("be.visible");
    cy.get("[data-name=error-alert]").should("contain", "Connection lost");
  });

  after(() => {
    goOnline();
    cy.login();
    cy.intercept("boards").as("getBoards");
    cy.visit("/");
    cy.wait("@getBoards");
    cy.get("[data-name=board-list-button]").click();
    cy.get("[data-name=delete-button]").each(($el) => {
      cy.wrap($el).click();
      cy.get("[data-name=delete-confirm-button]").click();
    });
    cy.get("[data-name=board-table]").should("not.exist");
  });
});
