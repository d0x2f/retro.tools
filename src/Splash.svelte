<script>
  import { faPlus } from "@fortawesome/free-solid-svg-icons";

  import { createRank, createBoard } from "./api.js";
  import TextField from "./components/TextField.svelte";
  import Button from "./components/Button.svelte";

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

<style type="text/scss">
  @import "../theme/colors.scss";

  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 50%;
    margin: 0 auto;
    margin-top: -6em;
    height: 900px;
    width: 900px;
    overflow: hide;
    background-color: rgba($primary, 0.1);
    text-align: center;
  }

  .header {
    flex: 0 0 5em;
    font-size: 200%;
    padding-top: 6em;
    font-family: "Work Sans", sans-serif;
    color: $primary;
    text-transform: uppercase;
  }

  .box {
    flex: 0 0 0;
    padding: 3em 2em;
    height: 10em;
    margin: 0 auto;
    background-color: $background;
    box-shadow: 0 0 0.4em darken($background, 20%);
  }

  .field-name {
    text-align: left;
    margin: 0;
    margin-bottom: 0.2em;
    font-size: 80%;
    color: $primary;
    font-family: "Work Sans", sans-serif;
  }

  .input {
    width: 20em;
    display: flex;
  }

  .button {
    margin-left: 0.5em;
    flex: 0 0 5.3em;
  }
</style>

<div class="container">
  <h1 class="header">retrograde</h1>
  <div class="box">
    <p class="field-name">Board Name</p>
    <div class="input">
      <TextField bind:text={boardName} placeholder="Sprint 21 Retro" />
      <div class="button">
        <Button on:click={newBoard} icon={faPlus} label="create" />
      </div>
    </div>
  </div>
</div>
