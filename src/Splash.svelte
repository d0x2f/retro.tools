<script>
  import { onMount } from 'svelte';
  import { Button, CustomInput, Input, Spinner, Table } from 'sveltestrap';
  import { fade } from 'svelte/transition';
  import moment from 'moment';

  import { gtag } from './ga.js';
  import { createRank, createBoard, getBoards } from './api.js';
  import { Icons, BoardTemplates } from './data.js';
  import FloatingActionButton from './components/FloatingActionButton.svelte';

  export let nav;

  let boardName = '';
  let templateKey = 'dropAddKeepImprove';
  let createBusy = false;
  let boards = [];

  onMount(async () => {
    boards = await getBoards();
  });

  async function createFromTemplate(template) {
    createBusy = true;
    let board = await createBoard(boardName);
    for (const rank of template.ranks) {
      await createRank(board.id, rank.name, rank);
    }
    return board;
  }

  async function newBoard() {
    const board = await createFromTemplate(BoardTemplates[templateKey]);
    gtag('event', 'conversion', {
      send_to: 'AW-996832467/QhvrCJDnrcABENPpqdsD',
    });
    navigateToBoard(board.id);
  }

  function navigateToBoard(boardId) {
    nav.navigate(`/${boardId}`);
  }
</script>

<style>
  .scroll {
    overflow: auto;
  }

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

  .board-link {
    cursor: pointer;
  }
</style>

<div in:fade class="d-flex justify-content-center pt-5 scroll">
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
    <p class="text-primary my-1">Template</p>
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
      <Button
        class="mt-1"
        color="primary"
        on:click={newBoard}
        disabled={createBusy}>
        <div class="d-flex">
          <div class="d-block icon">
            {#if createBusy}
              <Spinner size="sm" color="light" />
            {:else}
              <Icons.plus />
            {/if}
          </div>
          Create
        </div>
      </Button>
    </div>

    {#if boards.length > 0}
      <div in:fade>
        <p class="text-primary my-3">Your Boards</p>
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th class="text-right">Created</th>
            </tr>
          </thead>
          <tbody>
            {#each boards.sort((a, b) => {
              return b.created_at.secs_since_epoch > a.created_at.secs_since_epoch;
            }) as board}
              <tr
                class="board-link"
                data-board={board.id}
                on:click={() => navigateToBoard(board.id)}>
                <td>
                  {#if board.name}
                    {board.name}
                  {:else}
                    <i class="small">(No name given)</i>
                  {/if}
                </td>
                <td class="text-right">
                  {moment(new Date(board.created_at.secs_since_epoch * 1000)).fromNow()}
                </td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </div>
    {/if}
  </div>
</div>

<div class="fixed-bottom bigger-icon m-1 right">
  <FloatingActionButton
    className="btn-dark"
    icon={Icons.github}
    on:click={() => window.open('https://github.com/d0x2f/retrograde.js', '_blank')} />
</div>
