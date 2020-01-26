<script>
  import { cards, ranks, settings } from '../store.js';
  import Card from './Card.svelte';
  import { getRankDetails } from '../data.js';

  export let rank;

  let rankDetails = getRankDetails(rank);

  let sortedFilteredCards;
  let columnWidth = 'col-md-3';

  $: sortedFilteredCards = $cards
    .filter(c => c.rank_id === rank.id)
    .sort((a, b) =>
      $settings.sorted
        ? a.votes < b.votes
        : a.created_at.secs_since_epoch > b.created_at.secs_since_epoch
    );

  $: (() => {
    switch ($ranks.length) {
      case 1:
      case 2:
        columnWidth = 'col-md-4';
        break;
      case 3:
        columnWidth = 'col-md-3';
        break;
      case 4:
      default:
        columnWidth = 'col-md-3';
        break;
    }
  })();
</script>

<style>
  .header {
    text-align: center;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
  }
</style>

<div class="rank flex-grow-0 flex-shrink-0 {columnWidth}">
  <div
    class="header d-none d-md-block {rankDetails.classes.color} border-bottom
    text-uppercase">
    <div class="icon d-inline-block">
      <svelte:component this={rankDetails.icon} />
    </div>
    <br />
    {rank.name}
  </div>
  <div>
    {#if $cards}
      {#each sortedFilteredCards as card}
        <Card {card} color={rankDetails.classes.color} />
      {/each}
    {/if}
    {#if !sortedFilteredCards || sortedFilteredCards.length === 0}
      <div class="text-secondary text-center mt-5">No cards...</div>
    {/if}
  </div>
</div>
