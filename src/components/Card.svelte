<script>
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  import { board, cards } from '../store.js';
  import { updateCard, deleteCard, agree, undoAgree } from '../api.js';
  import { Button } from 'sveltestrap';

  import CardForm from './CardForm.svelte';

  export let card;
  export let color = 'text-primary';

  let editMode = false;
  let deleteMode = false;
  let previousComment;
  let self;
  let editInput;

  const dispatch = createEventDispatcher();

  function error(message, err) {
    dispatch('error', { message, err });
  }

  function startEdit() {
    editMode = true;
    previousComment = card.description;
  }

  function cancelEdit() {
    editMode = false;
    card.description = previousComment;
  }

  async function submitEdit() {
    editMode = false;
    const currentRankId = card.rank_id;
    const newCard = { ...card };
    card.busy = true;
    try {
      cards.replace(card.id, await updateCard($board, newCard, currentRankId));
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

  async function upvote() {
    try {
      cards.replace(card.id, await agree($board, card));
    } catch (err) {
      error('error.vote_failed', err);
    } finally {
      card.busy = false;
    }
  }

  async function downvote() {
    try {
      cards.replace(card.id, await undoAgree($board, card));
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
    opacity: 0.05;
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
</style>

<div
  class="d-flex flex-column w-90 shadow-sm card {card.busy ? 'busy' : ''}"
  bind:this={self}>
  <div class="d-flex {deleteMode ? 'blur' : ''}">
    <span
      class="votes flex-grow-0 flex-shrink-0 font-weight-bold h3 m-1 {color}">
      {#if card.voted}•{/if}
      {card.votes}
    </span>
    <div class="m-1 w-100">
      {#if editMode}
        <CardForm
          bind:this={editInput}
          bind:comment={card.description}
          on:submit={submitEdit}
          on:cancel={cancelEdit}
          on:blur={submitEdit} />
      {:else}
        <div class="p-1 w-100 font-weight-bold pre-wrap" on:click={startEdit}>
          {card.description}
        </div>
      {/if}
    </div>
  </div>
  <div
    class="d-flex flex-row border-top button-primary {deleteMode ? 'blur' : ''}">
    {#if card.voted}
      <Button
        color="light"
        class="text-capitalize flex-grow-1"
        disabled={!$board.voting_open}
        on:click={downvote}>
        {$_('card.undo')}
      </Button>
    {:else}
      <Button
        color="light"
        class="text-capitalize flex-grow-1"
        disabled={!$board.voting_open}
        on:click={upvote}>
        {$_('card.agree')}
      </Button>
    {/if}
    <Button
      color="danger"
      class="text-capitalize flex-grow-1"
      disabled={!($board.cards_open && (card.owner || $board.owner))}
      on:click={startDelete}>
      {$_('card.delete')}
    </Button>
  </div>
  {#if deleteMode}
    <div
      class="d-flex flex-column justify-content-center position-absolute w-100
      h-100 text-center">
      <span class="mb-2">{$_('card.are_you_sure')}</span>
      <div class="">
        <Button
          color="dark"
          class="text-capitalize flex-grow-1"
          on:click={cancelDelete}>
          {$_('card.cancel')}
        </Button>

        <Button
          color="danger"
          class="text-capitalize flex-grow-1"
          on:click={submitDelete}>
          {$_('card.delete')}
        </Button>
      </div>
    </div>
  {/if}
</div>
