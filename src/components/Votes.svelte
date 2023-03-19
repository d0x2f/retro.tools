<script>
  import { createEventDispatcher } from "svelte";
  import clsx from "clsx";

  import { board, colorMode, colors } from "../store.js";
  import { Icons } from "../data.js";

  import Button from "./Button.svelte";

  export let votes = 0;
  export let voted = false;
  export let color;

  const dispatch = createEventDispatcher();
</script>

<div class="d-flex">
  {#if $board.voting_open}
    <Button
      data-name="vote-button"
      class="flex-grow-0 flex-shrink-0 p-1 bg-{$colorMode}-accent"
      on:click={() => dispatch("toggleVote")}
    >
      <div class="icon" style="color: {$colors[color]}" class:unvoted={!voted}>
        <Icons.arrowUp class="align-top" size="1.7x" />
      </div>
    </Button>
  {/if}
  <span
    data-name="vote-count"
    style="color: {$colors[color]}"
    class={clsx("votes font-weight-bold h3 mb-0 mt-0 text-center", {
      "me-1": $board.voting_open,
      "px-2": !$board.voting_open,
    })}
  >
    {votes}
  </span>
</div>

<style>
  .votes {
    text-align: right;
    min-width: 25px;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
  }

  .unvoted {
    color: #aaa !important;
  }
</style>
