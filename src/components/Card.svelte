<script>
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { Popover } from "sveltestrap";
  import { _ } from "svelte-i18n";

  import { board, cards, colorMode, darkMode, password } from "../store.js";
  import {
    updateCard,
    deleteCard,
    agree,
    undoAgree,
    react,
    undoReact,
  } from "../api.js";
  import { decrypt, encrypt } from "../encryption.js";
  import { clickOutside } from "../utils.js";

  import Textarea from "./Textarea.svelte";
  import Votes from "./Votes.svelte";
  import EncryptedText from "./EncryptedText.svelte";
  import ReactDrawer from "./ReactDrawer.svelte";
  import Button from "./Button.svelte";
  import { Icons } from "../data.js";

  export let card;
  export let color;

  let editMode = false;
  let reactDrawOpen = false;
  let newCardText = "";
  let deleteConfirmMode = false;

  const cardSlug = (Math.random() + 1).toString(36).substring(7);

  const dispatch = createEventDispatcher();

  function error(message, err) {
    dispatch("error", { message, err });
  }

  async function startEdit() {
    if (!card.owner) {
      return;
    }
    newCardText = await decrypt(card.text, $password);
    editMode = true;
  }

  function cancelEdit() {
    editMode = false;
  }

  async function submitEdit() {
    const newCard = {
      ...card,
      text: await encrypt(newCardText, $password),
      busy: true,
    };
    try {
      cards.replace(card.id, await updateCard($board, newCard));
      editMode = false;
    } catch (err) {
      error("error.updating_card", err);
    }
  }

  async function doDelete() {
    card.busy = true;
    try {
      await deleteCard($board, card);
      cards.remove(card.id);
    } catch (err) {
      error("error.card_delete", err);
    }
  }

  async function toggleVote() {
    if (card.busy) {
      return;
    }
    card.busy = true;
    try {
      if (card.voted) {
        let response = await undoAgree($board, card);
        if (response.ok) {
          card.voted = false;
        }
      } else {
        let response = await agree($board, card);
        if (response.ok) {
          card.voted = true;
        }
      }
    } catch (err) {
      error("error.vote_failed", err);
    } finally {
      card.busy = false;
    }
  }

  async function doReact(event) {
    const emoji = event.detail;
    reactDrawOpen = false;
    if (card.reacted === emoji) {
      return undoReact($board, card);
    } else {
      await react($board, card, emoji);
    }
  }
</script>

<div data-name="card" class:busy={card.busy} class="card bg-{$colorMode}">
  <div class="d-flex" class:blur={deleteConfirmMode}>
    <div class="p-1 pt-votes flex-grow-0 bg-{$colorMode}-accent rounded-start">
      <Votes
        on:toggleVote={toggleVote}
        bind:votes={card.votes}
        bind:voted={card.voted}
        bind:color
      />
    </div>
    <div class="p-1 pt-0 w-100 flex-grow-1">
      {#if editMode}
        <Textarea
          data-name="card-edit-field"
          autoresize
          autofocus
          bind:value={newCardText}
          on:submit={submitEdit}
          on:cancel={cancelEdit}
          on:blur={submitEdit}
        />
      {:else}
        <div data-name="card-body">
          <div class="m-0 w-100">
            <div class="d-flex flex-wrap">
              <div class="flex-grow-1">
                {#if card.author.length > 0}
                  <div class:text-primary={!$darkMode} class="fw-bold pb-1">
                    <EncryptedText bind:text={card.author} />
                  </div>
                {:else}
                  <div class="text-secondary fw-bold">
                    {$_("card.anonymous")}
                  </div>
                {/if}
              </div>
              <div
                id={`react-drawer-button-${cardSlug}`}
                class="d-flex flex-wrap justify-content-end pointer"
              >
                {#if Object.entries(card.reactions).filter(([, v]) => v > 0).length > 0}
                  {#each Object.entries(card.reactions)
                    .sort( ([ak, av], [bk, bv]) => (av === bv ? bk.localeCompare(ak) : bv - av) )
                    .filter(([, v]) => v > 0) as [emoji, count]}
                    <span
                      class="badge m-1"
                      class:text-body={$darkMode}
                      class:text-bg-light={!$darkMode && card.reacted !== emoji}
                      class:text-bg-primary={!$darkMode &&
                        card.reacted === emoji}
                      class:bg-dark-accent={$darkMode && card.reacted === emoji}
                      class:text-bg-dark={$darkMode && card.reacted !== emoji}
                      in:slide>{emoji}&nbsp;&nbsp;{count}</span
                    >
                  {/each}
                {:else}
                  <div class="badge m-1">
                    <span class="grayscale-{$colorMode}">🙂</span>
                  </div>
                {/if}
              </div>
              <Popover
                target={`react-drawer-button-${cardSlug}`}
                bind:isOpen={reactDrawOpen}
              >
                <div
                  use:clickOutside
                  on:clickOutside={() => (reactDrawOpen = !reactDrawOpen)}
                >
                  <ReactDrawer on:selected={doReact} current={card.reacted} />
                </div>
              </Popover>
            </div>
            <div class="border-top border-secondary author-border" />
          </div>
          <div
            data-name="card-content"
            class="p-1 w-100 pre-wrap"
            on:keypress={null}
            on:click={startEdit}
          >
            <EncryptedText bind:text={card.text} />
          </div>
        </div>
      {/if}
    </div>
    <div class="p-1 pt-3 bg-{$colorMode}-accent rounded-end">
      {#if card.owner || $board.owner}
        <Button
          data-name="delete-button"
          textColor={!$darkMode ? "danger" : "body"}
          class="bg-{$colorMode}-accent"
          on:click={() => (deleteConfirmMode = true)}
        >
          <div class="icon">
            <Icons.trash class="align-top" size="1.4x" />
          </div>
        </Button>
      {/if}
    </div>
  </div>

  {#if deleteConfirmMode}
    <div class="position-absolute w-100 h-100 p-3 text-end">
      <Button
        data-name="cancel-button"
        color="secondary"
        textColor="light"
        class="btn-sm"
        on:click={() => (deleteConfirmMode = false)}
      >
        <div class="icon">
          <Icons.close size="1x" />
        </div>
      </Button>

      <Button
        data-name="confirm-button"
        color="danger"
        textColor="light"
        class="btn-sm"
        on:click={doDelete}
      >
        <div class="icon">
          <Icons.check size="1x" />
        </div>
      </Button>
    </div>
  {/if}
</div>

<style>
  .pt-votes {
    padding-top: 0.85rem !important;
  }

  .busy {
    opacity: 0.66;
  }

  .blur {
    opacity: 0.3;
  }

  .pre-wrap {
    white-space: pre-wrap;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
  }

  .author-border {
    opacity: 0.2;
  }

  .grayscale-dark {
    filter: grayscale(100%) brightness(0.5);
  }

  .grayscale-light {
    filter: grayscale(100%);
  }

  .pointer {
    cursor: pointer;
  }
</style>
