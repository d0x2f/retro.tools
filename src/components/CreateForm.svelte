<script>
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  import { gtag } from '../ga.js';
  import { Icons, BoardTemplates } from '../data.js';
  import { password } from '../store.js';
  import { encrypt } from '../crypto.js';
  import { createRank, createBoard } from '../api.js';

  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import Checkbox from './Checkbox.svelte';
  import Select from './Select.svelte';
  import Spinner from './Spinner.svelte';

  const dispatch = createEventDispatcher();
  let boardName = '';
  let templateKey = 'dropAddKeepImprove';
  let passwordDisabled = true;
  let showPassword = false;
  let createBusy = false;

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
      dispatch('created', board.id);
    } catch (err) {
      dispatch('error', { message: 'error.creating_board', err });
      createBusy = false;
    }
  }
</script>

<style>
  .icon {
    width: 1.5em;
    height: 1.5em;
    margin-top: -1px;
  }
</style>

<div data-name="create-form">
  <p class="text-primary mb-1">{$_('splash.board_name')}</p>
  <Input
    data-name="board-name-input"
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
      disabled={createBusy}
      data-name="create-button">
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
</div>
