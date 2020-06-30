<script>
  import { onMount, onDestroy } from 'svelte';
  import { Alert } from 'sveltestrap';
  import { quintOut } from 'svelte/easing';
  import { crossfade, fly } from 'svelte/transition';
  import lodash from 'lodash';
  import dragula from 'dragula';
  import { _ } from 'svelte-i18n';

  import { board, ranks, cards } from './store.js';
  import { updateBoard, updateCard, getCards, getBoard } from './api.js';
  import { getRankDetails } from './data.js';

  import Rank from './components/Rank.svelte';
  import Header from './components/Header.svelte';

  export let nav;

  let selectedRank = '';
  let tabButtonWidth = '';
  let hidden = false;
  let refreshIntervalId;
  let unsubscribe;
  let errorAlertVisible = false;
  let errorAlertMessage = 'Network error!';
  let errorClearTimeout;
  let connectionLost = false;

  let drake = dragula({
    revertOnSpill: true,
    copySortSource: false,
    copy: true,
    moves: el => el.dataset.drag !== 'false',
    accepts: (el, target) => {
      return (
        target.dataset.rankId !==
        $cards.find(c => c.id === el.dataset.cardId).rank_id
      );
    },
  });

  drake.on('over', (_el, container) => {
    const emptyText = container.querySelector('small');
    if (emptyText) emptyText.parentElement.classList.add('d-none');
  });

  drake.on('out', (_el, container) => {
    const emptyText = container.querySelector('small');
    if (emptyText) emptyText.parentElement.classList.remove('d-none');
  });

  drake.on('drop', async (el, target) => {
    const rankId = target.dataset.rankId;
    const cardId = el.dataset.cardId;
    const card = $cards.find(c => c.id === cardId);
    const originalRankId = card.rank_id;

    el.parentNode.removeChild(el);
    card.rank_id = rankId;
    card.busy = true;
    $cards = $cards; // Trigger a redraw so the card picks up that it's busy
    try {
      cards.replace(card.id, await updateCard($board, card, originalRankId));
    } catch (err) {
      error('error.updating_card', err);
      card.rank_id = originalRankId; // Send the card back
      card.busy = false;
      $cards = $cards; // Force redraw
    }
  });

  $: {
    switch ($ranks.length) {
      case 1:
        tabButtonWidth = 'col-12';
        break;
      case 2:
        tabButtonWidth = 'col-6';
        break;
      case 3:
        tabButtonWidth = 'col-4';
        break;
      case 4:
      default:
        tabButtonWidth = 'col-3';
        break;
    }
  }

  const [cardSend, cardReceive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: t => `
          transform: ${transform} scale(${t});
          opacity: ${t}
        `,
      };
    },
  });

  function error(message, err) {
    if (err) console.error(err);
    errorAlertVisible = true;
    errorAlertMessage = message;

    if (errorClearTimeout) clearTimeout(errorClearTimeout);
    errorClearTimeout = setTimeout(() => (errorAlertVisible = false), 3000);
  }

  function handleError({ detail: { message, err } }) {
    error(message, err);
  }

  async function update() {
    if (!hidden) {
      try {
        const [b, c] = await Promise.all([
          getBoard($board.id),
          getCards($board.id),
        ]);
        board.set(b);
        cards.set(c);
        connectionLost = false;
      } catch {
        connectionLost = true;
      }
    }
  }

  onMount(async () => {
    // Update on initial load
    await update();

    // Show first rank initially
    if ($ranks[0]) selectedRank = $ranks[0].id;

    // Subscribe to board changes so we can post updates.
    // Compare updated boards to their last known value
    // to ensure we don't send supurfluous calls.
    let previousBoard = { ...$board };
    if ($board.owner)
      unsubscribe = board.subscribe(b => {
        try {
          if (!lodash.isEqual(previousBoard, b)) updateBoard(b);
        } catch (err) {
          error('error.updating_settings', err);
        }
        previousBoard = { ...b };
      });

    // Create an interval timer to resync updates
    refreshIntervalId && clearInterval(refreshIntervalId);
    refreshIntervalId = setInterval(async () => await update(), 10000);

    // Keep track of page visibility so we can pause updates while hidden
    document.addEventListener('visibilitychange', () => {
      hidden = document['hidden'];
    });
  });

  onDestroy(() => {
    unsubscribe && unsubscribe();
    refreshIntervalId && clearInterval(refreshIntervalId);
  });
</script>

