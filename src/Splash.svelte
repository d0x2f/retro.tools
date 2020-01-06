<script>
  import { faPlus } from '@fortawesome/free-solid-svg-icons';

  import { createRank, createBoard } from './api.js';
  import TextField from './components/TextField.svelte';
  import Button from './components/Button.svelte';

  export let nav;

  let boardName = '';

  async function newBoard() {
    let board = await createBoard(boardName);
    await createRank(board.id, 'MAD');
    await createRank(board.id, 'SAD');
    await createRank(board.id, 'GLAD');
    nav.navigate(`/${board.id}`);
  }
</script>

<style lang="scss">
  @import '../theme/colors.scss';

  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .header {
    flex: 0 0 5em;
    font-size: 200%;
    font-family: 'Work Sans', sans-serif;
    color: $primary;
    text-transform: uppercase;
  }

  .box {
    flex: 0 0 0;
    padding: 2em 2em;
    height: 10em;
    margin: 1em auto;
    background-color: $background;
    box-shadow: none;
  }

  .field-name {
    text-align: left;
    margin: 0;
    margin-bottom: 0.2em;
    font-size: 80%;
    color: $primary;
    font-family: 'Work Sans', sans-serif;
  }

  .input {
    display: flex;
  }

  .button {
    margin-left: 0.5em;
    flex: 0 0 5.3em;
  }
</style>

<div class="container">
  <div class="box">
    <h1 class="header">retrograde</h1>
    <br />
    <p class="field-name">Board Name</p>
    <div class="input">
      <TextField bind:text={boardName} placeholder="Sprint 21 Retro" />
      <div class="button">
        <Button on:click={newBoard} icon={faPlus} label="create" />
      </div>
    </div>
  </div>
</div>
