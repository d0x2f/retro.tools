<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { _ } from 'svelte-i18n';

  import { getBoards } from './api.js';
  import { Icons } from './data.js';

  import FloatingActionButton from './components/FloatingActionButton.svelte';
  import BoardTable from './components/BoardTable.svelte';
  import LocaleSelect from './components/LocaleSelect.svelte';
  import Alert from './components/Alert.svelte';
  import CreateForm from './components/CreateForm.svelte';

  export let nav;
  export let errorAlertVisible = false;
  export let errorAlertMessage = 'error.network';

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

  onMount(async () => {
    await doGetBoards();
  });
</script>

<style>
  .scroll {
    overflow: auto;
  }

  .bigger-icon {
    width: 2em;
    height: 2em;
  }

  .right {
    right: 0;
    left: auto;
  }
</style>

<div class="d-flex justify-content-center pt-2 scroll">
  <div class="col-lg-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="text-primary text-uppercase">retro.tools</h1>
      <LocaleSelect />
    </div>

    <CreateForm
      on:error={handleError}
      on:created={({ detail: boardId }) => nav.navigate(`/${boardId}`)} />

    <BoardTable
      {boards}
      on:click={({ detail: boardId }) => nav.navigate(`/${boardId}`)}
      on:error={handleError}
      on:deleted={doGetBoards} />
  </div>
</div>

{#if errorAlertVisible}
  <div
    class="fixed-bottom"
    in:fly={{ y: 100, duration: 200 }}
    out:fly={{ y: 100, duration: 200 }}>
    <Alert class="fixed-bottom mb-0 py-1" color="danger" isOpen={true}>
      {$_(errorAlertMessage)}
    </Alert>
  </div>
{/if}

<div class="fixed-bottom bigger-icon m-1 right">
  <FloatingActionButton
    className="btn-dark"
    icon={Icons.github}
    on:click={() => window.open('https://github.com/d0x2f/retrograde.js', '_blank')} />
</div>
