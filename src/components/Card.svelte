<script>
  import { onMount } from 'svelte';
  import { board, cards, ranks } from '../store.js';
  import { updateCard, deleteCard, agree, undoAgree } from '../api.js';
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from 'sveltestrap';
  import { XIcon } from 'svelte-feather-icons';

  import CardForm from './CardForm.svelte';
  import FloatingActionButton from './FloatingActionButton.svelte';

  export let card;
  export let color = 'text-primary';

  let showEditCardModal = false;
  let showDeleteCardConfirmBox = false;
  let newRank = $ranks[0].id;
  let newComment;

  onMount(() => {
    newComment = card.description;
    newRank = card.rank_id;
  });

  function toggleEditCardModal() {
    showEditCardModal = !showEditCardModal;
  }

  async function updateCardSubmit() {
    toggleEditCardModal();
    const current_rank_id = card.rank_id;
    card.description = newComment;
    card.rank_id = newRank;
    await updateCard($board, card, current_rank_id);
    cards.replace(card.id, card);
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
    card.uncommitted = true;
    await deleteCard($board, card);
    cards.remove(card.id);
    console.log('done');
  }
</script>

<style>
  .uncommitted {
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
  class="d-flex flex-column w-90 shadow-sm m-4 card {card.uncommitted ? 'uncommitted' : ''}">
  <div class="d-flex {showDeleteCardConfirmBox ? 'blur' : ''}">
    <span
      class="votes flex-grow-0 flex-shrink-0 font-weight-bold h3 m-2 {color}">
      {#if card.voted}•{/if}
      {card.votes}
    </span>
    <span class="p-2 w-100 small font-weight-bold">
      <div
        class="delete-button float-right {$board.cards_open && (card.owner || $board.owner) ? '' : 'invisible'}">
        <FloatingActionButton
          className="btn-danger"
          icon={XIcon}
          on:click={toggleDeleteCardConfirmBox} />
      </div>
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
        on:click={async () => cards.replace(card.id, await undoAgree($board, card))}>
        undo
      </Button>
    {:else}
      <Button
        color="light"
        class="text-capitalize flex-grow-1"
        disabled={!$board.voting_open}
        on:click={async () => cards.replace(card.id, await agree($board, card))}>
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
