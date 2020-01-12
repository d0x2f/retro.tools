<script>
  import { faPlus } from '@fortawesome/free-solid-svg-icons';
  import Icon from 'fa-svelte';
  import { Button, Input } from 'sveltestrap';

  import { createRank, createBoard } from './api.js';

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

<style>

</style>

<div class="d-flex justify-content-center pt-5">
  <div class="col-md-3">
    <h1 class="text-primary text-uppercase mb-3">retrograde</h1>
    <p class="text-primary mb-1">Board Name</p>
    <div class="d-flex">
      <Input
        type="text"
        name="boardName"
        id="boardName"
        placeholder="Sprint 21 Retro" />
      <Button
        class="ml-1"
        color="primary"
        on:click={newBoard}
        bind:value={boardName}>
        <div class="d-flex">
          <Icon icon={faPlus} class="m-1" />
          Create
        </div>
      </Button>
    </div>
  </div>
</div>
