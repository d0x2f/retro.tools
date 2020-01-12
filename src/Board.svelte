<script>
  import { onDestroy, onMount } from 'svelte';
  import Icon from 'fa-svelte';
  import { faFrown, faMeh, faSmile } from '@fortawesome/free-regular-svg-icons';
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from 'sveltestrap';

  import { PlusIcon } from 'svelte-feather-icons';

  import { board, ranks, cards } from './store.js';
  import { updateBoard, createCard, getCards, getBoard } from './api.js';

  import FloatingActionButton from './components/FloatingActionButton.svelte';
  import Rank from './components/Rank.svelte';
  import Header from './components/Header.svelte';
  import CardForm from './components/CardForm.svelte';

  let unsubscribe;

  async function update() {
    const [b, c] = await Promise.all([
      getBoard($board.id),
      getCards($board.id),
    ]);
    board.set(b);
    cards.set(c);
  }

  onMount(async () => {
    await update();
    if ($board.owner) unsubscribe = board.subscribe(b => updateBoard(b));
    setInterval(async () => await update(), 10000);
  });
  onDestroy(() => $board.owner && unsubscribe());

  let selectedRank = $ranks[0].id;
  let showNewCardModal = false;
  let newCardComment = '';

  const rankDetails = {
    mad: {
      icon: faFrown,
      selected: 'text-danger border-top border-danger',
      deselected: 'text-danger border-top border-light',
      color: 'text-danger',
    },
    sad: {
      icon: faMeh,
      selected: 'text-primary border-top border-primary',
      deselected: 'text-primary border-top border-light',
      color: 'text-primary',
    },
    glad: {
      icon: faSmile,
      selected: 'text-success border-top border-success',
      deselected: 'text-success border-top border-light',
      color: 'text-success',
    },
  };

  function toggleNewCardModal() {
    showNewCardModal = !showNewCardModal;
  }

  async function newCard() {
    toggleNewCardModal();
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
</script>

<style>
  .scroll {
    overflow: auto;
    height: 100%;
  }

  .spacer {
    border-right: 0.1em solid #e6e6e6;
  }

  .add-button {
    position: absolute;
    bottom: 1em;
    right: 1em;
    width: 3em;
    height: 3em;
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

  @media (min-width: 850px) {
    .mobile {
      display: none !important;
    }

    .desktop {
      display: block;
    }
  }

  @media (max-width: 850px) {
    .mobile {
      display: block;
    }

    .desktop {
      display: none !important;
    }

    .add-button {
      bottom: 4em;
    }
  }
</style>

<Header />

<div class="d-flex justify-content-center pt-3 desktop scroll">
  {#each $ranks as rank, i}
    <Rank
      bind:rank
      color={rankDetails[rank.name.toLowerCase()].color}
      icon={rankDetails[rank.name.toLowerCase()].icon} />
    {#if i !== 2}
      <div class="spacer my-5 mx-3" />
    {/if}
  {:else}
    <p>
      You have no columns!
      <br />
      Add some with the button on the right.
    </p>
  {/each}
</div>

<div class="mobile scroll">
  {#each $ranks as rank}
    {#if rank.id == selectedRank}
      <Rank
        bind:rank
        color={rankDetails[rank.name.toLowerCase()].color}
        icon={rankDetails[rank.name.toLowerCase()].icon} />
    {/if}
  {:else}
    <p>
      You have no columns!
      <br />
      Add some with the button on the right.
    </p>
  {/each}
</div>

<div class="mobile d-flex justify-content-around border-top">
  {#each $ranks as rank}
    <div class="flex-grow-1">
      <input
        type="radio"
        id={rank.id}
        bind:group={selectedRank}
        value={rank.id} />
      <label
        for={rank.id}
        class="{selectedRank == rank.id ? rankDetails[rank.name.toLowerCase()].selected : rankDetails[rank.name.toLowerCase()].deselected}
        col">
        <div class="icon">
          <Icon icon={rankDetails[rank.name.toLowerCase()].icon} />
        </div>
        {rank.name}
      </label>
    </div>
  {/each}
</div>

<div class="add-button {$board.cards_open ? '' : 'invisible'}">
  <FloatingActionButton
    color="primary"
    icon={PlusIcon}
    on:click={toggleNewCardModal} />
</div>

<Modal isOpen={showNewCardModal} toggle={toggleNewCardModal}>
  <ModalHeader toggle={toggleNewCardModal}>New Card</ModalHeader>
  <ModalBody>
    <CardForm bind:rankId={selectedRank} bind:comment={newCardComment} />
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={toggleNewCardModal}>Cancel</Button>
    <Button color="primary" on:click={newCard}>Create</Button>
  </ModalFooter>
</Modal>
