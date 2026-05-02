/// <reference types="cypress" />

let boardUrl;
let boardId;

context("OwnerRealtimeSync", () => {
  before(() => {
    cy.login("owner");
    cy.visit("/");
    cy.get("[data-name=board-name-input]").type("Owner Realtime Sync Board");
    cy.get("[data-name=create-button]").click();
    cy.get("[data-name=create-button]:visible").should("have.length", 0);

    cy.url().then((url) => {
      boardUrl = url;
      boardId = url.split("/").pop();
    });

    // Enable open_permission so participants can change board settings
    cy.get("[data-name=menu-button]").click();
    cy.intercept("PATCH", "**/boards/**").as("enablePermission");
    cy.get("[data-name=anyone-is-owner-button]").click();
    cy.wait("@enablePermission");
    cy.get("[data-name=menu-button]").click();

    // Add a card so vote buttons are rendered
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Test card{enter}");
    cy.get("[data-name=card]:visible").should("exist");

    // Prime participant session cache so later cy.login("participant") doesn't navigate
    cy.login("participant");
    cy.visit(boardUrl);
    cy.get("[data-name=rank]:visible").should("exist");
  });

  it("owner sees live setting change made by an open_permission participant", () => {
    // Owner loads the board — Firestore subscription is established because open_permission is active
    cy.login("owner");
    cy.visit(boardUrl);
    cy.get("[data-name=rank]:visible").should("exist");
    cy.get("[data-name=vote-button]:visible").should("exist");

    // Switch to participant session and PATCH the board to disable voting.
    // cy.session swaps cookies but not IndexedDB, so the owner's Firebase auth
    // and Firestore subscription remain active in memory on the loaded page.
    cy.login("participant");
    cy.request(`/boards/${boardId}`).then(({ body }) => {
      let data = body.data;
      try {
        data = JSON.parse(data);
      } catch {}
      cy.request({
        method: "PATCH",
        url: `/boards/${boardId}`,
        body: { ...body, data, voting_open: false },
      });
    });

    // Restore owner session — page is still on the board, Firestore listener still active
    cy.login("owner");

    // Owner's subscription delivers the change without a page reload
    cy.get("[data-name=vote-button]:visible").should("not.exist");
  });

  after(() => {
    cy.login("owner");
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
