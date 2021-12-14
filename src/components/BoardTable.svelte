<script>
  import { slide } from 'svelte/transition';
  import { _ } from 'svelte-i18n';

  import Table from './Table.svelte';
  import BoardRow from './BoardRow.svelte';

  export let boards = [];
  let expanded = false;
</script>

{#if boards.length > 0}
  <div
    data-name="board-list-button"
    class="ml-1 mt-2 small pointer text-dark"
    on:click={() => (expanded = !expanded)}
  >
    {#if expanded}▾{:else}▸{/if}
    {$_('splash.your_boards')}
  </div>
  {#if expanded}
    <div in:slide out:slide data-name="board-table" class="text-dark">
      <Table hover class="w-100">
        <tbody>
          {#each boards.sort((a, b) => {
            return b.created_at > a.created_at ? 1 : -1;
          }) as board (board.id)}
            <BoardRow {board} on:click on:deleted on:error />
          {/each}
        </tbody>
      </Table>
    </div>
  {/if}
{/if}

<style>
  .pointer {
    cursor: pointer;
  }
</style>
