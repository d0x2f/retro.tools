/// <reference types="cypress" />

function setObscureCards(enabled) {
  cy.login("owner");
  cy.visit(boardUrl);
  cy.get("[data-name=rank]:visible").should("exist");
  cy.get("[data-name=menu-button]").click();
  cy.get("[data-name=obscure-cards-button]")
    .children()
    .first()
    .then(($el) => {
      const current = $el.attr("data-checked") === "true";
      if (current !== enabled) {
        cy.intercept("PATCH", "**/boards/**").as("toggleObscure");
        cy.get("[data-name=obscure-cards-button]").click();
        cy.wait("@toggleObscure");
      }
    });
  cy.get("[data-name=menu-button]").click();
}

let boardUrl;

context("ObscureCards", () => {
  before(() => {
    cy.login("owner");
    cy.visit("/");
    cy.get("[data-name=board-name-input]").type("Obscure Cards Board");
    cy.get("[data-name=create-button]").click();
    cy.get("[data-name=create-button]:visible").should("have.length", 0);

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Owner card text");
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-author-input]")
      .type("Owner{enter}");
    cy.get("[data-name=card]:visible").should("exist");

    cy.url().then((url) => {
      boardUrl = url;
    });
  });

  context("as board owner", () => {
    beforeEach(() => {
      cy.login("owner");
      cy.visit(boardUrl);
      cy.get("[data-name=rank]:visible").should("exist");
    });

    it("shows the obscure cards toggle in the menu", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=obscure-cards-button]").should("be.visible");
    });

    it("is off by default", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=obscure-cards-button]")
        .children()
        .first()
        .should("have.attr", "data-checked", "false");
      cy.get("[data-name=menu-button]").click();
    });

    it("can toggle obscure cards on and off", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=obscure-cards-button]").click();
      cy.get("[data-name=obscure-cards-button]")
        .children()
        .first()
        .should("have.attr", "data-checked", "true");

      cy.get("[data-name=obscure-cards-button]").click();
      cy.get("[data-name=obscure-cards-button]")
        .children()
        .first()
        .should("have.attr", "data-checked", "false");
      cy.get("[data-name=menu-button]").click();
    });

    it("still sees own card content when obscure cards is enabled", () => {
      setObscureCards(true);
      cy.get("[data-name=card]:visible")
        .first()
        .find("[data-name=card-content]")
        .should("contain", "Owner card text");
      cy.get("[data-name=card]:visible")
        .first()
        .find("[data-name=obscured-placeholder]")
        .should("not.exist");
    });

    it("can still edit own card when obscure cards is enabled", () => {
      cy.get("[data-name=card-content]:visible").first().click();
      cy.get("[data-name=card-edit-field]").should("exist");
      cy.get("[data-name=card-edit-field]").type("{esc}");
    });
  });

  context("as participant when obscure cards is enabled", () => {
    before(() => {
      setObscureCards(true);

      cy.login("participant");
      cy.visit(boardUrl);
      cy.get("[data-name=rank]:visible")
        .first()
        .find("[data-name=card-text-input]")
        .type("Participant card text");
      cy.get("[data-name=rank]:visible")
        .first()
        .find("[data-name=card-author-input]")
        .type("Participant{enter}");
      cy.get("[data-name=card]:visible").should("have.length.at.least", 2);
    });

    beforeEach(() => {
      cy.login("participant");
      cy.visit(boardUrl);
      cy.get("[data-name=card]:visible").should("have.length.at.least", 2);
    });

    it("does not see the content of cards created by others", () => {
      cy.get("[data-name=card]:visible").each(($card) => {
        const isOwn =
          $card.find("[data-name=obscured-placeholder]").length === 0;
        if (!isOwn) {
          cy.wrap($card)
            .find("[data-name=card-content]")
            .should("not.contain", "Owner card text");
          cy.wrap($card)
            .find("[data-name=obscured-placeholder]")
            .should("exist");
        }
      });
    });

    it("sees own card content unobscured", () => {
      cy.get("[data-name=card]:visible")
        .filter(":not(:has([data-name=obscured-placeholder]))")
        .find("[data-name=card-content]")
        .should("contain", "Participant card text");
    });

    it("cannot click to edit an obscured card", () => {
      cy.get("[data-name=card]:visible")
        .filter(":has([data-name=obscured-placeholder])")
        .should("have.length.at.least", 1)
        .first()
        .find("[data-name=card-content]")
        .click();
      cy.get("[data-name=card-edit-field]").should("not.exist");
    });

    it("has the obscure cards toggle disabled", () => {
      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=obscure-cards-button]").should(
        "have.class",
        "disabled",
      );
      cy.get("[data-name=menu-button]").click();
    });
  });

  context("as participant when obscure cards is disabled", () => {
    beforeEach(() => {
      setObscureCards(false);
      cy.login("participant");
      cy.visit(boardUrl);
      cy.get("[data-name=card]:visible").should("have.length.at.least", 2);
    });

    it("sees all card content", () => {
      cy.get("[data-name=card]:visible")
        .find("[data-name=obscured-placeholder]")
        .should("not.exist");
      cy.get("[data-name=card-content]:visible").should(
        "contain",
        "Owner card text",
      );
    });
  });

  after(() => {
    cy.deleteAllBoards();
  });
});
