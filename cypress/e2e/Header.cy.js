/// <reference types="cypress" />

context("Header", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.get("[data-name=board-name-input]").type("Test Board Name");
    cy.get("[data-name=create-button]").click();
    cy.get("[data-name=create-button]:visible").should("have.length", 0);
  });

  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get("[data-name=board-list-button]").click();
    cy.get("[data-name=board-row] td").first().click();
    cy.get("[data-name=create-button]:visible").should("have.length", 0);
  });

  it("shows the app title, board title and configuration buttons", () => {
    cy.get("[data-name=board-title]:visible")
      .should("have.length", 1)
      .should("have.text", "Test Board Name");
    cy.get("[data-name=home-link]")
      .should("be.visible")
      .should("have.text", "retro.tools");
    cy.get("[data-name=locale-select-button]").should("be.visible");
    cy.get("[data-name=menu-button]").should("be.visible");
  });

  // Title is only editable on viewports with width >= 992px
  if (Cypress.config("viewportWidth") >= 992) {
    it("allows updating the board title", () => {
      // wait for board contents to fully load
      cy.get("[data-name=rank]:visible").should("have.length", 4);
      cy.get("[data-name=board-title]:visible").click();
      cy.get("[data-name=board-title-edit-field]")
        .should("have.length", 1)
        .should("have.value", "Test Board Name")
        .clear()
        .type("My New Board Title{enter}")
        .should("not.exist");
      cy.get("[data-name=board-title]:visible")
        .should("have.length", 1)
        .should("have.text", "My New Board Title");
    });
  }

  it("navigates to the splash page when the title is clicked", () => {
    cy.get("[data-name=home-link]").click();
    cy.url().should("match", new RegExp(`${Cypress.config().baseUrl}/?`));
  });

  after(() => {
    cy.login();
    cy.intercept("boards").as("getBoards");
    cy.visit("/");
    cy.wait("@getBoards");
    cy.get("[data-name=board-list-button]").should("have.length", 1);
    cy.get("[data-name=board-list-button]").click();
    cy.get("[data-name=delete-button]").each(($el) => {
      cy.wrap($el).click();
      cy.get("[data-name=delete-confirm-button]").click();
    });
    cy.get("[data-name=board-table]").should("not.exist");
  });
});