<style>
  .scroll {
    overflow: auto;
  }

  .spacer {
    border-right: 0.1em solid #e6e6e6;
  }

  .add-button {
    position: fixed;
    bottom: 1em;
    right: 1em;
    width: 3em;
    height: 3em;
    z-index: 1038;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
  }

  :global(.svelte-tabs) {
    flex: 1 1 1em;
    display: flex;
    flex-direction: column;
  }

  :global(.svelte-tabs__tab-list) {
    display: table;
    table-layout: fixed;
    width: 100%;
  }

  :global(.svelte-tabs li.svelte-tabs__tab) {
    display: table-cell;
    text-align: center;
  }

  input[type='radio'] {
    display: none;
    margin: 10px;
  }

  input[type='radio'] + label {
    display: inline-block;
    flex: 1 1;
    margin: -2px;
    padding: 4px 12px;
    text-align: center;
  }

  .overflow-x-hidden {
    overflow-x: hidden;
  }

  .new-card-form {
    z-index: 1039;
  }

  .tab-buttons {
    z-index: 1040;
  }

  .min-vh-90 {
    min-height: 90vh;
  }

  @media (max-width: 768px) {
    .add-button {
      bottom: 6em;
    }
  }
</style>

<div class="d-flex h-100 flex-column fixed-top fixed-bottom bg-light">

  <Header {nav} />
  <div class="d-none d-lg-block scroll h-100">
    <div
      class="d-none d-lg-flex justify-content-center py-3 overflow-hidden
      min-vh-90">
      {#each $ranks as rank, i (rank.id)}
        <Rank
          bind:rank
          bind:drake
          on:error={handleError}
          send={cardSend}
          receive={cardReceive} />
        {#if i !== $ranks.length - 1}
          <div class="spacer my-5 flex-grow-0 flex-shrink-0" />
        {/if}
      {:else}
        <p class="text-center text-secondary">There are no columns!</p>
      {/each}
    </div>
  </div>

  <div class="d-block flex-grow-1 d-lg-none scroll">
    {#each $ranks as rank (rank.id)}
      {#if rank.id == selectedRank}
        <Rank bind:rank on:error={handleError} />
      {/if}
    {:else}
      <p class="text-center text-secondary mt-5">{$_('board.no_columns')}</p>
    {/each}
  </div>

  <div class="d-lg-none tab-buttons">
    {#if errorAlertVisible}
      <div
        in:fly={{ x: -200, duration: 200 }}
        out:fly={{ x: -200, duration: 200 }}>
        <Alert class="mb-0 py-1" color="warning" isOpen={true}>
          {$_(errorAlertMessage)}
        </Alert>
      </div>
    {/if}
    {#if connectionLost}
      <div
        in:fly={{ x: -200, duration: 200 }}
        out:fly={{ x: -200, duration: 200 }}>
        <Alert class="mb-0 py-1" color="danger" isOpen={true}>
          {$_('error.connection_lost')}
        </Alert>
      </div>
    {/if}
    <div class="d-flex border-top w-100">
      {#each $ranks as rank (rank.id)}
        <div class="flex-grow-1 {tabButtonWidth} px-0">
          <input
            readonly={undefined}
            type="radio"
            id={rank.id}
            bind:group={selectedRank}
            value={rank.id} />
          <label
            for={rank.id}
            class="px-0 border-top text-uppercase {selectedRank == rank.id ? getRankDetails(rank).classes.selected : getRankDetails(rank).classes.deselected + ' border-light'}
            col">
            <div class="icon d-inline-block">
              <svelte:component this={getRankDetails(rank).icon} />
            </div>
            <br />
            {$_(rank.name)}
          </label>
        </div>
      {/each}
    </div>
  </div>

  <div class="fixed-bottom d-none d-lg-block">
    {#if errorAlertVisible}
      <div
        in:fly={{ y: 100, duration: 200 }}
        out:fly={{ y: 100, duration: 200 }}>
        <Alert class="mb-0 py-1" color="warning" isOpen={true}>
          {$_(errorAlertMessage)}
        </Alert>
      </div>
    {/if}
    {#if connectionLost}
      <div
        in:fly={{ y: 100, duration: 200 }}
        out:fly={{ y: 100, duration: 200 }}>
        <Alert class="mb-0 py-1" color="danger" isOpen={true}>
          {$_('error.connection_lost')}
        </Alert>
      </div>
    {/if}
  </div>
</div>
