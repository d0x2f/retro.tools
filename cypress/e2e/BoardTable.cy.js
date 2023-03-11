/// <reference types="cypress" />

context("BoardTable", () => {
  context("With no existing boards", () => {
    it("does not show the board list table", () => {
      cy.login("owner");
      cy.visit("/");
      cy.get("[data-name=board-list-button]").should("not.exist");
      cy.get("[data-name=board-table]").should("not.exist");
    });
  });

  context("With an existing board", () => {
    before(() => {
      cy.login("owner");
      cy.visit("/");
      cy.get("[data-name=board-name-input]").type("Test Board Name");
      cy.get("[data-name=create-button]").click();
      cy.get("[data-name=rank]").should("exist");
      cy.visit("/");
      cy.get("[data-name=board-list-button]").click();
    });

    context("As the owner", () => {
      it("has a row for the board including the delete button", () => {
        cy.get("[data-name=board-table]").should("exist");
        cy.get("[data-name=board-row]").should("have.length", 1);
        cy.get("[data-name=board-row]")
          .first()
          .find("[data-name=delete-button]")
          .should("exist");
      });
    });

    context("As a participant", () => {
      let boardId;
      before(() => {
        cy.login("owner");
        cy.visit("/");
        // Find the board id
        cy.get("[data-name=board-list-button]").click();
        cy.get("[data-name=board-row]")
          .first()
          .invoke("attr", "data-board-id")
          .then((v) => {
            boardId = v;

            // Visit the board and come back to give access to the participant
            cy.login("participant");
            cy.visit(`/${boardId}`);
            cy.get("[data-name=rank]").should("exist");
            cy.reload();
            cy.visit("/");
            cy.get("[data-name=board-list-button]").click();
          });
      });

      it("shows a row for the board without the delete button", () => {
        cy.get("[data-name=board-table]").should("exist");
        cy.get("[data-name=board-row]").should("have.length", 1);
        cy.get("[data-name=board-row]")
          .first()
          .should("have.attr", "data-board-id", boardId);
        cy.get("[data-name=board-row]")
          .first()
          .find("[data-name=delete-button]")
          .should("not.exist");
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
});
