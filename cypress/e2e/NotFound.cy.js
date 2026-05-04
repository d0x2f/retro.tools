/// <reference types="cypress" />

context("NotFound", () => {
  it("redirects to /not-found and shows an error alert for an unknown board", () => {
    cy.login();
    cy.visit("/this-board-does-not-exist-xyz123");
    cy.url().should("include", "/not-found");
    cy.get("[data-name=error-alert]").should("be.visible");
  });
});
