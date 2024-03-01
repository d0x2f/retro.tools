<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { flip } from "svelte/animate";
  import { _ } from "svelte-i18n";

  import {
    activeRankOptions,
    author,
    board,
    cards,
    colorMode,
    colors,
    darkMode,
    focusedRank,
    password,
    ranks,
    sorted,
  } from "../store.js";
  import { Icons } from "../data.js";
  import { createCard, deleteRank, updateRank } from "../api.js";
  import { encrypt } from "../encryption.js";

  import Card from "./Card.svelte";
  import Textarea from "./Textarea.svelte";
  import Button from "./Button.svelte";
  import { slide } from "svelte/transition";
  import RankOptions from "./RankOptions.svelte";

  export let rank;
  export let drake = null;

  let dropTarget;
  let sortedFilteredCards;
  let columnWidth = "col-lg-3";
  let newCardText = "";
  let deleteConfirmMode = false;

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
        columnWidth = `col-lg-${Math.floor(12 / $ranks.length)}`;
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

  function toggleOptions() {
    if (!$board.owner) {
      return;
    }
    if ($activeRankOptions != rank.id) {
      $activeRankOptions = rank.id;
    } else {
      $activeRankOptions = "";
    }
  }

  async function doDelete() {
    rank.busy = true;
    try {
      await deleteRank($board.id, rank.id);
    } catch (err) {
      error("error.network", err);
    }
  }

  onMount(() => drake?.containers.push(dropTarget));
</script>

<div
  data-name="rank"
  class="rank flex-grow-0 flex-shrink-0 px-3 {columnWidth}"
  class:busy={rank.busy}
>
  <div
    style="position: relative; display: flex; flex-direction: column;"
    data-name="rank-header"
  >
    <div
      class="d-flex pt-2 mb-2"
      style="color: {$colors[rank.data.color]}"
      class:blur={deleteConfirmMode}
    >
      <div class="d-flex flex-column justify-content-center flex-shrink-0">
        <div
          class="icon px-2"
          role="button"
          data-name="rank-options-button"
          tabindex="0"
          on:keypress={null}
          on:click={toggleOptions}
        >
          <svelte:component this={Icons[rank.data.icon]} />
        </div>
      </div>
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
        <Button
          color={$colorMode}
          disabled={newCardText.length == 0}
          class="d-lg-none ms-1"
          on:click={newCard}
        >
          <div class="icon">
            <Icons.enter size="100%" />
          </div>
        </Button>
        {#if $board.owner}
          <Button
            data-name="delete-button"
            textColor={!$darkMode ? "danger" : "body"}
            class="bg-{$colorMode}-accent border"
            on:click={() => (deleteConfirmMode = true)}
          >
            <div class="icon">
              <Icons.trash class="align-top" size="1.4x" />
            </div>
          </Button>
        {/if}
      </div>
    </div>

    {#if deleteConfirmMode}
      <div
        class="d-flex justify-content-end position-absolute w-100 h-100 p-2 text-end"
      >
        <Button
          data-name="cancel-button"
          color="secondary"
          textColor="light"
          class="btn-sm m-1"
          on:click={() => (deleteConfirmMode = false)}
        >
          <div class="icon">
            <Icons.close size="1x" />
          </div>
        </Button>

        <Button
          data-name="confirm-button"
          color="danger"
          textColor="light"
          class="btn-sm m-1"
          on:click={doDelete}
        >
          <div class="icon">
            <Icons.check size="1x" />
          </div>
        </Button>
      </div>
    {/if}
  </div>
  {#if $activeRankOptions == rank.id}
    <div class="p-1" in:slide out:slide>
      <RankOptions on:error class="w-100" {rank} />
    </div>
  {/if}
  <div class="border-bottom mb-2" style="color: {$colors[rank.data.color]}" />
  <div class="h-100" bind:this={dropTarget} data-rank-id={rank.id}>
    {#if $cards}
      {#each sortedFilteredCards as card (card.id)}
        <div
          data-card-id={card.id}
          animate:flip={{ duration: 200 }}
          class="py-1"
          data-drag={!(card.owner || $board.owner) ? "false" : "true"}
        >
          <Card {card} on:error color={rank.data.color} />
        </div>
      {/each}
    {:else}
      {#each sortedFilteredCards as card (card.id)}
        <div animate:flip={{ duration: 200 }} class="py-2">
          <Card bind:card on:error color={rank.data.color} />
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

  .blur {
    opacity: 0.3;
  }

  .busy {
    opacity: 0.66;
  }
</style>
