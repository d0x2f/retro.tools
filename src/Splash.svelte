<script>
  import { Button, CustomInput, Input, Spinner } from 'sveltestrap';

  import { createRank, createBoard } from './api.js';
  import { Icons, BoardTemplates } from './data.js';
  import FloatingActionButton from './components/FloatingActionButton.svelte';

  export let nav;

  let boardName = '';
  let templateKey = 'madSadGlad';
  let busy = false;

  async function createFromTemplate(template) {
    busy = true;
    let board = await createBoard(boardName);
    for (const rank of template.ranks) {
      await createRank(board.id, rank.name, rank);
    }
    return board;
  }

  async function newBoard() {
    const board = await createFromTemplate(BoardTemplates[templateKey]);
    nav.navigate(`/${board.id}`);
  }
</script>

<style>
  .icon {
    width: 1.5em;
    height: 1.5em;
    margin-top: -1px;
  }

  .bigger-icon {
    width: 2em;
    height: 2em;
  }

  .go-button {
    text-align: right;
  }

  .right {
    right: 0;
    left: auto;
  }
</style>

<div class="d-flex justify-content-center pt-5">
  <div class="col-md-3">
    <h1 class="text-primary text-uppercase mb-3">retro.tools</h1>
    <p class="text-primary mb-1">Board Name</p>
    <Input
      readonly={undefined}
      type="text"
      name="boardName"
      id="boardName"
      placeholder="Sprint 21 Retro"
      bind:value={boardName} />
    <p class="text-primary mb-1">Template</p>
    <CustomInput
      readonly={undefined}
      type="select"
      name="templateSelect"
      id="templateSelect"
      bind:value={templateKey}>
      {#each Object.entries(BoardTemplates) as [key, template]}
        <option value={key}>{template.name}</option>
      {/each}
    </CustomInput>
    <div class="go-button">
      <Button class="mt-1" color="primary" on:click={newBoard} disabled={busy}>
        <div class="d-flex">
          <div class="d-block icon">
            {#if busy}
              <Spinner size="sm" color="light" />
            {:else}
              <Icons.plus />
            {/if}
          </div>
          Create
        </div>
      </Button>
    </div>
  </div>
</div>

<div class="fixed-bottom bigger-icon m-1 right">
  <FloatingActionButton
    className="btn-dark"
    icon={Icons.github}
    on:click={() => window.open('https://github.com/d0x2f/retrograde.js', '_blank')} />
</div>
