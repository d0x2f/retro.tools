<script>
  import { createEventDispatcher } from "svelte";
  import moment from "moment";
  import { _, locale } from "svelte-i18n";

  import { Icons } from "../data.js";
  import { deleteBoard } from "../api.js";
  import { isBoardEncrypted } from "../encryption.js";

  import Button from "./Button.svelte";
  import Spinner from "./Spinner.svelte";
  import { colorMode } from "../store.js";

  export let board;

  const dispatch = createEventDispatcher();
  let showDeleteBoardConfirmBox = false;
  let busy = false;

  function error(message, err) {
    dispatch("error", { message, err });
  }

  function startDelete(e) {
    showDeleteBoardConfirmBox = true;
    e.preventDefault();
    e.stopPropagation();
  }

  function cancelDelete(e) {
    showDeleteBoardConfirmBox = false;
    e.preventDefault();
    e.stopPropagation();
  }

  async function submitDelete(e) {
    busy = true;
    showDeleteBoardConfirmBox = false;
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteBoard(board.id);
      dispatch("deleted");
    } catch (err) {
      busy = false;
      error("error.board_delete", err);
    }
  }
</script>

<tr
  data-name="board-row"
  data-board-id={board.id}
  on:keypress={null}
  on:click={() => dispatch("click", board.id)}
>
  <td class="pointer border-top-0">
    {#if board.name}
      {#await isBoardEncrypted(board)}
        …
      {:then encrypted}
        {#if encrypted}
          <i class="small">{$_("general.encrypted")}</i>
        {:else}{board.name}{/if}
      {/await}
    {:else}
      <i class="small">{$_("splash.no_name")}</i>
    {/if}
  </td>
  <td class="text-end pointer border-top-0">
    {#if showDeleteBoardConfirmBox}
      <Button
        data-name="delete-cancel-button"
        color="secondary"
        textColor="light"
        class="me-1"
        on:click={cancelDelete}
      >
        <Icons.close size="1x" />
      </Button>

      <Button
        data-name="delete-confirm-button"
        color="danger"
        textColor="light"
        on:click={submitDelete}
      >
        <Icons.check size="1x" />
      </Button>
    {:else}
      {moment(new Date(board.created_at * 1000))
        .locale($locale)
        .fromNow()}
      {#if board.owner}
        <Button
          data-name="delete-button"
          color={$colorMode}
          class="ms-2 text-danger"
          on:click={startDelete}
          disabled={busy}
        >
          {#if busy}
            <Spinner size="sm" color={$colorMode} />
          {:else}
            <Icons.trash size="1x" />
          {/if}
        </Button>
      {/if}
    {/if}
  </td>
</tr>

<style>
  .pointer {
    cursor: pointer;
  }
</style>
