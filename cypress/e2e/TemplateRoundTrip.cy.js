/// <reference types="cypress" />

import { load as loadYaml } from 'js-yaml';

// Helpers
function navigateToFirstBoard() {
  cy.visit('/');
  cy.get('[data-name=board-list-button]').click();
  cy.get('[data-name=board-row] td').first().click();
  cy.get('[data-name=create-button]:visible').should('have.length', 0);
}

function openRankOptionsIfClosed() {
  // Use data-options-open (reflects $activeRankOptions store state, not CSS animation
  // state) so we can reliably detect whether options are logically open or closed.
  cy.get('[data-name=rank]:visible')
    .first()
    .then(($rank) => {
      if ($rank.attr('data-options-open') === 'true') {
        // Logically open — click to close so we reach a known-closed state.
        cy.get('[data-name=rank]:visible')
          .first()
          .find('[data-name=rank-options-button]')
          .click();
      }
    });
  // Wait for the panel to be fully removed from the DOM (out:slide animation done).
  cy.get('[data-name=rank]:visible')
    .first()
    .find('[data-name=rank-options]')
    .should('not.exist');
  // Open the panel.
  cy.get('[data-name=rank]:visible')
    .first()
    .find('[data-name=rank-options-button]')
    .click();
  // Wait for the panel to be visible (in:slide animation done).
  cy.get('[data-name=rank]:visible')
    .first()
    .find('[data-name=rank-options]:visible')
    .should('exist');
}

function customiseFirstRank({ name, icon = false, color = false }) {
  openRankOptionsIfClosed();

  if (name) {
    cy.intercept({ method: 'patch', url: 'boards/*/columns/*' }).as(
      'patchRename'
    );
    // Use .blur() instead of {enter} so on:submit is not triggered.
    // on:submit sets $activeRankOptions = "" which would close the options panel.
    cy.get('[data-name=rank-options] input:visible')
      .first()
      .clear()
      .type(name)
      .blur();
    cy.wait('@patchRename');
    // Wait for the Firestore subscription to propagate the rename to $ranks —
    // confirmed when the card-text-input placeholder reflects the new name.
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-text-input]')
      .invoke('attr', 'placeholder')
      .should('eq', name);
  }

  if (icon) {
    openRankOptionsIfClosed();
    cy.intercept({ method: 'patch', url: 'boards/*/columns/*' }).as(
      'patchIcon'
    );
    // Last icon in last row = "award"
    cy.get('[data-name=rank-options-icons] > div:visible').last().click();
    cy.wait('@patchIcon');
    // Wait for the store update to settle: active icon loses .text-body.
    // Without this, a late Firestore snapshot can clobber the local mutation
    // before downloadTemplate reads $ranks.
    cy.get('[data-name=rank-options-icons] > div:visible')
      .last()
      .should('not.have.class', 'text-body');
  }

  if (color) {
    openRankOptionsIfClosed();
    cy.intercept({ method: 'patch', url: 'boards/*/columns/*' }).as(
      'patchColor'
    );
    // Last colour button = "plain"
    cy.get('[data-name=rank-options-colors] > button:visible').last().click();
    cy.wait('@patchColor');
    // Wait for the store update to settle: active colour button gets a
    // checkmark child (rendered only when rank.data.color matches).
    cy.get('[data-name=rank-options-colors] > button:visible')
      .last()
      .find('div')
      .should('exist');
  }
}

function downloadTemplate() {
  cy.get('[data-name=rank]:visible').should('have.length.at.least', 1);
  cy.get('[data-name=menu-button]').click();
  cy.get('[data-name=download-template-button]').click();
  cy.get('[data-name=menu-button]').click();
}

function importTemplateAndCreate(yamlPath, boardName) {
  cy.visit('/');
  cy.get('[data-name=more-settings-button]').click();
  cy.get('input[type="file"]').selectFile(yamlPath, { force: true });
  cy.get('select').should('have.value', 'custom');
  cy.get('[data-name=board-name-input]').type(boardName);
  cy.get('[data-name=create-button]').click();
  cy.get('[data-name=create-button]:visible').should('have.length', 0);
}

function deleteAllBoards() {
  cy.deleteAllBoards();
}

function setLocale(code) {
  cy.get('[data-name=locale-select-button]').click();
  cy.get(`[data-name=locale-select-${code}]`).click();
}

