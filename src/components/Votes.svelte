<script>
  import { createEventDispatcher } from 'svelte';
  import clsx from 'clsx';

  import { board } from '../store.js';
  import { Icons } from '../data.js';

  import Button from './Button.svelte';

  export let votes = 0;
  export let voted = false;
  export let color = '';

  const dispatch = createEventDispatcher();
</script>

<div class="m-1 d-flex">
  {#if $board.voting_open}
    <div class="d-flex flex-column justify-content-center">
      <Button
        data-name="vote-button"
        color="light"
        class="text-capitalize flex-grow-0 flex-shrink-0 btn-sm mr-1"
        on:click={() => dispatch('toggleVote')}
      >
        <div class="icon {color}" class:unvoted={!voted}>
          <Icons.arrowUp />
        </div>
      </Button>
    </div>
  {/if}
  <span
    data-name="vote-count"
    class={clsx('votes font-weight-bold h3 mb-0 mt-0', color, {
      'mr-1': $board.voting_open,
      'px-2': !$board.voting_open,
    })}
  >
    {votes}
  </span>
</div>

<style>
  .votes {
    text-align: right;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
  }

  .unvoted {
    color: #aaa !important;
  }
</style>
