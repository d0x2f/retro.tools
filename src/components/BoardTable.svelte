<script>
  import { slide } from 'svelte/transition';
  import { _ } from 'svelte-i18n';

  import { colorMode } from '../store';

  import Table from './Table.svelte';
  import BoardRow from './BoardRow.svelte';
  import Button from './Button.svelte';

  let { boards = [], onclick, ondeleted, onerror } = $props();
  let expanded = $state(false);
</script>

{#if boards.length > 0}
  <Button
    color={$colorMode}
    textColor="body"
    data-name="board-list-button"
    class="mt-2 text-start"
    onclick={() => (expanded = !expanded)}
  >
    <div class:rotate-90={expanded} class="transition d-inline-block">▸</div>
    {$_('splash.your_boards')}
  </Button>
  {#if expanded}
    <div in:slide out:slide data-name="board-table" class="text-dark">
      <Table hover class="w-100">
        <tbody>
          {#each boards.toSorted((a, b) => {
            return b.created_at > a.created_at ? 1 : -1;
          }) as board (board.id)}
            <BoardRow {board} {onclick} {ondeleted} {onerror} />
          {/each}
        </tbody>
      </Table>
    </div>
  {/if}
{/if}

<style>
  .transition {
    transition: 0.15s transform ease-in-out !important;
  }
  .rotate-90 {
    transform: translate(0px, 2px) rotate(90deg);
  }
</style>
