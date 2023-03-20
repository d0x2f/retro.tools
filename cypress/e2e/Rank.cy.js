/// <reference types="cypress" />

context("Columns", () => {
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

  it("can create a new column and delete it", () => {
    cy.get("[data-name=rank]:visible").should("have.length", 4);

    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=add-column-button]").click();

    cy.get("[data-name=rank]:visible").should("have.length", 5);
    cy.get("[data-name=rank]:visible")
      .last()
      .find("[data-name=card-text-input]")
      .invoke("attr", "placeholder")
      .should("eq", "Untitled");
    cy.get("[data-name=rank]:visible")
      .last()
      .find(".feather-plus")
      .should("exist");

    cy.get("[data-name=rank]:visible")
      .last()
      .find("[data-name=rank-header] [data-name=delete-button]:visible")
      .click();
    cy.get("[data-name=rank]:visible")
      .last()
      .find("[data-name=rank-header] [data-name=cancel-button]:visible")
      .click();
    cy.get("[data-name=rank]:visible")
      .last()
      .find("[data-name=rank-header] [data-name=cancel-button]:visible")
      .should("not.exist");
    cy.get("[data-name=rank]:visible")
      .last()
      .find("[data-name=rank-header] [data-name=confirm-button]:visible")
      .should("not.exist");

    cy.get("[data-name=rank]:visible")
      .last()
      .find("[data-name=rank-header] [data-name=delete-button]:visible")
      .click();
    cy.get("[data-name=rank]:visible")
      .last()
      .find("[data-name=rank-header] [data-name=confirm-button]:visible")
      .click();

    cy.get("[data-name=rank]:visible").should("have.length", 4);
    cy.get('[data-name=rank] textarea[placeholder="Untitled"]').should(
      "not.exist"
    );
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
