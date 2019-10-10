<script>
  import Header from "./components/Header.svelte";

  import { createRank, createBoard } from "./api.js";

  export let nav;

  let boardName = "";

  async function newBoard() {
    let board = await createBoard(boardName);
    await createRank(board.id, "MAD");
    await createRank(board.id, "SAD");
    await createRank(board.id, "GLAD");
    nav.navigate(`/${board.id}`);
  }
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

  .page {
    flex: 1 1 0;
    padding: 1em;
  }
</style>

<div class="container">
  <div class="header">
    <Header />
  </div>
  <div class="page">
    <input type="text" placeholder="Board name" bind:value={boardName} />
    <input type="button" value="Create a New Board" on:click={newBoard} />
  </div>
</div>
