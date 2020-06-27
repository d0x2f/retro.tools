<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { flip } from 'svelte/animate';
  import { _ } from 'svelte-i18n';
  import { Button } from 'sveltestrap';

  import { board, cards, ranks, settings } from '../store.js';
  import Card from './Card.svelte';
  import CardForm from './CardForm.svelte';
  import { getRankDetails, Icons } from '../data.js';
  import { createCard } from '../api.js';

  export let rank;
  export let send = false;
  export let receive = false;
  export let drake = false;

  let dropTarget;

  let rankDetails = getRankDetails(rank);

  let sortedFilteredCards;
  let columnWidth = 'col-md-3';
  let comment = '';

  const dispatch = createEventDispatcher();

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

  function error(message, err) {
    dispatch('error', { message, err });
  }

  async function newCard() {
    if (!$board.cards_open) {
      if ($board.owner) {
        error($_('board.creation_disabled_as_owner'));
      } else {
        error($_('board.creation_disabled_as_participant'));
      }
      return;
    }

    const tempId = Math.floor(Math.random() * 10000);
    cards.append({
      id: tempId,
      name: 'Card',
      description: comment,
      rank_id: rank.id,
      uncommitted: true,
      votes: 0,
      created_at: {
        secs_since_epoch: Date.now() / 1000,
      },
    });
    try {
      cards.replace(tempId, await createCard($board.id, rank.id, comment));
    } catch (err) {
      error('error.creating_card', err);
      cards.remove(tempId);
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
    box-sizing: content-box;
  }
</style>

<div class="rank flex-grow-0 flex-shrink-0 {columnWidth}">
  <div class="border-bottom d-flex p-2 mb-2 {rankDetails.classes.color}">
    <div class="icon p-2">
      <svelte:component this={rankDetails.icon} />
    </div>
    <CardForm on:submit={newCard} placeholder={$_(rank.name)} bind:comment />
    <div class="d-md-none ml-1">
      <Button color="light" disabled={comment.length == 0} on:click={newCard}>
        <div class="icon">
          <Icons.enter />
        </div>
      </Button>
    </div>
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
            class="py-1"
            data-drag={!(card.owner || $board.owner) ? 'false' : 'true'}>
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
        class="text-secondary text-center mt-5 text-center float-right w-100"
        data-drag="false">
        <small>
          {#if !$board.cards_open}
            {#if $board.owner}
              {$_('board.creation_disabled_as_owner')}
            {:else}{$_('board.creation_disabled_as_participant')}{/if}
          {:else}{$_('board.no_cards')}{/if}
        </small>
      </div>
    {/if}
  </div>
</div>
