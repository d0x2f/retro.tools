<script>
  import { onDestroy, onMount } from 'svelte';
  import Icon from 'fa-svelte';
  import { faFrown, faMeh, faSmile } from '@fortawesome/free-regular-svg-icons';
  import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';

  import { PlusIcon } from 'svelte-feather-icons';

  import { board, ranks, cards } from './store.js';
  import { updateBoard, createCard, getCards } from './api.js';

  import FloatingActionButton from './components/FloatingActionButton.svelte';
  import Rank from './components/Rank.svelte';
  import Header from './components/Header.svelte';
  import Modal from './components/Modal.svelte';
  import CardForm from './components/CardForm.svelte';

  let unsubscribe;

  async function updateCards() {
    cards.set(await getCards($board.id));
  }

  onMount(async () => {
    unsubscribe = board.subscribe(b => updateBoard(b));
    await updateCards();
    setInterval(async () => await updateCards(), 10000);
  });
  onDestroy(unsubscribe);

  let showNewCardModal = false;
  let newCardRank = $ranks[0].id;
  let newCardComment = '';

  const rankDetails = {
    mad: {
      color: 'negative',
      icon: faFrown,
    },
    sad: {
      color: 'primary',
      icon: faMeh,
    },
    glad: {
      color: 'secondary',
      icon: faSmile,
    },
  };

  async function newCard() {
    showNewCardModal = false;
    const tempId = Math.floor(Math.random() * 10000);
    cards.append({
      id: tempId,
      name: 'Card',
      description: newCardComment,
      rank_id: newCardRank,
      uncommitted: true,
      votes: 0,
    });
    cards.replace(
      tempId,
      await createCard($board.id, newCardRank, newCardComment)
    );
  }
</script>

<style lang="scss">
  @import '../theme/colors.scss';

  .container {
    box-sizing: content-box;
    width: 100%;
    height: 100%;
    background-color: lighten($background, 20%);
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .page {
    flex: 1 1 1em;
    display: flex;
    flex-direction: column;
    box-sizing: content-box;
    overflow-y: auto;
  }

  .header {
    flex: 0 0 0;
    z-index: 1;
  }

  .rank-columns {
    display: flex;
    flex-wrap: nowrap;
    flex: 1 1 1em;
    justify-content: center;
    margin-top: 1em;
  }

  .spacer {
    flex: 0 0 0.05em;
    margin: 2.6em 1em;
    background-color: darken($background, 10%);
  }

  .no-ranks {
    text-align: center;
    flex: 1 1 1;
    width: 100%;
  }

  .add-button {
    position: absolute;
    bottom: 1em;
    right: 1em;
    width: 3em;
    height: 3em;
  }

  .hidden {
    display: none;
  }

  .rank-tabs {
    flex: 0 0 0;
    display: none;
  }

  @media screen and (max-width: 1024px) {
    .page {
      overflow: scroll;
    }

    .add-button {
      bottom: 5em;
    }

    .rank-columns {
      display: none;
    }

    .spacer {
      display: none;
    }

    .rank-tabs {
      display: flex;
      flex: 1 1 1em;
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

    .ranks {
      flex: 1 1 1em;
      overflow: scroll;
    }

    .tab-buttons {
      flex: 0 0 1em;
    }

    .tab-negative {
      color: $negative;
      .rankbar {
        background-color: $negative;
      }
    }

    .tab-secondary {
      color: $secondary;
      .rankbar {
        background-color: $secondary;
      }
    }

    .tab-primary {
      color: $primary;
      .rankbar {
        background-color: $primary;
      }
    }

    .rankbar {
      height: 0.2em;
      background: black;
      margin-bottom: 0.4em;
      border-radius: 0.2em;
    }
  }
</style>

<div class="container">

  <div class="page">
    <div class="header">
      <Header />
    </div>

    <div class="rank-columns">
      {#each $ranks as rank, i}
        <Rank
          bind:rank
          color={rankDetails[rank.name.toLowerCase()].color}
          icon={rankDetails[rank.name.toLowerCase()].icon} />
        {#if i !== 2}
          <div class="spacer" />
        {/if}
      {:else}
        <div class="no-ranks">
          <p>
            You have no columns!
            <br />
            Add some with the button on the right.
          </p>
        </div>
      {/each}
    </div>

    <div class="rank-tabs">
      <Tabs>
        <div class="ranks">
          {#each $ranks as rank, i}
            <TabPanel>
              <Rank
                bind:rank
                color={rankDetails[rank.name.toLowerCase()].color}
                icon={rankDetails[rank.name.toLowerCase()].icon} />
            </TabPanel>
          {:else}
            <div class="no-ranks">
              <p>
                You have no columns!
                <br />
                Add some with the button on the right.
              </p>
            </div>
          {/each}
        </div>
        <div class="tab-buttons">
          <TabList>
            <Tab>
              <div class="tab-negative">
                <div class="rankbar" />
                <div class="icon">
                  <Icon icon={faFrown} />
                </div>
                MAD
              </div>
            </Tab>
            <Tab>
              <div class="tab-primary">
                <div class="rankbar" />
                <div class="icon">
                  <Icon icon={faMeh} />
                </div>
                SAD
              </div>
            </Tab>
            <Tab>
              <div class="tab-secondary">
                <div class="rankbar" />
                <div class="icon">
                  <Icon icon={faSmile} />
                </div>
                GLAD
              </div>
            </Tab>
          </TabList>
        </div>
      </Tabs>
    </div>
  </div>

  <div class="add-button {$board.cards_open ? '' : 'hidden'}">
    <FloatingActionButton
      color="primary"
      icon={PlusIcon}
      on:click={() => {
        newCardComment = '';
        showNewCardModal = true;
      }} />
  </div>
</div>

{#if showNewCardModal}
  <Modal on:close={() => (showNewCardModal = false)} on:accept={newCard}>
    <CardForm
      title="New Card"
      bind:type={newCardRank}
      bind:comment={newCardComment} />
  </Modal>
{/if}
