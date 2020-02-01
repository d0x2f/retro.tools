<script>
  import { flip } from 'svelte/animate';

  import { board, cards, ranks, settings } from '../store.js';
  import Card from './Card.svelte';
  import { getRankDetails } from '../data.js';

  export let rank;
  export let send = false;
  export let receive = false;

  let rankDetails = getRankDetails(rank);

  let sortedFilteredCards;
  let columnWidth = 'col-md-3';

  $: sortedFilteredCards = $cards
    .filter(c => c.rank_id === rank.id && !c.uncommitted)
    .sort((a, b) =>
      $settings.sorted
        ? a.votes < b.votes
        : a.created_at.secs_since_epoch > b.created_at.secs_since_epoch
    );

  $: {
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
  }
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
      {#if send}
        {#each sortedFilteredCards as card (card.id)}
          <div
            in:receive={{ key: card.id }}
            out:send={{ key: card.id }}
            animate:flip={{ duration: 200 }}
            class="px-2 py-2">
            <Card {card} on:error color={rankDetails.classes.color} />
          </div>
        {/each}
      {:else}
        {#each sortedFilteredCards as card (card.id)}
          <div animate:flip={{ duration: 200 }} class="py-2">
            <Card bind:card on:error color={rankDetails.classes.color} />
          </div>
        {/each}
      {/if}
    {/if}
    {#if !sortedFilteredCards || sortedFilteredCards.length === 0}
      <div class="text-secondary text-center mt-5 position-absolute w-100">
        <small>
          {#if !$board.cards_open}
            {#if $board.owner}
              Card creation is disabled, enable it using the drop down menu in
              the top right.
            {:else}Card creation is disabled by the board owner.{/if}
          {:else}No cards{/if}
        </small>
      </div>
    {/if}
  </div>
</div>
