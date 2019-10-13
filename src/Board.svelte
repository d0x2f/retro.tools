<script>
  import { onDestroy, onMount } from "svelte";
  import { faPlus } from "@fortawesome/free-solid-svg-icons";

  import { board, ranks, cards } from "./store.js";
  import { updateBoard, createCard } from "./api.js";

  import FloatingActionButton from "./components/FloatingActionButton.svelte";
  import Rank from "./components/Rank.svelte";
  import Header from "./components/Header.svelte";
  import Modal from "./components/Modal.svelte";
  import NewCardForm from "./components/NewCardForm.svelte";

  const colors = ["#D95C51", "#F1DD80", "#8A9F7A"];

  let unsubscribe;
  onMount(() => (unsubscribe = board.subscribe(b => updateBoard(b))));
  onDestroy(unsubscribe);

  let showNewCardModal = false;
  let newCardRank = $ranks[0].id;
  let newCardComment = "";

  async function newCard() {
    showNewCardModal = false;
    const tempId = Math.floor(Math.random() * 10000);
    cards.append({
      id: tempId,
      name: "Card",
      description: newCardComment,
      rank_id: newCardRank,
      uncommitted: true
    });
    cards.replace(
      tempId,
      await createCard($board.id, newCardRank, newCardComment)
    );
    newCardComment = "";
  }
</script>

<style>
  .container {
    height: 100%;
  }

  .page {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .header {
    flex: 0 0 0;
  }

  .ranks {
    display: flex;
    flex-wrap: nowrap;
    flex: 1 1 1em;
    justify-content: center;
    margin-top: 1em;
  }

  .spacer {
    flex: 0 0 0.1em;
    margin: 2.5em 0.3em;
    background-color: #eee;
  }

  .no-ranks {
    text-align: center;
    flex: 1 1 1;
    width: 100%;
  }

  .add-button {
    position: absolute;
    bottom: 1em;
    right: 1em;
    width: 3em;
    height: 3em;
  }

  .hidden {
    display: none;
  }
</style>

<div class="container">
  <div class="page">
    <div class="header">
      <Header />
    </div>

    <div class="ranks">
      {#each $ranks as rank, i}
        <Rank bind:rank color={colors[i % colors.length]} />
        {#if i !== 2}
          <div class="spacer" />
        {/if}
      {:else}
        <div class="no-ranks">
          <p>
            You have no columns!
            <br />
            Add some with the button on the right.
          </p>
        </div>
      {/each}
    </div>

    <div class="add-button {$board.cards_open ? '' : 'hidden'}">
      <FloatingActionButton
        color="secondary"
        icon={faPlus}
        on:click={() => (showNewCardModal = true)} />
    </div>
  </div>
</div>

{#if showNewCardModal}
  <Modal on:close={() => (showNewCardModal = false)} on:accept={newCard}>
    <NewCardForm bind:type={newCardRank} bind:comment={newCardComment} />
  </Modal>
{/if}
