<script>
  import { onMount, onDestroy } from 'svelte';
  import {
    Alert,
    Button,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from 'sveltestrap';
  import { quintOut } from 'svelte/easing';
  import { crossfade, fade, fly } from 'svelte/transition';
  import _ from 'lodash';
  import dragula from 'dragula';

  import { board, ranks, cards } from './store.js';
  import {
    updateBoard,
    updateCard,
    createCard,
    getCards,
    getBoard,
  } from './api.js';
  import { Icons, getRankDetails } from './data.js';

  import FloatingActionButton from './components/FloatingActionButton.svelte';
  import Rank from './components/Rank.svelte';
  import Header from './components/Header.svelte';
  import CardForm from './components/CardForm.svelte';

  export let nav;

  let selectedRank = '';
  let showNewCardModal = false;
  let showNewCardForm = false;
  let newCardComment = '';
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
      error('Card update failed!', err);
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

  function toggleNewCardForm() {
    showNewCardForm = !showNewCardForm;
  }

  function toggleNewCardModal() {
    showNewCardModal = !showNewCardModal;
  }

  async function newCard() {
    const tempId = Math.floor(Math.random() * 10000);
    cards.append({
      id: tempId,
      name: 'Card',
      description: newCardComment,
      rank_id: selectedRank,
      uncommitted: true,
      votes: 0,
      created_at: {
        secs_since_epoch: Date.now() / 1000,
      },
    });
    try {
      cards.replace(
        tempId,
        await createCard($board.id, selectedRank, newCardComment)
      );
      newCardComment = '';
    } catch (err) {
      error('Error creating card!', err);
      cards.remove(tempId);
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
          if (!_.isEqual(previousBoard, b)) updateBoard(b);
        } catch (err) {
          error('Error updating settings!', err);
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

  @media (max-width: 768px) {
    .add-button {
      bottom: 6em;
    }
  }
</style>

<svelte:window on:orientationchange={() => (showNewCardModal = false)} />

<div class="d-flex h-100 flex-column fixed-top fixed-bottom bg-light">

  <Header {nav} />
  <div class="d-none d-md-block scroll h-100">
    <div
      class="d-none d-md-flex justify-content-center py-3 overflow-hidden
      min-vh-100">
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

  <div class="d-block flex-grow-1 d-md-none scroll">

    {#if showNewCardForm}
      <div
        transition:fade
        class="flex-grow-1 p-2 d-block d-md-none h-100 w-100 position-absolute
        new-card-form bg-light">
        <Label for="cardText" class="text-primary">New Card</Label>
        <Input
          readonly={undefined}
          id="cardText"
          type="textarea"
          placeholder="We need more snacks..."
          bind:value={newCardComment}
          class="mb-2" />
        <div class="d-flex justify-content-end">
          <Button class="mx-1" color="secondary" on:click={toggleNewCardForm}>
            Cancel
          </Button>
          <Button
            class="mx-1"
            color="primary"
            disabled={newCardComment.length === 0}
            on:click={() => {
              toggleNewCardForm();
              newCard();
            }}>
            Create
          </Button>
        </div>
      </div>
    {/if}
    {#each $ranks as rank (rank.id)}
      {#if rank.id == selectedRank}
        <Rank bind:rank on:error={handleError} />
      {/if}
    {:else}
      <p class="text-center text-secondary mt-5">There are no columns!</p>
    {/each}
  </div>

  <div class="d-md-none tab-buttons">
    {#if errorAlertVisible}
      <div
        in:fly={{ x: -200, duration: 200 }}
        out:fly={{ x: -200, duration: 200 }}>
        <Alert class="mb-0 py-1" color="warning" isOpen={true}>
          {errorAlertMessage}
        </Alert>
      </div>
    {/if}
    {#if connectionLost}
      <div
        in:fly={{ x: -200, duration: 200 }}
        out:fly={{ x: -200, duration: 200 }}>
        <Alert class="mb-0 py-1" color="danger" isOpen={true}>
          Connection Lost!
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
            {rank.name}
          </label>
        </div>
      {/each}
    </div>
  </div>

  <div class="fixed-bottom d-none d-md-block">
    {#if errorAlertVisible}
      <div
        in:fly={{ y: 100, duration: 200 }}
        out:fly={{ y: 100, duration: 200 }}>
        <Alert class="mb-0 py-1" color="warning" isOpen={true}>
          {errorAlertMessage}
        </Alert>
      </div>
    {/if}
    {#if connectionLost}
      <div
        in:fly={{ y: 100, duration: 200 }}
        out:fly={{ y: 100, duration: 200 }}>
        <Alert class="mb-0 py-1" color="danger" isOpen={true}>
          Connection Lost!
        </Alert>
      </div>
    {/if}
  </div>

  {#if $board.cards_open}
    <div class="d-sm-block d-md-none add-button">
      <FloatingActionButton
        className="shadow btn-primary"
        icon={Icons.plus}
        on:click={toggleNewCardForm} />
    </div>

    <div class="d-none d-md-block add-button">
      <FloatingActionButton
        className="shadow btn-primary"
        icon={Icons.plus}
        on:click={toggleNewCardModal} />
    </div>
  {/if}
</div>

<Modal
  class="d-none d-md-block"
  duration="100"
  isOpen={showNewCardModal}
  toggle={toggleNewCardModal}>
  <ModalHeader toggle={toggleNewCardModal}>New Card</ModalHeader>
  <ModalBody>
    <CardForm bind:rankId={selectedRank} bind:comment={newCardComment} />
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={toggleNewCardModal}>Cancel</Button>
    <Button
      color="primary"
      disabled={newCardComment.length === 0}
      on:click={() => {
        toggleNewCardModal();
        newCard();
      }}>
      Create
    </Button>
  </ModalFooter>
</Modal>
