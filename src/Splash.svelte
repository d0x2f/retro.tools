<script>
  import { Button, Input } from 'sveltestrap';
  import { PlusIcon } from 'svelte-feather-icons';

  import { createRank, createBoard } from './api.js';

  export let nav;

  let boardName = '';

  const rankDetails = {
    msd: [
      {
        icon: 'FrownIcon',
        name: 'MAD',
        selected: 'text-danger border-danger',
        deselected: 'text-danger',
        color: 'text-danger border-danger',
      },
      {
        icon: 'MehIcon',
        name: 'SAD',
        selected: 'text-primary border-primary',
        deselected: 'text-primary',
        color: 'text-primary border-primary',
      },
      {
        icon: 'SmileIcon',
        name: 'GLAD',
        selected: 'text-success border-success',
        deselected: 'text-success',
        color: 'text-success border-success',
      },
    ],
  };

  async function createFromTemplate(template) {
    let board = await createBoard(boardName);
    for (const rank of template) {
      await createRank(board.id, rank.name, rank);
    }
    return board;
  }

  async function newBoard() {
    const board = await createFromTemplate(rankDetails.msd);
    nav.navigate(`/${board.id}`);
  }
</script>

<style>
  .icon {
    width: 1.5em;
    height: 1.5em;
    margin-top: -1px;
  }
</style>

<div class="d-flex justify-content-center pt-5">
  <div class="col-md-3">
    <h1 class="text-primary text-uppercase mb-3">retrograde</h1>
    <p class="text-primary mb-1">Board Name</p>
    <div class="d-flex">
      <Input
        readonly={undefined}
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
          <div class="d-block icon">
            <PlusIcon />
          </div>
          Create
        </div>
      </Button>
    </div>
  </div>
</div>
