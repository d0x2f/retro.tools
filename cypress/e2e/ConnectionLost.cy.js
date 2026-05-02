/// <reference types="cypress" />

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

  it("shows a connection lost alert when the browser goes offline", () => {
    cy.window().then((win) => win.dispatchEvent(new Event("offline")));
    cy.get("[data-name=error-alert]").should("be.visible");
    cy.get("[data-name=error-alert]").should("contain", "Connection lost");
  });

  it("clears the connection lost alert when the browser comes back online", () => {
    cy.window().then((win) => win.dispatchEvent(new Event("offline")));
    cy.get("[data-name=error-alert]").should("be.visible");
    cy.window().then((win) => win.dispatchEvent(new Event("online")));
    cy.get("[data-name=error-alert]").should("not.exist");
  });

  after(() => {
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
