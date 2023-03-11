/// <reference types="cypress" />

context("Card", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.get("[data-name=board-name-input]").type("Test Board Name");
    cy.get("[data-name=create-button]").click();
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Test card content");
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-author-input]")
      .type("Test Author{enter}");
  });

  beforeEach(() => {
    cy.login();
    cy.visit("/");
    cy.get("[data-name=board-list-button]").click();
    cy.get("[data-name=board-row] td").first().click();
  });

  it("shows the card with expected content", () => {
    cy.get("[data-name=card]:visible")
      .should("have.length", 1)
      .contains("Test Author");
    cy.get("[data-name=card]:visible").contains("Test card content");
    cy.get("[data-name=card]:visible")
      .find("[data-name=vote-count]")
      .should("have.text", "0");
    cy.get("[data-name=vote-button]:visible");
    cy.get("[data-name=card]:visible")
      .find("[data-name=delete-button]")
      .should("have.length", 1);
  });

  it("can edit the card", () => {
    cy.get("[data-name=card-body]:visible").click();
    cy.get("[data-name=card-edit-field]").should("exist");

    cy.get("[data-name=card-edit-field]")
      .clear()
      .type("I changed my mind.{enter}");
    cy.get("[data-name=card-edit-field]").should("not.exist");
    cy.get("[data-name=card-content]").should("contain", "I changed my mind.");
  });

  it("can vote on the card", () => {
    cy.get("[data-name=vote-button]:visible").click();
    cy.get("[data-name=card]:visible")
      .find("[data-name=vote-count]")
      .should("have.text", "1");
    cy.get("[data-name=vote-button]:visible")
      .should("have.length", 1)
      .children()
      .should("not.have.class", "unvoted");
  });

  it("cannot vote when voting is disabled", () => {
    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=voting-open-button]").click();
    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=card]:visible")
      .find("[data-name=vote-count]")
      .should("have.text", "1");
    cy.get("[data-name=vote-button]:visible").should("not.exist");
  });

  it("can delete the card", () => {
    cy.log("shows the confirm/cancel buttons");
    cy.get("[data-name=delete-button]:visible").click();
    cy.get("[data-name=card]:visible")
      .find("[data-name=cancel-button]")
      .should("exist");
    cy.get("[data-name=card]:visible")
      .find("[data-name=confirm-button]")
      .should("exist");

    cy.log("hides the buttons when cancelled");
    cy.get("[data-name=cancel-button]:visible").click();
    cy.get("[data-name=card]:visible")
      .should("exist")
      .find("[data-name=cancel-button]")
      .should("not.exist");
    cy.get("[data-name=card]:visible")
      .find("[data-name=confirm-button]")
      .should("not.exist");

    cy.log("deletes the card when confirmed");
    cy.get("[data-name=delete-button]:visible").click();
    cy.get("[data-name=confirm-button]:visible").click();
    cy.get("[data-name=card]:visible").should("not.exist");
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
