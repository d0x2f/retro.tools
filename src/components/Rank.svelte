<script>
  import Icon from 'fa-svelte';

  import { cards, settings } from '../store.js';
  import Card from './Card.svelte';

  export let rank;
  export let color;
  export let icon;

  $: sortedFilteredCards = $cards
    .filter(c => c.rank_id === rank.id)
    .sort((a, b) => {
      if ($settings.sorted) {
        return a.votes < b.votes;
      } else {
        return a.created_at.secs_since_epoch > b.created_at.secs_since_epoch;
      }
    });
</script>

<style>
  .header {
    text-align: center;
  }
</style>

<div class="rank flex-grow-0 flex-shrink-0 col-md-2">
  <div class="header d-none d-md-block {color} border-bottom">
    <div>
      <Icon {icon} />
    </div>
    {rank.name}
  </div>
  <div>
    {#if $cards}
      {#each sortedFilteredCards as card}
        <Card bind:card {color} />
      {/each}
    {/if}
    {#if !$cards || $cards.length === 0}
      <div class="text-light">Nothing...</div>
    {/if}
  </div>
</div>
