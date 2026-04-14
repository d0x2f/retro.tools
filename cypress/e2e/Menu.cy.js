/// <reference types="cypress" />

context("Menu", () => {
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

  it("has the expected default settings", () => {
    cy.get("[data-name=cards-open-button]")
      .children()
      .first()
      .should("have.attr", "data-checked", "true");
    cy.get("[data-name=voting-open-button]")
      .children()
      .first()
      .should("have.attr", "data-checked", "true");
    cy.get("[data-name=sort-button]")
      .children()
      .first()
      .should("have.attr", "data-checked", "false");
    cy.get("[data-name=show-qr-button]")
      .children()
      .first()
      .should("have.attr", "data-checked", "false");
  });

  it("shows all the buttons", () => {
    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=cards-open-button]").should("be.visible");
    cy.get("[data-name=voting-open-button]").should("be.visible");
    cy.get("[data-name=sort-button]").should("be.visible");
    cy.get("[data-name=copy-link-button]").should("be.visible");
    cy.get("[data-name=download-csv-button]").should("be.visible");

    // This button only shows on viewports with width >= 992px
    if (Cypress.config("viewportWidth") >= 992) {
      cy.get("[data-name=show-qr-button]").should("be.visible");
    } else {
      cy.get("[data-name=show-qr-button]").should("not.be.visible");
    }

    cy.get("[data-name=menu-button]").click();
  });

  it("can toggle card creation", () => {
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Test card content{enter}")
      .should("have.value", "");
    cy.get("[data-name=card]:visible").should("exist");

    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=cards-open-button]").click();
    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Test card content{enter}")
      .should("have.value", "Test card content")
      .clear();

    cy.get("[data-name=warning-alert]:visible").should(
      "have.text",
      "Card creation is disabled, enable it using the drop down menu in the top right.",
    );
    // Ensure it goes away
    cy.get("[data-name=warning-alert]").should("not.exist");

    cy.get("[data-name=card]")
      .find("[data-name=delete-button]:visible")
      .click({ multiple: true });
    cy.get("[data-name=confirm-button]:visible").click({ multiple: true });
    cy.get("[data-name=card]").should("not.exist");

    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=cards-open-button]").click();
    cy.get("[data-name=menu-button]").click();
  });

  it("can toggle voting", () => {
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type("Test card content{enter}")
      .should("have.value", "");

    cy.get("[data-name=vote-button]:visible").should("exist");

    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=voting-open-button]").click();
    cy.get("[data-name=menu-button]").click();

    cy.get("[data-name=vote-button]:visible").should("not.exist");

    cy.get("[data-name=card]")
      .find("[data-name=delete-button]:visible")
      .click({ multiple: true });
    cy.get("[data-name=confirm-button]:visible").click({ multiple: true });
    cy.get("[data-name=card]").should("not.exist");
  });

  if (Cypress.config("viewportWidth") >= 992) {
    it("can toggle the qr code", () => {
      cy.get("[data-name=qr-code]").should("not.exist");

      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=show-qr-button]").click();
      cy.get("[data-name=menu-button]").click();

      cy.get("[data-name=qr-code]").should("be.visible");

      cy.get("[data-name=menu-button]").click();
      cy.get("[data-name=show-qr-button]").click();
      cy.get("[data-name=menu-button]").click();
    });
  }

  it("downloads a csv with decrypted card content", () => {
    const cardText = "My CSV test card";
    const cardAuthor = "CSV Author";

    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-text-input]")
      .type(cardText);
    cy.get("[data-name=rank]:visible")
      .first()
      .find("[data-name=card-author-input]")
      .type(`${cardAuthor}{enter}`);
    cy.get("[data-name=card]:visible").should("exist");

    cy.get("[data-name=menu-button]").click();
    cy.get("[data-name=download-csv-button]").click();

    const date = new Date().toISOString().slice(0, 10);
    cy.readFile(`cypress/downloads/Test Board Name-${date}.csv`).then((csv) => {
      const [header, ...rows] = csv.trim().split("\n");
      expect(header).to.eq("column,author,text,created_at,votes");
      const match = rows.find(
        (row) => row.includes(cardText) && row.includes(cardAuthor),
      );
      expect(match).to.exist;
    });

    cy.get("[data-name=card]")
      .find("[data-name=delete-button]:visible")
      .click({ multiple: true });
    cy.get("[data-name=confirm-button]:visible").click({ multiple: true });
    cy.get("[data-name=card]").should("not.exist");
  });

  it("has the board link as its clipboard data", () => {
    cy.get("[data-name=copy-link-button]")
      .should("have.attr", "data-clipboard-text")
      .and("match", /http:\/\/localhost:\d+\/[a-zA-Z0-9]+/i);
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
