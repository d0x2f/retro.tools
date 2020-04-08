<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  import { board, cards, ranks } from '../store.js';
  import { updateCard, deleteCard, agree, undoAgree } from '../api.js';
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from 'sveltestrap';
  import { Icons } from '../data.js';

  import CardForm from './CardForm.svelte';
  import FloatingActionButton from './FloatingActionButton.svelte';

  export let card;
  export let color = 'text-primary';

  let showEditCardModal = false;
  let showDeleteCardConfirmBox = false;
  let newRank = $ranks[0].id;
  let newComment;
  let self;

  const dispatch = createEventDispatcher();

  onMount(() => {
    newComment = card.description;
    newRank = card.rank_id;
  });

  function error(message, err) {
    dispatch('error', { message, err });
  }

  function toggleEditCardModal() {
    showEditCardModal = !showEditCardModal;
    self.parentElement.dataset.drag = 'false';
  }

  async function updateCardSubmit() {
    toggleEditCardModal();
    const currentRankId = card.rank_id;
    const newCard = { ...card };
    newCard.description = newComment;
    newCard.rank_id = newRank;
    card.busy = true;
    try {
      cards.replace(card.id, await updateCard($board, newCard, currentRankId));
    } catch (err) {
      error('error.updating_card', err);
    }
  }

  function editCardModal() {
    newComment = card.description;
    newRank = card.rank_id;

    toggleEditCardModal();
  }

  function toggleDeleteCardConfirmBox() {
    showDeleteCardConfirmBox = !showDeleteCardConfirmBox;
  }

  async function deleteCardSubmit() {
    toggleDeleteCardConfirmBox();
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
</style>

<div
  class="d-flex flex-column w-90 shadow-sm card {card.busy ? 'busy' : ''}"
  bind:this={self}>
  <div class="d-flex {showDeleteCardConfirmBox ? 'blur' : ''}">
    <span
      class="votes flex-grow-0 flex-shrink-0 font-weight-bold h3 m-1 {color}">
      {#if card.voted}•{/if}
      {card.votes}
    </span>
    <span class="p-1 w-100 font-weight-bold">
      {#if $board.cards_open && (card.owner || $board.owner)}
        <div class="delete-button float-right">
          <FloatingActionButton
            className="btn-danger"
            icon={Icons.close}
            on:click={toggleDeleteCardConfirmBox} />
        </div>
      {/if}
      {card.description}
    </span>
  </div>
  <div
    class="d-flex flex-row border-top button-primary {showDeleteCardConfirmBox ? 'blur' : ''}">
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
      color="light"
      class="text-capitalize flex-grow-1"
      disabled={!(card.owner || $board.owner)}
      on:click={editCardModal}>
      {$_('card.edit')}
    </Button>
  </div>
  {#if showDeleteCardConfirmBox}
    <div
      class="d-flex flex-column justify-content-center position-absolute w-100
      h-100 text-center">
      <span class="mb-2">{$_('card.are_you_sure')}</span>
      <div class="">
        <Button
          color="dark"
          class="text-capitalize flex-grow-1"
          on:click={toggleDeleteCardConfirmBox}>
          {$_('card.cancel')}
        </Button>

        <Button
          color="danger"
          class="text-capitalize flex-grow-1"
          on:click={deleteCardSubmit}>
          {$_('card.delete')}
        </Button>
      </div>
    </div>
  {/if}
</div>

<Modal isOpen={showEditCardModal} toggle={toggleEditCardModal}>
  <ModalHeader toggle={toggleEditCardModal}>{$_('card.edit_card')}</ModalHeader>
  <ModalBody>
    <CardForm bind:rankId={newRank} bind:comment={newComment} />
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={toggleEditCardModal}>
      {$_('card.cancel')}
    </Button>
    <Button color="primary" on:click={updateCardSubmit}>
      {$_('card.save')}
    </Button>
  </ModalFooter>
</Modal>
