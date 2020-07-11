/// <reference types="cypress" />

context('Splash', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000/')
  })

  it('shows the create form', () => {
    cy.get('[data-name=create-form]').should('exist');
  })

  it('does not show the board list table', () => {
    cy.get('[data-name=board-table]').should('not.exist');
  })
})
