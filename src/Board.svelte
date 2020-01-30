<script>
  import { onDestroy, onMount } from 'svelte';
  import {
    Input,
    Label,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from 'sveltestrap';
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import _ from 'lodash';

  import { board, ranks, cards } from './store.js';
  import { updateBoard, createCard, getCards, getBoard } from './api.js';
  import { Icons, getRankDetails } from './data.js';

  import FloatingActionButton from './components/FloatingActionButton.svelte';
  import Rank from './components/Rank.svelte';
  import Header from './components/Header.svelte';
  import CardForm from './components/CardForm.svelte';

  let unsubscribe;
  let selectedRank = '';
  let showNewCardModal = false;
  let showNewCardForm = false;
  let newCardComment = '';
  let tabButtonWidth = '';

  $: (() => {
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
  })();

  let hidden = false;

  async function update() {
    if (!hidden) {
      const [b, c] = await Promise.all([
        getBoard($board.id),
        getCards($board.id),
      ]);
      board.set(b);
      cards.set(c);
    }
  }

  onMount(async () => {
    await update();
    selectedRank = $ranks[0].id;
    let previousBoard = { ...$board };
    if ($board.owner)
      unsubscribe = board.subscribe(b => {
        if (!_.isEqual(previousBoard, b)) updateBoard(b);
        previousBoard = { ...b };
      });
    setInterval(async () => await update(), 10000);
    document.addEventListener('visibilitychange', () => {
      hidden = document['hidden'];
      update();
    });
  });
  onDestroy(() => unsubscribe && unsubscribe());

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
    cards.replace(
      tempId,
      await createCard($board.id, selectedRank, newCardComment)
    );
    newCardComment = '';
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
    z-index: 1040;
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

  @media (max-width: 768px) {
    .add-button {
      bottom: 4em;
    }
  }
</style>

<div class="d-flex h-100 flex-column fixed-top fixed-bottom">

  <Header />

  {#if showNewCardForm}
    <div class="flex-grow-1 p-2 d-block d-md-none">
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
          on:click={() => {
            toggleNewCardForm();
            newCard();
          }}>
          Create
        </Button>
      </div>
    </div>
  {:else}
    <div
      class="d-none d-md-flex justify-content-center pt-3 scroll h-100
      overflow-x-hidden">
      {#each $ranks as rank, i}
        <Rank bind:rank send={cardSend} receive={cardReceive} />
        {#if i !== $ranks.length - 1}
          <div class="spacer my-5 flex-grow-0 flex-shrink-0" />
        {/if}
      {:else}
        <p class="text-center text-secondary">There are no columns!</p>
      {/each}
    </div>

    <div class="d-block flex-grow-1 d-md-none scroll">
      {#each $ranks as rank}
        {#if rank.id == selectedRank}
          <Rank bind:rank />
        {/if}
      {:else}
        <p class="text-center text-secondary mt-5">There are no columns!</p>
      {/each}
    </div>
  {/if}

  <div class="d-flex d-md-none border-top w-100">
    {#each $ranks as rank}
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

  {#if $board.cards_open}
    {#if !showNewCardForm}
      <div class="d-sm-block d-md-none add-button">
        <FloatingActionButton icon={Icons.plus} on:click={toggleNewCardForm} />
      </div>
    {/if}

    <div class="d-none d-md-block add-button">
      <FloatingActionButton icon={Icons.plus} on:click={toggleNewCardModal} />
    </div>
  {/if}
</div>

<Modal
  class="d-none d-md-block"
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
      on:click={() => {
        toggleNewCardModal();
        newCard();
      }}>
      Create
    </Button>
  </ModalFooter>
</Modal>
