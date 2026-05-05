<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import dragula from 'dragula';
  import { _ } from 'svelte-i18n';
  import { navigate } from 'svelte-routing';

  import {
    board,
    ranks,
    cards,
    focusedRank,
    password,
    colorMode,
    colors,
  } from './store.js';
  import { updateBoard, updateCard, getBoard, getRanks } from './api.js';
  import { Icons } from './data.js';
  import { checkBoardPassword, isBoardEncrypted } from './encryption.js';
  import {
    subscribeToBoard,
    subscribeToCards,
    subscribeToRanks,
  } from './firestore.js';

  import PasswordWall from './components/PasswordWall.svelte';
  import Rank from './components/Rank.svelte';
  import Header from './components/Header.svelte';
  import Spinner from './components/Spinner.svelte';
  import Alert from './components/Alert.svelte';
  import IceBreaker from './components/IceBreaker.svelte';

  let { boardId } = $props();

  let unsubscribeLocalBoard,
    unsubscribeBoard,
    unsubscribeRanks,
    unsubscribeCards;

  let errorAlertVisible = $state(false);
  let errorAlertMessage = $state('Network error!');
  let errorClearTimeout;
  let connectionLost = $state(false);
  let passwordRequired = $state(false);
  let busy = $state(true);
  // bind:rank requires sortedRanks to be mutable $state (Rank writes rank.busy during deletion)
  // eslint-disable-next-line svelte/prefer-writable-derived
  let sortedRanks = $state([]);

  $effect(() => {
    sortedRanks = [...$ranks].sort((a, b) => a.position - b.position);
  });

  let drake = dragula({
    revertOnSpill: true,
    copySortSource: false,
    copy: true,
    moves: (el) => el.dataset.drag !== 'false',
    accepts: (el, target) => {
      const card = $cards.find((c) => c.id === el.dataset.cardId);
      return card != null && target.dataset.rankId !== card.column;
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
    const card = $cards.find((c) => c.id === cardId);
    if (!card) return;
    const originalRankId = card.column;

    el.parentNode.removeChild(el);
    card.column = rankId;
    card.busy = true;
    $cards = $cards; // Trigger a redraw so the card picks up that it's busy
    try {
      cards.replace(card.id, await updateCard($board, card));
    } catch (err) {
      error('error.updating_card', err);
      card.column = originalRankId; // Send the card back
      card.busy = false;
      $cards = $cards; // Force redraw
    }
  });

  function error(message, err) {
    if (err) console.error(err);
    errorAlertVisible = true;
    errorAlertMessage = message;

    if (errorClearTimeout) clearTimeout(errorClearTimeout);
    errorClearTimeout = setTimeout(() => (errorAlertVisible = false), 3000);
  }

  function handleError({ message, err }) {
    error(message, err);
  }

  async function checkPassword() {
    if (await isBoardEncrypted($board)) {
      passwordRequired = !(await checkBoardPassword($board, $password));
    } else {
      passwordRequired = false;
      password.set('');
    }
    return passwordRequired;
  }

  function compareBoards(a, b) {
    return (
      a.name === b.name &&
      a.voting_open === b.voting_open &&
      a.cards_open === b.cards_open &&
      a.ice_breaking === b.ice_breaking &&
      a.open_permission === b.open_permission &&
      JSON.stringify(a.data) === JSON.stringify(b.data)
    );
  }

  onMount(async () => {
    let b;
    try {
      b = await getBoard(boardId);
    } catch {
      navigate('/not-found');
      return;
    }

    if (b.error == 'Not Found') {
      navigate('/not-found');
      return;
    }

    board.set(b);

    // Compare updated boards to their last known value to ensure we don't send
    // superfluous calls. Declared before subscribeToBoard so the firestore
    // callback closes over the same reference as the local board.subscribe.
    let previousBoard = { ...$board };

    // Kick off REST + firestore subscription setup in parallel. Each
    // subscribeToX call internally awaits signIn(), which is now memoised so
    // concurrent callers share a single auth round-trip.
    const ranksTask = getRanks(boardId);
    const subscribeBoardTask =
      !$board.owner || $board.open_permission
        ? subscribeToBoard(
            boardId,
            (b) => {
              previousBoard = { ...b };
              board.set(b);
            },
            () => {
              navigate('/not-found');
            },
            () => {
              connectionLost = true;
            }
          )
        : Promise.resolve(null);
    const subscribeCardsTask = subscribeToCards(
      boardId,
      (card) => cards.replace(card.id, card),
      (card) => cards.replace(card.id, card),
      (cardId) => cards.remove(cardId),
      () => {
        connectionLost = true;
      }
    );
    const subscribeRanksTask = subscribeToRanks(
      boardId,
      (rank) => ranks.replace(rank.id, rank),
      (rank) => ranks.replace(rank.id, rank),
      (rankId) => {
        ranks.remove(rankId);
        if ($focusedRank == rankId) {
          $focusedRank = $ranks[0]?.id;
        }
      },
      () => {
        connectionLost = true;
      }
    );

    ranks.set(await ranksTask);
    await checkPassword();

    // Show first rank initially (by position, not API order)
    const firstRank = [...$ranks].sort((a, b) => a.position - b.position)[0];
    if (firstRank) $focusedRank = firstRank.id;

    // Subscribe to local changes to $board so we can post updates.
    if ($board.owner || $board.open_permission) {
      unsubscribeLocalBoard = board.subscribe((b) => {
        if (!compareBoards(previousBoard, b)) {
          updateBoard(b).catch((err) => error('error.updating_settings', err));
        }
        previousBoard = { ...b };
      });
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Don't gate the initial paint on subscription registration; cards/ranks
    // will populate via the in-flight subscriptions as their snapshots arrive.
    busy = false;

    [unsubscribeBoard, unsubscribeCards, unsubscribeRanks] = await Promise.all([
      subscribeBoardTask,
      subscribeCardsTask,
      subscribeRanksTask,
    ]);
  });

  function handleOffline() {
    connectionLost = true;
  }

  function handleOnline() {
    connectionLost = false;
  }

  onDestroy(() => {
    unsubscribeLocalBoard && unsubscribeLocalBoard();
    unsubscribeBoard && unsubscribeBoard();
    unsubscribeRanks && unsubscribeRanks();
    unsubscribeCards && unsubscribeCards();
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
  });
</script>

<svelte:head>
  <meta property="og:url" content="https://retro.tools/{boardId}" />
</svelte:head>

<div class="d-flex h-100 flex-column fixed-top fixed-bottom">
  <Header />

  {#if busy}
    <div
      transition:fade={{ duration: 200 }}
      class="position-absolute w-100 h-100"
    >
      <div class="d-flex justify-content-center h-100">
        <div class="d-flex flex-column justify-content-center">
          <Spinner color="primary" />
        </div>
      </div>
    </div>
  {:else if passwordRequired}
    <div
      transition:fade={{ duration: 200 }}
      class="w-100 h-100 position-absolute"
    >
      <PasswordWall onaccepted={checkPassword} />
    </div>
  {:else}
    <div class="d-none d-lg-block scroll h-100">
      <IceBreaker class="w-50" />
      <div
        class="d-none d-lg-flex justify-content-center overflow-hidden
        min-vh-90"
      >
        {#each sortedRanks as rank, i (rank.id)}
          <Rank bind:rank={sortedRanks[i]} {drake} onerror={handleError} />
          {#if i !== sortedRanks.length - 1}
            <div
              class="spacer-{$colorMode} my-5 flex-grow-0 flex-shrink-0"
            ></div>
          {/if}
        {:else}
          <p class="text-center text-secondary mt-5">
            {$_('board.no_columns')}
          </p>
        {/each}
      </div>
    </div>

    <div class="d-block flex-grow-1 d-lg-none scroll">
      <IceBreaker class="w-100" />
      {#each sortedRanks as rank, i (rank.id)}
        {#if rank.id == $focusedRank}
          <Rank bind:rank={sortedRanks[i]} onerror={handleError} />
        {/if}
      {:else}
        <p class="text-center text-secondary mt-5">{$_('board.no_columns')}</p>
      {/each}
    </div>

    <div transition:fade={{ duration: 200 }} class="d-lg-none tab-buttons">
      {#if errorAlertVisible}
        <div
          in:fly={{ x: -200, duration: 200 }}
          out:fly={{ x: -200, duration: 200 }}
        >
          <Alert
            data-name="warning-alert"
            class="mb-0 py-1"
            color="warning"
            isOpen={true}
          >
            {$_(errorAlertMessage)}
          </Alert>
        </div>
      {/if}
      {#if connectionLost}
        <div
          in:fly={{ x: -200, duration: 200 }}
          out:fly={{ x: -200, duration: 200 }}
        >
          <Alert
            data-name="error-alert"
            class="mb-0 py-1"
            color="danger"
            isOpen={true}
          >
            {$_('error.connection_lost')}
          </Alert>
        </div>
      {/if}
      <div class="d-flex w-100 justify-content-around" data-name="rank-tabs">
        {#each sortedRanks as rank (rank.id)}
          {@const color = $colors[rank.data.color]}
          <input
            type="radio"
            id={rank.id}
            bind:group={$focusedRank}
            value={rank.id}
          />
          {@const SvelteComponent = Icons[rank.data.icon]}
          <label
            for={rank.id}
            class="px-0 m-0 border-top text-uppercase"
            class:border-2={$focusedRank == rank.id}
            style="
            border-color: {color}
            !important; color: {color}
            "
          >
            <div class="icon d-inline-block">
              <SvelteComponent />
            </div>
            <br />
            {$_(rank.name)}
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <div class="fixed-bottom d-none d-lg-block">
    {#if errorAlertVisible}
      <div
        in:fly={{ y: 100, duration: 200 }}
        out:fly={{ y: 100, duration: 200 }}
      >
        <Alert
          data-name="warning-alert"
          class="mb-0 py-1"
          color="warning"
          isOpen={true}
        >
          {$_(errorAlertMessage)}
        </Alert>
      </div>
    {/if}
    {#if connectionLost}
      <div
        in:fly={{ y: 100, duration: 200 }}
        out:fly={{ y: 100, duration: 200 }}
      >
        <Alert
          data-name="error-alert"
          class="mb-0 py-1"
          color="danger"
          isOpen={true}
        >
          {$_('error.connection_lost')}
        </Alert>
      </div>
    {/if}
  </div>
</div>

<style>
  .scroll {
    overflow: auto;
  }

  .spacer-light {
    border-right: 0.1em solid #e6e6e6;
  }

  .spacer-dark {
    border-right: 0.1em solid #495057;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
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

  .tab-buttons {
    z-index: 1040;
  }

  .min-vh-90 {
    min-height: 90vh;
  }
</style>
