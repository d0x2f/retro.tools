<script>
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';

  import { board, cards } from '../store.js';
  import { updateCard, deleteCard, agree, undoAgree } from '../api.js';
  import { Icons } from '../data.js';

  import Input from './Input.svelte';
  import Votes from './Votes.svelte';

  export let card;
  export let color = 'text-primary';

  let editMode = false;
  let deleteMode = false;
  let newCardText = '';

  const dispatch = createEventDispatcher();

  function error(message, err) {
    dispatch('error', { message, err });
  }

  function startEdit() {
    if (!card.owner) {
      return;
    }
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

  async function toggleVote() {
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

  .pre-wrap {
    white-space: pre-wrap;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
  }
</style>

<div class:busy={card.busy} class="w-90 shadow-sm card">
  <div class:blur={deleteMode} class="d-flex">
    <div class="flex-grow-0">
      <Votes
        on:toggleVote={toggleVote}
        bind:votes={card.votes}
        bind:voted={card.voted}
        bind:color />
    </div>
    <div class="p-1 w-100 flex-grow-1">
      {#if editMode}
        <Input
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
    <div class="m-1 flex-grow-0">
      {#if card.owner || $board.owner}
        <Button color="danger" class="text-capitalize" on:click={startDelete}>
          <div class="icon" class:voted={card.voted}>
            <Icons.trash />
          </div>
        </Button>
      {/if}
    </div>
  </div>
  {#if deleteMode}
    <div class="position-absolute w-100 h-100 p-1 text-right">
      <Button color="dark" class="text-capitalize" on:click={cancelDelete}>
        <div class="icon" class:voted={card.voted}>
          <Icons.close />
        </div>
      </Button>

      <Button color="danger" class="text-capitalize" on:click={submitDelete}>
        <div class="icon" class:voted={card.voted}>
          <Icons.check />
        </div>
      </Button>
    </div>
  {/if}
</div>
