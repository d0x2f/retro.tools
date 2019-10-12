<script>
  import Textfield from "@smui/textfield";
  import Button, { Label, Icon } from "@smui/button";

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

<style type="text/scss">
  @import "../theme/colors.scss";
  @import "@material/elevation/mdc-elevation";

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
    padding-top: 4em;
    font-family: "Work Sans", sans-serif;
    color: $primary;
  }

  .box {
    flex: 0 0 0;
    padding: 3em 2em;
    height: 10em;
    margin: 0 auto;
    background-color: #fff;
    border: 0.1em solid #eee;
    // box-shadow: 0 0 0.6em #ddd;
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
</style>

<div class="container">
  <h1 class="header">RETROGRADE</h1>
  <div class="box mdc-elevation--z3">
    <p class="field-name">Board Name</p>
    <div class="input">
      <Textfield
        variant="outlined"
        bind:value={boardName}
        style="height: 2em; flex: 1 1 0;" />
      <Button
        on:click={newBoard}
        variant="raised"
        style="margin-left: 0.5em; flex: 0 0 7em;">
        <Icon class="material-icons">add</Icon>
        <Label>Create</Label>
      </Button>
    </div>
  </div>
</div>
