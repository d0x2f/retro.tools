<script>
  import { onDestroy, onMount } from "svelte";

  import { board, ranks } from "./store.js";

  import Rank from "./components/Rank.svelte";
  import AddRank from "./components/AddRank.svelte";
  import Header from "./components/Header.svelte";

  export let boardId = "kMwWp5Ef1JaITphF";

  const colors = ["#D95C51", "#FCCE43", "#67C9BC"];
  let unsubscribe;

  async function getBoard(boardId) {
    const response = await fetch(`http://localhost:8000/boards/${boardId}`, {
      credentials: "include"
    });
    return await response.json();
  }

  async function getRanks(boardId) {
    const response = await fetch(
      `http://localhost:8000/boards/${boardId}/ranks`,
      {
        credentials: "include"
      }
    );
    return await response.json();
  }

  async function updateBoard(board) {
    await fetch(`http://localhost:8000/boards/${boardId}`, {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(board)
    });
  }

  onMount(async () => {
    let [board_result, ranks_result] = await Promise.all([
      getBoard(boardId),
      getRanks(boardId)
    ]);
    board.set(board_result);
    ranks.set(ranks_result);
    unsubscribe = board.subscribe(b => updateBoard(b));
  });

  onDestroy(unsubscribe);
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .header {
    flex: 0 0 3em;
  }

  .ranks {
    display: flex;
    flex-wrap: nowrap;
    flex: 1 1 1em;
  }
</style>

<div class="container">
  <div class="header">
    <Header />
  </div>

  <div class="ranks">
    {#each $ranks as rank, i}
      <Rank id={rank.id} color={colors[i % colors.length]} name={rank.name} />
    {/each}
    <AddRank />
  </div>
</div>
