/// <reference types="cypress" />

let boardUrl;

context("DragObscuredCard", () => {
  before(() => {
    cy.viewport(1280, 800);
    cy.login("owner");
    cy.visit("/");
    cy.get("[data-name=board-name-input]").type("Drag Obscured Card Board");
    cy.get("[data-name=create-button]").click();
    cy.get("[data-name=create-button]:visible").should("have.length", 0);

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Owner obscured card");
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-author-input]")
      .type("Owner{enter}");
    cy.get("[data-name=card]:visible").should("exist");

    cy.url().then((url) => {
      boardUrl = url;
    });

    // Enable open_permission so participant can drag cards (data-drag="true")
    cy.get("[data-name=menu-button]").click();
    cy.intercept("PATCH", "**/boards/**").as("enablePermission");
    cy.get("[data-name=anyone-is-owner-button]").click();
    cy.wait("@enablePermission");
    cy.get("[data-name=menu-button]").click();

    // Enable obscure cards — already on the board page, no re-visit needed
    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=obscure-cards-button]")
      .children()
      .first()
      .then(($el) => {
        if ($el.attr("data-checked") !== "true") {
          cy.intercept("PATCH", "**/boards/**").as("toggleObscure");
          cy.get("[data-name=obscure-cards-button]").click();
          cy.wait("@toggleObscure");
        }
      });
    cy.get("[data-name=menu-button]").click();

    // Pre-establish participant session so beforeEach validation succeeds
    cy.login("participant");
  });

  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.login("participant");
    cy.visit(boardUrl);
    cy.get("[data-name=rank]:visible").should("have.length.gte", 2);
    cy.get("[data-name=card]:visible").should("exist");
  });

  it("shows obscured placeholder for owner card when viewed as participant", () => {
    cy.get("[data-name=card]:visible")
      .first()
      .find("[data-name=obscured-placeholder]")
      .should("exist");
  });

  it("can drag an obscured card to the second rank", () => {
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card]:has([data-name=obscured-placeholder])")
      .as("obscuredCard");
    cy.get("[data-name=rank]:visible").eq(1).as("targetRank");

    cy.get("@obscuredCard").should("exist");

    cy.get("@obscuredCard").then(($card) => {
      const cardRect = $card[0].getBoundingClientRect();
      const startX = cardRect.left + cardRect.width / 2;
      const startY = cardRect.top + cardRect.height / 2;

      cy.get("@targetRank").then(($rank) => {
        const rankRect = $rank[0].getBoundingClientRect();
        const endX = rankRect.left + rankRect.width / 2;
        const endY = rankRect.top + 100;

        cy.get("@obscuredCard")
          .trigger("mousedown", { which: 1, clientX: startX, clientY: startY })
          .trigger("mousemove", { clientX: startX + 10, clientY: startY });

        cy.get("@targetRank")
          .trigger("mousemove", { clientX: endX, clientY: endY, force: true })
          .trigger("mouseup", { clientX: endX, clientY: endY, force: true });
      });
    });

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card]")
      .should("not.exist");
    cy.get("[data-name=rank]:visible")
      .eq(1)
      .find("[data-name=card]")
      .should("exist");
  });

  after(() => {
    cy.deleteAllBoards();
  });
});
