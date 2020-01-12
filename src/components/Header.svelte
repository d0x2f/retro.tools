<script>
  import { SettingsIcon } from 'svelte-feather-icons';
  import { Button } from 'sveltestrap';

  import { board, settings } from '../store.js';
  import Switch from './Switch.svelte';

  let showMobileSettings = false;
</script>

<style>

</style>

<div class="shadow-sm">
  <div class="d-flex justify-content-between pt-1">
    <div class="text-primary text-uppercase font-weight-bold h5 pt-1 pl-3">
      retrograde
    </div>
    <div
      class="d-md-none text-primary"
      on:click={() => (showMobileSettings = !showMobileSettings)}>
      <Button color="light" size="sm" style="width: 2.9em;">
        <SettingsIcon />
      </Button>
    </div>
    <div class="d-none d-md-flex">
      {#if $board.owner}
        <Switch text="Voting" bind:checked={$board.voting_open} />
        <Switch text="Cards Allowed" bind:checked={$board.cards_open} />
      {/if}
      <Switch text="Sort by Votes" bind:checked={$settings.sorted} />
    </div>
  </div>
  {#if showMobileSettings}
    <div class="d-md-none">
      {#if $board.owner}
        <Switch text="Voting" bind:checked={$board.voting_open} />
        <Switch text="Cards Allowed" bind:checked={$board.cards_open} />
      {/if}
      <Switch text="Sort by Votes" bind:checked={$settings.sorted} />
    </div>
  {/if}
</div>
