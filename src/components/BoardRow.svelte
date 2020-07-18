<script>
  import { createEventDispatcher } from 'svelte';
  import moment from 'moment';
  import { _, locale } from 'svelte-i18n';

  import { Icons } from '../data.js';
  import { deleteBoard } from '../api.js';
  import { isBoardEncrypted } from '../crypto.js';

  import Button from './Button.svelte';
  import Spinner from './Spinner.svelte';

  export let board;

  const dispatch = createEventDispatcher();
  let showDeleteBoardConfirmBox = false;
  let busy = false;

  function error(message, err) {
    dispatch('error', { message, err });
  }

  function startDelete() {
    showDeleteBoardConfirmBox = true;
  }

  function cancelDelete() {
    showDeleteBoardConfirmBox = false;
  }

  async function submitDelete() {
    busy = true;
    showDeleteBoardConfirmBox = false;
    try {
      await deleteBoard(board.id);
      dispatch('deleted');
    } catch (err) {
      busy = false;
      error('error.board_delete', err);
    }
  }
</script>

<style>
  .pointer {
    cursor: pointer;
  }
</style>

<tr data-name="board-row" data-board-id={board.id}>
  <td class="align-middle pointer" on:click={() => dispatch('click', board.id)}>
    {#if board.name}
      {#await isBoardEncrypted(board)}
        …
      {:then encrypted}
        {#if encrypted}
          <i class="small">{$_('general.encrypted')}</i>
        {:else}{board.name}{/if}
      {/await}
    {:else}
      <i class="small">{$_('splash.no_name')}</i>
    {/if}
  </td>
  <td class="text-right align-middle pointer">
    {#if showDeleteBoardConfirmBox}
      <Button
        data-name="delete-cancel-button"
        color="dark"
        class="mr-1"
        on:click={cancelDelete}>
        <Icons.close size="1x" />
      </Button>

      <Button
        data-name="delete-confirm-button"
        color="danger"
        on:click={submitDelete}>
        <Icons.check size="1x" />
      </Button>
    {:else}
      {moment(new Date(board.created_at.secs_since_epoch * 1000))
        .locale($locale)
        .fromNow()}
      {#if board.owner}
        <Button
          data-name="delete-button"
          color="light"
          class="ml-2 text-danger"
          on:click={startDelete}
          disabled={busy}>
          {#if busy}
            <Spinner size="sm" color="light" />
          {:else}
            <Icons.trash size="1x" />
          {/if}
        </Button>
      {/if}
    {/if}
  </td>
</tr>
