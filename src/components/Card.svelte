<script>
  import { onMount } from 'svelte';
  import { board, cards, ranks } from '../store.js';
  import { updateCard, agree, undoAgree } from '../api.js';

  import Button from './Button.svelte';
  import Modal from './Modal.svelte';
  import CardForm from './CardForm.svelte';

  export let card;
  export let color = 'primary';

  let showEditCardModal = false;
  let newRank = $ranks[0].id;
  let newComment;

  onMount(() => {
    newComment = card.description;
    newRank = card.rank_id;
  });

  async function updateCardSubmit() {
    const current_rank_id = card.rank_id;
    card.description = newComment;
    card.rank_id = newRank;
    updateCard($board, card, current_rank_id);
    showEditCardModal = false;
  }
</script>

<style lang="scss">
  @import '../../theme/colors.scss';

  .card {
    width: 90%;
    box-shadow: 0 0 0.4em darken($background, 10%);
    margin: 1em auto;
    border-radius: 0.2em;
    overflow: hidden;
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

  .uncommitted {
    opacity: 0.66;
  }

  .votes {
    font-size: 1.2em;
    flex: 0 0 2em;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
  }

  .text {
    flex: 1 1 0;
    font-weight: 300;
    padding: 0.1em;
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

<div class="card {card.uncommitted ? 'uncommitted' : ''}">
  <div class="top">
    <span class="votes {color}">
      {#if card.voted}•{/if}
      {card.votes}
    </span>
    <span class="text">{card.description}</span>
  </div>
  <div class="buttons">
    <div class="button">
      {#if card.voted}
        <Button
          color="plain"
          label="undo"
          disabled={!$board.voting_open}
          on:click={async () => cards.replace(card.id, await undoAgree($board, card))} />
      {:else}
        <Button
          color="plain"
          label="agree"
          disabled={!$board.voting_open}
          on:click={async () => cards.replace(card.id, await agree($board, card))} />
      {/if}
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
    <CardForm
      title="Modify Card"
      bind:type={newRank}
      bind:comment={newComment} />
  </Modal>
{/if}
