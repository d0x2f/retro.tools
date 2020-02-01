<script>
  import { onMount } from 'svelte';
  import {
    Button,
    CustomInput,
    Input,
    Spinner,
    Table,
    Alert,
  } from 'sveltestrap';
  import { fade, fly } from 'svelte/transition';

  import { gtag } from './ga.js';
  import { createRank, createBoard, getBoards } from './api.js';
  import { Icons, BoardTemplates } from './data.js';
  import FloatingActionButton from './components/FloatingActionButton.svelte';
  import BoardRow from './components/BoardRow.svelte';

  export let nav;
  export let errorAlertVisible = false;
  export let errorAlertMessage = 'Network error!';

  let boardName = '';
  let templateKey = 'dropAddKeepImprove';
  let createBusy = false;
  let boards = [];
  let errorClearTimeout;

  async function doGetBoards() {
    // If the getBoards request fails, just silently omit the board list
    try {
      boards = await getBoards();
    } catch {
      boards = [];
    }
  }

  function error(message, err) {
    if (err) console.error(err);
    errorAlertVisible = true;
    errorAlertMessage = message;

    if (errorClearTimeout) clearTimeout(errorClearTimeout);
    errorClearTimeout = setTimeout(() => (errorAlertVisible = false), 3000);
  }

  function handleError({ detail: { message, err } }) {
    error(message, err);
  }

  async function createFromTemplate(template) {
    let board = await createBoard(boardName);
    for (const rank of template.ranks) {
      await createRank(board.id, rank.name, rank);
    }
    return board;
  }

  async function newBoard() {
    createBusy = true;
    try {
      const board = await createFromTemplate(BoardTemplates[templateKey]);
      gtag('event', 'conversion', {
        send_to: 'AW-996832467/QhvrCJDnrcABENPpqdsD',
      });
      errorAlertVisible = false;
      nav.navigate(`/${board.id}`);
    } catch (err) {
      error('Error creating board!', err);
    } finally {
      createBusy = false;
    }
  }

  onMount(async () => {
    await doGetBoards();
  });
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
</style>

<div class="d-flex justify-content-center pt-5 scroll">
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
        <Table hover class="w-100">
          <thead>
            <tr>
              <th>Name</th>
              <th class="text-right">Created</th>
              <th class="w-25" />
            </tr>
          </thead>
          <tbody>
            {#each boards.sort((a, b) => {
              return b.created_at.secs_since_epoch > a.created_at.secs_since_epoch;
            }) as board}
              <BoardRow
                {board}
                {nav}
                on:deleted={doGetBoards}
                on:error={handleError} />
            {/each}
          </tbody>
        </Table>
      </div>
    {/if}
  </div>
</div>

{#if errorAlertVisible}
  <div
    class="fixed-bottom"
    in:fly={{ y: 100, duration: 200 }}
    out:fly={{ y: 100, duration: 200 }}>
    <Alert class="fixed-bottom mb-0 py-1" color="danger" isOpen={true}>
      {errorAlertMessage}
    </Alert>
  </div>
{/if}

<div class="fixed-bottom bigger-icon m-1 right">
  <FloatingActionButton
    className="btn-dark"
    icon={Icons.github}
    on:click={() => window.open('https://github.com/d0x2f/retrograde.js', '_blank')} />
</div>
