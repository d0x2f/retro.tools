<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { _ } from 'svelte-i18n';

  import { gtag } from './ga.js';
  import { createRank, createBoard, getBoards } from './api.js';
  import { Icons, BoardTemplates } from './data.js';
  import { password } from './store.js';
  import { encrypt } from './crypto.js';

  import Button from './components/Button.svelte';
  import Input from './components/Input.svelte';
  import Checkbox from './components/Checkbox.svelte';
  import Select from './components/Select.svelte';
  import Spinner from './components/Spinner.svelte';
  import FloatingActionButton from './components/FloatingActionButton.svelte';
  import BoardTable from './components/BoardTable.svelte';
  import LocaleSelect from './components/LocaleSelect.svelte';
  import Alert from './components/Alert.svelte';

  export let nav;
  export let errorAlertVisible = false;
  export let errorAlertMessage = 'error.network';

  let boardName = '';
  let templateKey = 'dropAddKeepImprove';
  let passwordDisabled = true;
  let showPassword = false;
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
    let [boardNameEncrypted, encryptionTest] = await Promise.all([
      encrypt(boardName, $password),
      encrypt('encryptionTest', $password),
    ]);
    let board = await createBoard(boardNameEncrypted, { encryptionTest });
    for (const rank of template.ranks) {
      await createRank(board.id, rank.name, rank);
    }
    return board;
  }

  async function newBoard() {
    createBusy = true;
    if (passwordDisabled) {
      password.set('');
    }
    try {
      const board = await createFromTemplate(BoardTemplates[templateKey]);
      gtag('event', 'conversion', {
        send_to: 'AW-996832467/QhvrCJDnrcABENPpqdsD',
      });
      errorAlertVisible = false;
      nav.navigate(`/${board.id}`);
    } catch (err) {
      error('error.creating_board', err);
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
    <p class="text-primary mb-1">{$_('splash.board_name')}</p>
    <Input
      placeholder={$_('splash.board_name_example')}
      bind:value={boardName} />
    <p class="text-primary my-1">{$_('splash.template')}</p>
    <Select bind:value={templateKey}>
      {#each Object.entries(BoardTemplates) as [key, template]}
        <option value={key}>{$_(template.name)}</option>
      {/each}
    </Select>
    <p class="text-primary my-1">{$_('general.encryption')}</p>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          <Checkbox
            addon
            on:input={i => (passwordDisabled = !i.target.checked)} />
        </div>
      </div>
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder={$_('general.password')}
        bind:disabled={passwordDisabled}
        bind:value={$password} />
      <div class="input-group-append">
        <div class="input-group-text">
          <div class="icon" on:click={() => (showPassword = !showPassword)}>
            {#if showPassword}
              <Icons.eye />
            {:else}
              <Icons.eyeOff />
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div class="text-right">
      <Button
        class="mt-2"
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
          {$_('splash.create')}
        </div>
      </Button>
    </div>

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
