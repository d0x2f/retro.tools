/// <reference types="cypress" />

function setOpenPermission(enabled) {
  cy.login("owner");
  cy.visit(boardUrl);
  // Wait for onMount to finish (subscription is set up after ranks are visible)
  cy.get("[data-name=rank]:visible").should("exist");
  cy.get("[data-name=menu-button]").click();
  cy.get("[data-name=anyone-is-owner-button]")
    .children()
    .first()
    .then(($el) => {
      const current = $el.attr("data-checked") === "true";
      if (current !== enabled) {
        cy.intercept("PATCH", "**/boards/**").as("togglePermission");
        cy.get("[data-name=anyone-is-owner-button]").click();
        cy.wait("@togglePermission");
      }
    });
  cy.get("[data-name=menu-button]").click();
}

let boardUrl;

context("OpenPermission", () => {
  before(() => {
    cy.login("owner");
    cy.visit("/");
    cy.get("[data-name=board-name-input]").type("Open Permission Board");
    cy.get("[data-name=create-button]").click();
    cy.get("[data-name=create-button]:visible").should("have.length", 0);

    // Create a card as owner so participants have something to try editing/deleting
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Owner card{enter}");
    cy.get("[data-name=card]:visible").should("exist");

    cy.url().then((url) => {
      boardUrl = url;
    });
  });

  context("as board owner", () => {
    beforeEach(() => {
      cy.login("owner");
      cy.visit(boardUrl);
    });

    it("shows the everyone is admin toggle", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=anyone-is-owner-button]").should("be.visible");
    });

    it("is off by default", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=anyone-is-owner-button]")
        .children()
        .first()
        .should("have.attr", "data-checked", "false");
    });

    it("can toggle everyone is admin on and off", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=anyone-is-owner-button]").click();
      cy.get("[data-name=anyone-is-owner-button]")
        .children()
        .first()
        .should("have.attr", "data-checked", "true");

      cy.get("[data-name=anyone-is-owner-button]").click();
      cy.get("[data-name=anyone-is-owner-button]")
        .children()
        .first()
        .should("have.attr", "data-checked", "false");
    });

    it("can edit a card created by a participant", () => {
      cy.login("participant");
      cy.visit(boardUrl);
      cy.get("[data-name=rank]:visible")
        .first()
        .find("[data-name=card-text-input]")
        .type("Participant card{enter}");
      cy.get("[data-name=card]:visible").should("have.length.at.least", 2);

      cy.login("owner");
      cy.visit(boardUrl);
      cy.get("[data-name=card-content]:visible").last().click();
      cy.get("[data-name=card-edit-field]").should("exist");
      cy.get("[data-name=card-edit-field]")
        .clear()
        .type("Owner edited this{enter}");
      cy.get("[data-name=card-edit-field]").should("not.exist");
      cy.get("[data-name=card-content]:visible")
        .last()
        .should("contain", "Owner edited this");
    });

    it("can delete a card created by a participant", () => {
      cy.get("[data-name=card]:visible")
        .last()
        .find("[data-name=delete-button]:visible")
        .should("exist");
    });
  });

  context("as participant without open_permission", () => {
    beforeEach(() => {
      setOpenPermission(false);
      cy.login("participant");
      cy.visit(boardUrl);
    });

    it("does not see the everyone is admin toggle", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=anyone-is-owner-button]").should("not.exist");
    });

    it("does not see the add column button", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=add-column-button]").should("not.exist");
    });

    it("has board controls disabled", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=cards-open-button]").should("have.class", "disabled");
      cy.get("[data-name=voting-open-button]").should("have.class", "disabled");
    });

    it("does not see the column delete button", () => {
      cy.get("[data-name=rank]:visible")
        .first()
        .find("[data-name=rank-header] [data-name=delete-button]")
        .should("not.exist");
    });

    it("cannot edit cards created by others", () => {
      cy.get("[data-name=card-content]:visible").first().click();
      cy.get("[data-name=card-edit-field]").should("not.exist");
    });

    it("cannot delete cards created by others", () => {
      cy.get("[data-name=card]:visible")
        .first()
        .find("[data-name=delete-button]")
        .should("not.exist");
    });
  });

  context("as participant with open_permission enabled", () => {
    beforeEach(() => {
      setOpenPermission(true);
      cy.login("participant");
      cy.visit(boardUrl);
    });

    it("does not see the everyone is admin toggle", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=anyone-is-owner-button]").should("not.exist");
    });

    it("sees the add column button", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=add-column-button]").should("be.visible");
    });

    it("has board controls enabled", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=cards-open-button]").should(
        "not.have.class",
        "disabled",
      );
      cy.get("[data-name=voting-open-button]").should(
        "not.have.class",
        "disabled",
      );
    });

    it("can toggle card creation", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=cards-open-button]").click();
      cy.get("[data-name=menu-button]").click();

      cy.get("[data-name=rank]:visible")
        .first()
        .find("[data-name=card-text-input]")
        .type("Should be blocked{enter}")
        .should("have.value", "Should be blocked")
        .clear();
      cy.get("[data-name=warning-alert]:visible").should("exist");
      cy.get("[data-name=warning-alert]").should("not.exist");

      // Restore
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=cards-open-button]").click();
      cy.get("[data-name=menu-button]").click();
    });

    it("can toggle voting", () => {
      cy.get("[data-name=vote-button]:visible").should("exist");

      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=voting-open-button]").click();
      cy.get("[data-name=menu-button]").click();

      cy.get("[data-name=vote-button]:visible").should("not.exist");

      // Restore
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=voting-open-button]").click();
      cy.get("[data-name=menu-button]").click();
    });

    it("can add and delete a column", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=add-column-button]").click();

      if (Cypress.config("viewportWidth") < 992) {
        cy.get("[data-name=rank-tabs] > label").contains("Untitled").click();
      }

      cy.get("[data-name=card-text-input][placeholder='Untitled']:visible")
        .should("exist")
        .closest("[data-name=rank]")
        .within(() => {
          cy.get(
            "[data-name=rank-header] [data-name=delete-button]:visible",
          ).click();
          cy.get("[data-name=rank-header] [data-name=confirm-button]")
            .should("exist")
            .click({ force: true });
        });
    });

    it("can edit a card created by the owner", () => {
      cy.get("[data-name=card-content]:visible").first().click();
      cy.get("[data-name=card-edit-field]").should("exist");
      cy.get("[data-name=card-edit-field]")
        .clear()
        .type("Participant edited this{enter}");
      cy.get("[data-name=card-edit-field]").should("not.exist");
      cy.get("[data-name=card-content]:visible")
        .first()
        .should("contain", "Participant edited this");
    });

    it("can delete a card created by the owner", () => {
      cy.get("[data-name=card]:visible")
        .first()
        .find("[data-name=delete-button]:visible")
        .should("exist");
    });
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
