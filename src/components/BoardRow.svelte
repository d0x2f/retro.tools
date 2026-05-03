<script>
  import { createEventDispatcher } from "svelte";
  import { _, locale } from "svelte-i18n";

  import { Icons } from "../data.js";
  import { deleteBoard } from "../api.js";
  import { isBoardEncrypted } from "../encryption.js";

  import Button from "./Button.svelte";
  import Spinner from "./Spinner.svelte";
  import { colorMode } from "../store.js";

  let { board } = $props();

  function fromNow(ms, loc) {
    const seconds = Math.round((Date.now() - ms) / 1000);
    const tag = loc ? loc.replace("_", "-") : "en";
    const rtf = new Intl.RelativeTimeFormat(tag, { numeric: "auto" });
    if (seconds < 45) return rtf.format(0, "second");
    if (seconds < 90) return rtf.format(-1, "minute");
    if (seconds < 2700) return rtf.format(-Math.round(seconds / 60), "minute");
    if (seconds < 5400) return rtf.format(-1, "hour");
    if (seconds < 79200) return rtf.format(-Math.round(seconds / 3600), "hour");
    if (seconds < 129600) return rtf.format(-1, "day");
    if (seconds < 2160000)
      return rtf.format(-Math.round(seconds / 86400), "day");
    if (seconds < 5184000) return rtf.format(-1, "month");
    if (seconds < 7776000)
      return rtf.format(-Math.round(seconds / 2592000), "month");
    return rtf.format(-Math.round(seconds / 31536000), "year");
  }

  const dispatch = createEventDispatcher();
  let showDeleteBoardConfirmBox = $state(false);
  let busy = $state(false);

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
  onkeypress={null}
  onclick={() => dispatch("click", board.id)}
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
      {fromNow(board.created_at * 1000, $locale)}
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
