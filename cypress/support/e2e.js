Cypress.Commands.add("login", (name = "user") => {
  cy.session(
    name,
    () => {
      cy.intercept("boards").as("getBoards");
      cy.visit("/");
      cy.wait("@getBoards");
    },
    {
      validate() {
        cy.getCookie("__session").should("exist");
      },
    },
  );
});

Cypress.Commands.add("deleteAllBoards", () => {
  cy.request("GET", "/boards").then((response) => {
    response.body.forEach((board) => {
      cy.request("DELETE", `/boards/${board.id}`);
    });
  });
});
