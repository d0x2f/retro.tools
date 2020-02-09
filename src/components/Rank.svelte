<script>
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';

  import { board, cards, ranks, settings } from '../store.js';
  import Card from './Card.svelte';
  import { getRankDetails } from '../data.js';

  export let rank;
  export let send = false;
  export let receive = false;
  export let drake = false;

  let dropTarget;

  let rankDetails = getRankDetails(rank);

  let sortedFilteredCards;
  let columnWidth = 'col-md-3';

  $: {
    sortedFilteredCards = $cards
      .filter(c => c.rank_id === rank.id && !c.uncommitted)
      .sort((a, b) =>
        $settings.sorted
          ? a.votes < b.votes
            ? 1
            : -1
          : a.created_at.secs_since_epoch > b.created_at.secs_since_epoch
      );
  }

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

  onMount(() => {
    if (drake) {
      drake.containers.push(dropTarget);
    }
  });
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
    text-uppercase mb-2">
    <div class="icon d-inline-block">
      <svelte:component this={rankDetails.icon} />
    </div>
    <br />
    {rank.name}
  </div>
  <div class="h-100" bind:this={dropTarget} data-rank-id={rank.id}>
    {#if $cards}
      {#if send}
        {#each sortedFilteredCards as card (card.id)}
          <div
            data-card-id={card.id}
            in:receive={{ key: card.id }}
            out:send={{ key: card.id }}
            animate:flip={{ duration: 200 }}
            class="py-1">
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
      <div
        class="text-secondary text-center mt-5 text-center"
        data-drag="false">
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
