<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { flip } from "svelte/animate";
  import { _ } from "svelte-i18n";

  import {
    author,
    board,
    cards,
    colorMode,
    focusedRank,
    password,
    ranks,
    sorted,
  } from "../store.js";
  import { getRankDetails, Icons } from "../data.js";
  import { createCard } from "../api.js";
  import { encrypt } from "../encryption.js";

  import Card from "./Card.svelte";
  import Textarea from "./Textarea.svelte";
  import Button from "./Button.svelte";

  export let rank;
  export let drake = null;

  let dropTarget;
  let rankDetails = getRankDetails(rank);
  let sortedFilteredCards;
  let columnWidth = "col-lg-3";
  let newCardText = "";

  const dispatch = createEventDispatcher();

  $: {
    sortedFilteredCards = $cards
      .filter((c) => c.column === rank.id)
      .sort((a, b) =>
        $sorted
          ? b.votes - a.votes || a.created_at - b.created_at
          : a.created_at - b.created_at
      );
  }

  $: {
    switch ($ranks.length) {
      case 1:
      case 2:
        columnWidth = "col-lg-4";
        break;
      case 3:
        columnWidth = "col-lg-3";
        break;
      case 4:
      default:
        columnWidth = "col-lg-3";
        break;
    }
  }

  function error(message, err) {
    dispatch("error", { message, err });
  }

  async function newCard() {
    if (newCardText.length === 0) {
      return;
    }
    if (!$board.cards_open) {
      if ($board.owner) {
        error("board.creation_disabled_as_owner");
      } else {
        error("board.creation_disabled_as_participant");
      }
      return;
    }

    const encryptedCardText = await encrypt(newCardText, $password);
    const encryptedAuthor =
      $author.length > 0 ? await encrypt($author, $password) : "";
    try {
      newCardText = "";
      await createCard($board.id, rank.id, encryptedCardText, encryptedAuthor);
    } catch (err) {
      error("error.creating_card", err);
    }
  }

  onMount(() => {
    if (drake) {
      drake.containers.push(dropTarget);
    }
  });
</script>

<div data-name="rank" class="rank flex-grow-0 flex-shrink-0 px-3 {columnWidth}">
  <div class="border-bottom d-flex py-2 mb-2 {rankDetails.classes.color}">
    <!-- icon -->
    <div class="d-flex flex-column justify-content-center flex-shrink-0">
      <div class="icon px-2">
        <svelte:component this={rankDetails.icon} />
      </div>
    </div>
    <!-- card text area -->
    <div class="d-flex input-group flex-nowrap">
      <Textarea
        autoresize
        data-name="card-text-input"
        on:submit={newCard}
        placeholder={$_(rank.name)}
        bind:value={newCardText}
        on:focus={() => ($focusedRank = rank.id)}
        minWidth="5em"
        class="flex-grow-1"
      />
      {#if $focusedRank === rank.id}
        <Textarea
          data-name="card-author-input"
          on:submit={newCard}
          placeholder={$_("board.author")}
          bind:value={$author}
          minWidth="5em"
          class="flex-shrink-0 flex-grow-0 w-25"
        />
      {/if}
    </div>
    <div class="d-lg-none ms-1">
      <Button
        color={$colorMode}
        disabled={newCardText.length == 0}
        on:click={newCard}
      >
        <div class="icon">
          <Icons.enter size="100%" />
        </div>
      </Button>
    </div>
  </div>
  <div class="h-100" bind:this={dropTarget} data-rank-id={rank.id}>
    {#if $cards}
      {#each sortedFilteredCards as card (card.id)}
        <div
          data-card-id={card.id}
          animate:flip={{ duration: 200 }}
          class="py-1"
          data-drag={!(card.owner || $board.owner) ? "false" : "true"}
        >
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
    {#if !sortedFilteredCards || sortedFilteredCards.length === 0}
      <div
        class="text-secondary text-center mt-5 text-center float-right w-100"
        data-drag="false"
      >
        <small>{$_("board.no_cards")}</small>
      </div>
    {/if}
  </div>
</div>

<style>
  .header {
    text-align: center;
  }

  .icon {
    width: 1.5em;
    box-sizing: content-box;
  }
</style>
