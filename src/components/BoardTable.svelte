<script>
  import { fade } from 'svelte/transition';
  import { _ } from 'svelte-i18n';

  import Table from './Table.svelte';
  import BoardRow from './BoardRow.svelte';

  export let boards = [];
</script>

{#if boards.length > 0}
  <div in:fade data-name="board-table">
    <p class="text-primary my-3">{$_('splash.your_boards')}</p>
    <Table hover class="w-100">
      <thead>
        <tr>
          <th>{$_('splash.name')}</th>
          <th class="text-right">{$_('splash.created')}</th>
        </tr>
      </thead>
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
