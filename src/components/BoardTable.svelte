<script>
  import { slide } from 'svelte/transition';
  import { _ } from 'svelte-i18n';

  import Table from './Table.svelte';
  import BoardRow from './BoardRow.svelte';

  export let boards = [];
  let expanded = false;
</script>

<style>
  .pointer {
    cursor: pointer;
  }
</style>

{#if boards.length > 0}
  <div class="ml-1 mt-2 small pointer" on:click={() => (expanded = !expanded)}>
    {#if expanded}▾{:else}▸{/if}
    {$_('splash.your_boards')}
  </div>
  {#if expanded}
    <div in:slide out:slide data-name="board-table" class="text-dark">
      <Table hover class="w-100">
        <tbody>
          {#each boards.sort((a, b) => {
            return b.created_at.secs_since_epoch > a.created_at.secs_since_epoch ? 1 : -1;
          }) as board (board.id)}
            <BoardRow {board} on:click on:deleted on:error />
          {/each}
        </tbody>
      </Table>
    </div>
  {/if}
{/if}
