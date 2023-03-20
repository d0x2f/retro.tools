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

  it("can modify a columns title", () => {
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=rank-options]")
      .should("not.exist");

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=rank-options-button]")
      .click();

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=rank-options]")
      .should("exist");

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .invoke("attr", "placeholder")
      .should("eq", "Drop");

    cy.intercept({ method: "patch", url: "boards/*/columns/*" }).as(
      "patchColumn"
    );
    cy.get("[data-name=rank-options] input")
      .first()
      .clear()
      .type("New Title{enter}");
    cy.wait("@patchColumn");

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .invoke("attr", "placeholder")
      .should("eq", "New Title");
  });

  it("can modify a columns color", () => {
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=rank-options]")
      .should("not.exist");

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=rank-options-button]")
      .click();

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=rank-options]")
      .should("exist");

    cy.get("[data-name=rank-header] > div")
      .first()
      .invoke("attr", "style")
      .then((originalStyle) => {
        cy.intercept({ method: "patch", url: "boards/*/columns/*" }).as(
          "patchColumn"
        );
        cy.get("[data-name=rank-options-colors] > button:visible")
          .last()
          .click();
        cy.wait("@patchColumn");

        cy.get("[data-name=rank-header] > div")
          .first()
          .invoke("attr", "style")
          .as("newStyle");

        cy.get("[data-name=rank-header] > div")
          .first()
          .invoke("attr", "style")
          .should("not.eq", originalStyle);
      });
  });

  it("can modify a columns icon", () => {
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=rank-options]")
      .should("not.exist");

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=rank-options-button]")
      .click();

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=rank-options]")
      .should("exist");

    cy.get("[data-name=rank-options-button] > svg.feather-delete").should(
      "exist"
    );

    cy.get("[data-name=rank-options-button] > svg.feather-award").should(
      "not.exist"
    );

    cy.intercept({ method: "patch", url: "boards/*/columns/*" }).as(
      "patchColumn"
    );
    cy.get("[data-name=rank-options-icons] > div:visible").last().click();
    cy.wait("@patchColumn");

    cy.get("[data-name=rank-options-button] > svg.feather-award").should(
      "exist"
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