// On mobile only one rank is visible at a time; navigate via the tab strip first.
function checkRankPlaceholder(index, expected) {
  if (Cypress.config('viewportWidth') < 992) {
    cy.get('[data-name=rank-tabs] label').eq(index).click();
    cy.get('[data-name=rank]:visible')
      .first()
      .find('[data-name=card-text-input]')
      .should('have.attr', 'placeholder', expected);
  } else {
    cy.get('[data-name=rank]:visible')
      .eq(index)
      .find('[data-name=card-text-input]')
      .should('have.attr', 'placeholder', expected);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

context('Template round-trip: customised board', () => {
  const BOARD_NAME = 'Customised Round-Trip Board';
  const CUSTOM_NAME = 'Customised Column';
  const DOWNLOAD_FILE = `cypress/downloads/retro-tools-${BOARD_NAME}-template.yaml`;

  before(() => {
    cy.login();
    cy.visit('/');
    cy.get('[data-name=board-name-input]').type(BOARD_NAME);
    cy.get('[data-name=create-button]').click();
    cy.get('[data-name=create-button]:visible').should('have.length', 0);
  });

  beforeEach(() => {
    cy.login();
    navigateToFirstBoard();
  });

  it('downloaded YAML reflects custom name, icon and colour — and preserves keys for unchanged columns', () => {
    // Rename first column (Drop → custom), change icon to award, colour to plain
    customiseFirstRank({ name: CUSTOM_NAME, icon: true, color: true });

    downloadTemplate();

    cy.readFile(DOWNLOAD_FILE).then((text) => {
      const doc = loadYaml(text);
      // First column: custom name, new icon/colour, NO i18n key
      expect(doc.columns[0]).to.include({
        name: CUSTOM_NAME,
        icon: 'award',
        color: 'plain',
      });
      expect(doc.columns[0].key).to.be.undefined;
      // Remaining built-in columns still carry their i18n keys
      expect(doc.columns[1].key).to.eq(
        'board.template.drop_add_keep_improve.column.add'
      );
      expect(doc.columns[2].key).to.eq(
        'board.template.drop_add_keep_improve.column.keep'
      );
      expect(doc.columns[3].key).to.eq(
        'board.template.drop_add_keep_improve.column.improve'
      );
    });
  });

  it('board created from downloaded template has matching columns', () => {
    importTemplateAndCreate(DOWNLOAD_FILE, 'Imported Customised Board');

    checkRankPlaceholder(0, CUSTOM_NAME);
    checkRankPlaceholder(1, 'Add');
    checkRankPlaceholder(2, 'Keep');
    checkRankPlaceholder(3, 'Improve');
  });

  after(deleteAllBoards);
});

// ─────────────────────────────────────────────────────────────────────────────

context(
  'Template round-trip: i18n key preservation across locale change',
  () => {
    const BOARD_NAME = 'i18n Round-Trip Board';
    const DOWNLOAD_FILE = `cypress/downloads/retro-tools-${BOARD_NAME}-template.yaml`;

    before(() => {
      cy.login();
      // Create a Mad/Sad/Glad board — all built-in column names, none renamed
      cy.visit('/');
      cy.get('[data-name=board-name-input]').type(BOARD_NAME);
      cy.get('[data-name=more-settings-button]').click();
      cy.get('select').select('madSadGlad');
      cy.get('[data-name=create-button]').click();
      cy.get('[data-name=create-button]:visible').should('have.length', 0);
    });

    beforeEach(() => {
      cy.login();
      // Always start in English so locale state is deterministic
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('locale', 'en');
        },
      });
      cy.get('[data-name=board-list-button]').click();
      // BoardTable sorts newest-first, so after test 2 creates a second board
      // the first row is no longer BOARD_NAME — navigate by name explicitly.
      cy.contains('[data-name=board-row] td', BOARD_NAME).click();
      cy.get('[data-name=create-button]:visible').should('have.length', 0);
    });

    it("exported YAML contains the locale's translated name AND the i18n key", () => {
      // Switch to German, then export
      setLocale('de');
      downloadTemplate();

      cy.readFile(DOWNLOAD_FILE).then((text) => {
        const doc = loadYaml(text);
        // German translated names are present (human-readable)
        expect(doc.columns[0].name).to.eq('Wütend');
        expect(doc.columns[1].name).to.eq('Traurig');
        expect(doc.columns[2].name).to.eq('Glücklich');
        // i18n keys are preserved alongside the names
        expect(doc.columns[0].key).to.eq(
          'board.template.mad_sad_glad.column.mad'
        );
        expect(doc.columns[1].key).to.eq(
          'board.template.mad_sad_glad.column.sad'
        );
        expect(doc.columns[2].key).to.eq(
          'board.template.mad_sad_glad.column.glad'
        );
      });
    });

    // Depends on the file downloaded by the previous test
    it('board created from a German-exported template shows columns in the import locale', () => {
      // Still in English (reset by beforeEach) — import the German-exported file
      importTemplateAndCreate(
        DOWNLOAD_FILE,
        'English Board from German Template'
      );

      // i18n keys resolve in the current locale (English), not the export locale
      checkRankPlaceholder(0, 'Mad');
      checkRankPlaceholder(1, 'Sad');
      checkRankPlaceholder(2, 'Glad');
    });

    it('custom-named column stays literal while built-in columns translate to the import locale', () => {
      // Rename the first column — this removes the i18n key from the export
      customiseFirstRank({ name: 'My Custom Column' });

      downloadTemplate();

      // The file already exists from the German-export test in this context.
      // Use .should() so Cypress retries readFile until the download overwrites it.
      cy.readFile(DOWNLOAD_FILE)
        .should('include', 'My Custom Column')
        .then((text) => {
          const doc = loadYaml(text);
          // Custom name: no key field
          expect(doc.columns[0].name).to.eq('My Custom Column');
          expect(doc.columns[0].key).to.be.undefined;
          // Remaining built-in columns still have keys
          expect(doc.columns[1].key).to.eq(
            'board.template.mad_sad_glad.column.sad'
          );
          expect(doc.columns[2].key).to.eq(
            'board.template.mad_sad_glad.column.glad'
          );
        });

      // Import in German — built-in columns should appear in German,
      // but the renamed column should stay as its literal English name
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('locale', 'de');
        },
      });
      cy.get('[data-name=more-settings-button]').click();
      cy.get('input[type="file"]').selectFile(DOWNLOAD_FILE, { force: true });
      cy.get('select').should('have.value', 'custom');
      cy.get('[data-name=board-name-input]').type(
        'German Board with Custom Column'
      );
      cy.get('[data-name=create-button]').click();
      cy.get('[data-name=create-button]:visible').should('have.length', 0);

      // Custom column: no key → stays as-is regardless of locale
      checkRankPlaceholder(0, 'My Custom Column');
      // Built-in columns: key → resolved in German
      checkRankPlaceholder(1, 'Traurig');
      checkRankPlaceholder(2, 'Glücklich');
    });

    after(() => {
      // Reset locale before cleanup so board list renders predictably
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('locale', 'en');
        },
      });
      deleteAllBoards();
    });
  }
);
