/// <reference types="cypress" />

let boardId;

context("MaxVotes", () => {
  before(() => {
    cy.login("owner");
    cy.visit("/");
    cy.get("[data-name=board-name-input]").type("Max Votes Test Board");
    cy.get("[data-name=create-button]").click();
    cy.get("[data-name=create-button]:visible").should("have.length", 0);

    cy.url().then((url) => {
      boardId = url.split("/").pop();
      cy.request("PATCH", `/boards/${boardId}`, { max_votes: 1 });
    });

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Card One");
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-author-input]")
      .type("Tester{enter}");

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Card Two");
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-author-input]")
      .type("Tester{enter}");

    cy.get("[data-name=card]:visible").should("have.length", 2);
  });

  beforeEach(() => {
    cy.login("owner");
    cy.visit("/");
    cy.get("[data-name=board-list-button]").click();
    cy.get("[data-name=board-row] td").first().click();
    cy.get("[data-name=card]:visible").should("have.length", 2);
  });

  it("allows one vote and blocks a second vote when max_votes is 1", () => {
    cy.intercept("PUT", "**/vote").as("firstVote");
    cy.get("[data-name=card]:visible")
      .first()
      .find("[data-name=vote-button]")
      .click();
    cy.wait("@firstVote");
    cy.get("[data-name=card]:visible")
      .first()
      .find("[data-name=vote-count]")
      .should("have.text", "1");

    cy.intercept("PUT", "**/vote").as("secondVote");
    cy.get("[data-name=card]:visible")
      .eq(1)
      .find("[data-name=vote-button]")
      .click();
    cy.wait("@secondVote");
    cy.get("[data-name=card]:visible")
      .eq(1)
      .find("[data-name=vote-count]")
      .should("have.text", "0");
  });

  after(() => {
    cy.deleteAllBoards();
  });
});
