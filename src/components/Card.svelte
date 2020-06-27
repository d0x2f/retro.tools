<script>
  import { createEventDispatcher } from 'svelte';

  import { board, cards } from '../store.js';
  import { updateCard, deleteCard, agree, undoAgree } from '../api.js';
  import { Icons } from '../data.js';
  import { Button } from 'sveltestrap';

  import Input from './Input.svelte';

  export let card;
  export let color = 'text-primary';

  let editMode = false;
  let deleteMode = false;
  let newCardText = '';
  let self;
  let inputElement;

  const dispatch = createEventDispatcher();

  function error(message, err) {
    dispatch('error', { message, err });
  }

  function startEdit() {
    newCardText = card.description;
    editMode = true;
  }

  function cancelEdit() {
    editMode = false;
  }

  async function submitEdit() {
    const newCard = { ...card, description: newCardText, busy: true };
    try {
      cards.replace(card.id, await updateCard($board, newCard, card.rank_id));
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

  async function togglevote() {
    card.busy = true;
    try {
      let newCard;
      if (card.voted) {
        newCard = await undoAgree($board, card);
      } else {
        newCard = await agree($board, card);
      }
      cards.replace(card.id, newCard);
    } catch (err) {
      error('error.vote_failed', err);
    } finally {
      card.busy = false;
    }
  }
</script>

<style>
  .busy {
    opacity: 0.66;
  }

  .blur {
    opacity: 0.3;
  }

  .votes {
    min-width: 1.5em;
    text-align: right;
  }

  .delete-button {
    width: 1.5em;
    height: 1.5em;
    line-height: 1;
    font-size: 1rem;
  }

  .pre-wrap {
    white-space: pre-wrap;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
  }

  .unvoted {
    stroke-dasharray: 3;
    opacity: 0.7;
  }
</style>

<div
  class="d-flex flex-column w-90 shadow-sm card {card.busy ? 'busy' : ''}"
  bind:this={self}>
  <div class="d-flex {deleteMode ? 'blur' : ''}">
    <div class="m-1">
      <Button
        color="light"
        class="text-capitalize flex-grow-1"
        disabled={!$board.voting_open}
        on:click={togglevote}>
        <div class="icon {color}" class:unvoted={!card.voted}>
          <Icons.thumbsup />
        </div>
      </Button>
    </div>
    <span
      class="votes flex-grow-0 flex-shrink-0 font-weight-bold h3 mt-1 {color}">
      {card.votes}
    </span>
    <div class="m-1 w-100">
      {#if editMode}
        <Input
          bind:this={inputElement}
          bind:value={newCardText}
          on:submit={submitEdit}
          on:cancel={cancelEdit}
          on:blur={submitEdit} />
      {:else}
        <div class="p-1 w-100 font-weight-bold pre-wrap" on:click={startEdit}>
          {card.description}
        </div>
      {/if}
    </div>
    <div class="m-1">
      <Button
        color="danger"
        class="text-capitalize flex-grow-1"
        disabled={!($board.cards_open && (card.owner || $board.owner))}
        on:click={startDelete}>
        <div class="icon" class:voted={card.voted}>
          <Icons.trash />
        </div>
      </Button>
    </div>
  </div>
  {#if deleteMode}
    <div class="position-absolute w-100 h-100 p-1 text-right">
      <Button
        color="dark"
        class="text-capitalize flex-grow-1"
        on:click={cancelDelete}>
        <div class="icon" class:voted={card.voted}>
          <Icons.close />
        </div>
      </Button>

      <Button
        color="danger"
        class="text-capitalize flex-grow-1"
        on:click={submitDelete}>
        <div class="icon" class:voted={card.voted}>
          <Icons.check />
        </div>
      </Button>

    </div>
  {/if}
</div>
