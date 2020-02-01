<script>
  import { onMount, createEventDispatcher } from 'svelte';

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
  let busy = false;

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
  }

  async function updateCardSubmit() {
    toggleEditCardModal();
    const currentRankId = card.rank_id;
    const newCard = { ...card };
    newCard.description = newComment;
    newCard.rank_id = newRank;
    busy = true;
    try {
      cards.replace(card.id, await updateCard($board, newCard, currentRankId));
    } catch (err) {
      error('Card update failed!', err);
    } finally {
      busy = false;
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
    busy = true;
    try {
      await deleteCard($board, card);
      cards.remove(card.id);
    } catch (err) {
      error('Card deletion failed!', err);
    } finally {
      busy = false;
    }
  }

  async function upvote() {
    try {
      cards.replace(card.id, await agree($board, card));
    } catch (err) {
      error('Vote failed!', err);
    } finally {
      busy = false;
    }
  }

  async function downvote() {
    try {
      cards.replace(card.id, await undoAgree($board, card));
    } catch (err) {
      error('Vote failed!', err);
    } finally {
      busy = false;
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

  .text {
    min-height: 5em;
  }
</style>

<div class="d-flex flex-column w-90 shadow-sm card {busy ? 'busy' : ''}">
  <div class="d-flex {showDeleteCardConfirmBox ? 'blur' : ''}">
    <span
      class="votes flex-grow-0 flex-shrink-0 font-weight-bold h3 m-2 {color}">
      {#if card.voted}•{/if}
      {card.votes}
    </span>
    <span class="p-2 w-100 font-weight-bold text">
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
        undo
      </Button>
    {:else}
      <Button
        color="light"
        class="text-capitalize flex-grow-1"
        disabled={!$board.voting_open}
        on:click={upvote}>
        agree
      </Button>
    {/if}
    <Button
      color="light"
      class="text-capitalize flex-grow-1"
      disabled={!(card.owner || $board.owner)}
      on:click={editCardModal}>
      edit
    </Button>
  </div>
  {#if showDeleteCardConfirmBox}
    <div
      class="d-flex flex-column justify-content-center position-absolute w-100
      h-100 text-center">
      <span class="mb-2">Are you sure?</span>
      <div class="">
        <Button
          color="dark"
          class="text-capitalize flex-grow-1"
          on:click={toggleDeleteCardConfirmBox}>
          cancel
        </Button>

        <Button
          color="danger"
          class="text-capitalize flex-grow-1"
          on:click={deleteCardSubmit}>
          delete
        </Button>
      </div>
    </div>
  {/if}
</div>

<Modal isOpen={showEditCardModal} toggle={toggleEditCardModal}>
  <ModalHeader toggle={toggleEditCardModal}>Edit Card</ModalHeader>
  <ModalBody>
    <CardForm bind:rankId={newRank} bind:comment={newComment} />
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={toggleEditCardModal}>Cancel</Button>
    <Button color="primary" on:click={updateCardSubmit}>Save</Button>
  </ModalFooter>
</Modal>
