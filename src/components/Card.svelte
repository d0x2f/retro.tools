<script>
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import Emoji from 'svelte-emoji';
  import { Popover } from 'sveltestrap';
  import { _ } from 'svelte-i18n';

  import { board, cards, password } from '../store.js';
  import {
    updateCard,
    deleteCard,
    agree,
    undoAgree,
    react,
    undoReact,
  } from '../api.js';
  import { Icons } from '../data.js';
  import { decrypt, encrypt } from '../encryption.js';
  import { clickOutside } from '../utils.js';

  import Textarea from './Textarea.svelte';
  import Votes from './Votes.svelte';
  import EncryptedText from './EncryptedText.svelte';
  import Button from './Button.svelte';
  import ReactDrawer from './ReactDrawer.svelte';

  export let card;
  export let color = 'text-primary';

  let editMode = false;
  let deleteMode = false;
  let reactDrawOpen = false;
  let newCardText = '';

  const dispatch = createEventDispatcher();

  function error(message, err) {
    dispatch('error', { message, err });
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
      cards.replace(card.id, await updateCard($board, newCard, card.column));
      editMode = false;
    } catch (err) {
      error('error.updating_card', err);
    }
  }

  function startDelete() {
    deleteMode = true;
  }

  function cancelDelete() {
    deleteMode = false;
  }

  async function submitDelete() {
    deleteMode = false;
    card.busy = true;
    try {
      await deleteCard($board, card);
      cards.remove(card.id);
    } catch (err) {
      error('error.card_delete', err);
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
          card.votes -= 1;
          card.voted = false;
        }
      } else {
        let response = await agree($board, card);
        if (response.ok) {
          card.votes += 1;
          card.voted = true;
        }
      }
    } catch (err) {
      error('error.vote_failed', err);
    } finally {
      card.busy = false;
    }
  }

  async function doReact(event) {
    const emoji = event.detail;
    reactDrawOpen = false;
    if (card.reacted === emoji) {
      card.reactions[card.reacted] -= 1;
      card.reacted = '';
      return undoReact($board, card);
    } else {
      if (card.reacted !== '') {
        card.reactions[card.reacted] -= 1;
      }
      card.reactions[emoji] = (card.reactions[emoji] ?? 0) + 1;
      card.reacted = emoji;
      await react($board, card, emoji);
    }
  }
</script>

<div data-name="card" class:busy={card.busy} class="w-90 shadow-sm card">
  <div class:blur={deleteMode} class="d-flex">
    <div class="flex-grow-0 bg-light">
      <Votes
        on:toggleVote={toggleVote}
        bind:votes={card.votes}
        bind:voted={card.voted}
        bind:color
      />
    </div>
    <div class="p-1 w-100 flex-grow-1">
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
          <div class="m-0 w-100 small">
            <div class="d-flex">
              <div class="flex-grow-1">
                {#if card.author.length > 0}
                  <div class="text-primary">
                    <EncryptedText bind:text={card.author} />
                  </div>
                {:else}
                  <div class="text-secondary">{$_('card.anonymous')}</div>
                {/if}
              </div>
              <div
                id={`react-drawer-button-${card.id}`}
                class="d-flex flex-wrap justify-content-end pointer"
              >
                {#if Object.entries(card.reactions).filter(([, v]) => v > 0).length > 0}
                  {#each Object.entries(card.reactions)
                    .sort( ([ak, av], [bk, bv]) => (av === bv ? bk.localeCompare(ak) : bv - av) )
                    .filter(([, v]) => v > 0) as [emoji, count]}
                    <div
                      class="pl-1 text-nowrap {card.reacted === emoji
                        ? 'text-primary'
                        : ''}"
                      in:slide
                    >
                      {emoji}
                      {count}
                    </div>
                  {/each}
                {:else}
                  <div class="grayscale">
                    <Emoji symbol="👍" label="smile" />
                  </div>
                {/if}
              </div>
              <Popover
                placement="right"
                target={`react-drawer-button-${card.id}`}
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
            on:click={startEdit}
          >
            <EncryptedText bind:text={card.text} />
          </div>
        </div>
      {/if}
    </div>
    <div class="p-1 bg-light">
      {#if card.owner || $board.owner}
        <Button
          data-name="delete-button"
          color="light"
          class="btn-sm text-danger"
          on:click={startDelete}
        >
          <div class="icon" class:voted={card.voted}>
            <Icons.trash />
          </div>
        </Button>
      {/if}
    </div>
  </div>

  {#if deleteMode}
    <div class="position-absolute w-100 h-100 p-1 text-right">
      <Button
        data-name="cancel-button"
        color="dark"
        class="btn-sm"
        on:click={cancelDelete}
      >
        <div class="icon" class:voted={card.voted}>
          <Icons.close />
        </div>
      </Button>

      <Button
        data-name="confirm-button"
        color="danger"
        class="btn-sm"
        on:click={submitDelete}
      >
        <div class="icon" class:voted={card.voted}>
          <Icons.check />
        </div>
      </Button>
    </div>
  {/if}
</div>

<style>
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

  .grayscale {
    filter: grayscale(100%);
  }

  .pointer {
    cursor: pointer;
  }
</style>
