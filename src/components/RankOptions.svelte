<script>
  import clsx from 'clsx';
  import { dictionary, _ } from 'svelte-i18n';
  import { Button as SSButton } from '@sveltestrap/sveltestrap';

  import { updateRank } from '../api';
  import { ColumnIcons, Icons } from '../data';
  import { activeRankOptions, board, colorMode, colors } from '../store';
  import Input from './Input.svelte';

  let { class: className = '', rank = $bindable(), onerror } = $props();

  let classes = $derived(clsx(className, 'd-flex flex-column'));

  let rankName = $state(
    new Set(Object.keys($dictionary.en)).has(rank.name)
      ? $_(rank.name)
      : rank.name
  );

  function error(message, err) {
    onerror?.({ message, err });
  }

  async function doUpdate() {
    try {
      await updateRank($board.id, { ...rank, name: rankName });
    } catch (err) {
      error('error.network', err);
    }
  }
</script>

<div class={classes} data-name="rank-options">
  <Input
    type="text"
    bind:value={rankName}
    class="m-1"
    onblur={doUpdate}
    onsubmit={() => {
      $activeRankOptions = '';
      doUpdate();
    }}
  />
  <div class="btn-group w-100 m-1" role="group" data-name="rank-options-colors">
    {#each Object.entries($colors) as [name, color] (name)}
      <SSButton
        style="background-color: {color};"
        onclick={() => {
          rank.data.color = name;
          doUpdate();
        }}
      >
        {#if rank.data.color == name}
          <div style="color: {color};" class="invert"><Icons.check /></div>
        {/if}
      </SSButton>
    {/each}
  </div>
  {#each ColumnIcons as row, i (i)}
    <div
      class="w-100 mx-1 d-flex justify-content-around w-100 my-1"
      data-name="rank-options-icons"
    >
      {#each row as name (name)}
        {@const SvelteComponent = Icons[name]}
        <div
          role="button"
          tabindex="0"
          onkeypress={null}
          onclick={() => {
            rank.data.icon = name;
            doUpdate();
          }}
          style="color: {$colors[rank.data.color]}"
          class:text-body={rank.data.icon !== name}
          class="p-1"
        >
          <SvelteComponent />
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .invert {
    filter: brightness(0.5);
  }
</style>
