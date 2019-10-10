<script>
  import { onDestroy, onMount } from "svelte";

  import { board, ranks } from "./store.js";
  import { updateBoard } from "./api.js";

  import Rank from "./components/Rank.svelte";
  import BoardHeader from "./components/BoardHeader.svelte";

  const colors = ["#D95C51", "#F1DD80", "#8A9F7A"];

  let unsubscribe;
  onMount(() => (unsubscribe = board.subscribe(b => updateBoard(b))));
  onDestroy(unsubscribe);
</script>

<style>
  .container {
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
    overflow: scroll;
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
</style>

<div class="container">
  <div class="header">
    <BoardHeader />
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
</div>
