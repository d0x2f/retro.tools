/// <reference types="cypress" />

context("Encryption", () => {
  const boardPassword = "test-password-123";

  before(() => {
    cy.login();
    cy.visit("/");
    cy.get("[data-name=board-name-input]").type("Encrypted Test Board");
    cy.get("[data-name=more-settings-button]").click();
    cy.get("[data-name=encrypt-board-checkbox]").click();
    cy.get("[data-name=board-password-input]").type(boardPassword);
    cy.get("[data-name=create-button]").click();
    cy.get("[data-name=create-button]:visible").should("have.length", 0);
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Secret card content");
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-author-input]")
      .type("Secret Author{enter}");
  });

  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get("[data-name=board-list-button]").click();
    cy.get("[data-name=board-row] td").first().click();
  });

  it("shows encrypted placeholder without a password", () => {
    cy.get("[data-name=password-wall-input]").should("exist");
    cy.get("[data-name=card]").should("not.exist");
  });

  it("decrypts card content after entering the correct password", () => {
    cy.get("[data-name=password-wall-input]").type(boardPassword);
    cy.get("[data-name=password-wall-unlock-button]").click();
    cy.get("[data-name=password-wall-input]").should("not.exist");
    cy.get("[data-name=card]:visible").should("have.length", 1);
    cy.get("[data-name=card]:visible").should("not.contain", "(Encrypted)");
    cy.get("[data-name=card]:visible").should("contain", "Secret card content");
    cy.get("[data-name=card]:visible").should("contain", "Secret Author");
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
