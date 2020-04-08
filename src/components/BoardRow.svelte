<script>
  import { createEventDispatcher } from 'svelte';
  import { Button, Spinner } from 'sveltestrap';
  import moment from 'moment';
  import { _, locale } from 'svelte-i18n';

  import { Icons } from '../data.js';
  import { deleteBoard } from '../api.js';

  export let board;
  export let nav;

  const dispatch = createEventDispatcher();
  let showDeleteBoardConfirmBox = false;
  let busy = false;

  function error(message, err) {
    dispatch('error', { message, err });
  }

  function toggleDeleteBoardConfirmBox() {
    showDeleteBoardConfirmBox = !showDeleteBoardConfirmBox;
  }

  async function deleteCardSubmit() {
    toggleDeleteBoardConfirmBox();
    busy = true;
    try {
      await deleteBoard(board.id);
      dispatch('deleted');
    } catch (err) {
      error('error.board_delete', err);
    }
  }
</script>

<style>
  .board-link {
    cursor: pointer;
  }
</style>

<tr>
  <td
    class="align-middle board-link"
    on:click={() => nav.navigate(`/${board.id}`)}>
    {#if board.name}
      {board.name}
    {:else}
      <i class="small">{$_('splash.no_name')}</i>
    {/if}
  </td>
  <td class="text-right align-middle">
    {moment(new Date(board.created_at.secs_since_epoch * 1000))
      .locale($locale)
      .fromNow()}
  </td>
  {#if showDeleteBoardConfirmBox}
    <td>
      <div class="d-flex justify-content-end w-100 h-100 text-center">
        <Button
          color="dark"
          class="mr-1"
          on:click={toggleDeleteBoardConfirmBox}>
          <Icons.close size="1x" />
        </Button>

        <Button color="danger" on:click={deleteCardSubmit}>
          <Icons.check size="1x" />
        </Button>
      </div>
    </td>
  {:else}
    <td class="text-right">
      {#if board.owner}
        <Button color="danger" on:click={toggleDeleteBoardConfirmBox}>
          {#if busy}
            <Spinner size="sm" color="light" />
          {:else}
            <Icons.trash size="1x" />
          {/if}
        </Button>
      {/if}
    </td>
  {/if}
</tr>
