<script>
  import { onMount } from "svelte";
  import { board } from "../store.js";
  import { updateCard, agree } from "../api.js";

  import Button from "./Button.svelte";
  import Modal from "./Modal.svelte";
  import EditCardForm from "./EditCardForm.svelte";

  export let card;
  export let color = "primary";

  let showEditCardModal = false;
  let newComment;
  let unsubscribe;

  onMount(() => (newComment = card.description));

  async function updateCardSubmit() {
    card.description = newComment;
    updateCard($board, card);
    showEditCardModal = false;
  }
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  .card {
    width: 14em;
    border: 0.1em solid darken($background, 10%);
    box-shadow: 0 0 0.4em darken($background, 10%);
    margin: 1em;
  }

  .top {
    display: flex;
    padding: 0.5em;
    min-height: 2em;
  }

  .buttons {
    border-top: 1px solid darken($background, 10%);
    display: flex;
    width: 100%;
  }

  .buttons > div {
    flex: 1 1 0;
  }

  .button {
    border-left: 0.1em solid darken($background, 10%);
  }

  .uncommitted {
    opacity: 0.66;
  }

  .votes {
    font-size: 1.2em;
    flex: 0 0 1em;
    font-weight: bold;
  }

  .text {
    flex: 1 1 0;
    font-weight: 100;
    font-size: 80%;
    padding: 0.2em;
  }

  .negative {
    color: $negative;
  }

  .primary {
    color: $primary;
  }

  .secondary {
    color: $secondary;
  }
</style>

<div class="card {!!card.uncommitted ? 'uncommitted' : ''}">
  <div class="top">
    <span class="votes {color}">0</span>
    <span class="text">{card.description}</span>
  </div>
  <div class="buttons">
    <div class="button">
      <Button
        color="plain"
        label="agree"
        disabled={!$board.voting_open}
        on:click={() => agree($board, card)} />
    </div>
    <div class="button">
      <Button
        color="plain"
        label="edit"
        on:click={() => (showEditCardModal = true)} />
    </div>
  </div>
</div>

{#if showEditCardModal}
  <Modal
    on:close={() => (showEditCardModal = false)}
    on:accept={updateCardSubmit}>
    <EditCardForm bind:comment={newComment} />
  </Modal>
{/if}
