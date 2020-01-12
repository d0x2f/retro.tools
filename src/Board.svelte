<script>
  import { onDestroy, onMount } from 'svelte';
  import Icon from 'fa-svelte';
  import { faFrown, faMeh, faSmile } from '@fortawesome/free-regular-svg-icons';
  import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';
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

  let selectedTab = 0;
  let showNewCardModal = false;
  let newCardRank = $ranks[0].id;
  let newCardComment = '';

  setTimeout(() => (selectedTab = 2), 3000);

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

  function toggleNewCardModal() {
    showNewCardModal = !showNewCardModal;
  }

  async function newCard() {
    toggleNewCardModal();
    selectedTab = $ranks.findIndex(rank => rank.id === newCardRank);
    const tempId = Math.floor(Math.random() * 10000);
    cards.append({
      id: tempId,
      name: 'Card',
      description: newCardComment,
      rank_id: newCardRank,
      uncommitted: true,
      votes: 0,
      created_at: {
        secs_since_epoch: Date.now() / 1000,
      },
    });
    cards.replace(
      tempId,
      await createCard($board.id, newCardRank, newCardComment)
    );
    newCardComment = '';
  }
</script>

<style lang="scss">
  @import '../theme/colors.scss';

  .box {
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
      overflow: auto;
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
      overflow: auto;
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

<div class="box">

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
      <Tabs bind:selectedTabIndex={selectedTab}>
        <div class="ranks">
          {#each $ranks as rank}
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
      on:click={toggleNewCardModal} />
  </div>
</div>

<Modal isOpen={showNewCardModal} toggle={toggleNewCardModal}>
  <ModalHeader toggle={toggleNewCardModal}>New Card</ModalHeader>
  <ModalBody>
    <CardForm bind:rank_id={newCardRank} bind:comment={newCardComment} />
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={toggleNewCardModal}>Cancel</Button>
    <Button color="primary" on:click={newCard}>Create</Button>
  </ModalFooter>
</Modal>
