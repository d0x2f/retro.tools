/// <reference types="cypress" />

import { load as loadYaml } from "js-yaml";

context("Template", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.get("[data-name=board-name-input]").type("Template Test Board");
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

  it("shows the download template button in the menu", () => {
    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=download-template-button]").should("be.visible");
    cy.get("[data-name=menu-button]").click();
  });

  it("downloads the board template as YAML with retro-tools prefix", () => {
    // Wait for board data to fully load before downloading (board.name must be set)
    cy.get("[data-name=rank]:visible").should("have.length.at.least", 1);

    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=download-template-button]").click();

    cy.readFile(
      "cypress/downloads/retro-tools-Template Test Board-template.yaml",
    ).then((text) => {
      const doc = loadYaml(text);
      expect(doc.columns).to.have.length(4);
      // Columns appear in position order
      expect(doc.columns[0]).to.include({
        name: "Drop",
        icon: "delete",
        color: "red",
        key: "board.template.drop_add_keep_improve.column.drop",
      });
      expect(doc.columns[3].name).to.eq("Improve");
    });
  });

  it("can import a YAML template and create a board from it", () => {
    cy.visit("/");
    cy.get("[data-name=more-settings-button]").click();
    cy.get('input[type="file"]').selectFile("cypress/fixtures/template.yaml", {
      force: true,
    });
    cy.get("select").should("have.value", "custom");
    cy.get("select option[value=custom]").should(
      "have.text",
      "Custom (imported)",
    );

    cy.get("[data-name=board-name-input]").type("Imported Board");
    cy.get("[data-name=create-button]").click();
    cy.get("[data-name=create-button]:visible").should("have.length", 0);

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .should("have.attr", "placeholder", "Went well");
  });

  it("shows an error for an invalid template file", () => {
    cy.visit("/");
    cy.get("[data-name=more-settings-button]").click();
    cy.get('input[type="file"]').selectFile(
      { contents: Cypress.Buffer.from(""), fileName: "empty.yaml" },
      { force: true },
    );
    cy.get("[data-name=error-alert]").should("be.visible");
    cy.get("[data-name=error-alert]").should(
      "have.text",
      "Invalid template file",
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
