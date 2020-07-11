<script>
  import { createEventDispatcher } from 'svelte';

  import { board } from '../store.js';
  import { Icons } from '../data.js';

  import Button from './Button.svelte';

  export let votes = 0;
  export let voted = false;
  export let color = '';

  const dispatch = createEventDispatcher();
</script>

<style>
  .votes {
    min-width: 1em;
    text-align: right;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
  }

  .unvoted {
    stroke-dasharray: 3;
    opacity: 0.7;
  }
</style>

<div class="m-1 d-flex">
  <div class="d-flex flex-column justify-content-center">
    <Button
      color="light"
      class="text-capitalize flex-grow-0 flex-shrink-0"
      disabled={!$board.voting_open}
      on:click={() => dispatch('toggleVote')}>
      <div class="icon {color}" class:unvoted={!voted}>
        <Icons.thumbsup />
      </div>
    </Button>
  </div>
  <span class="votes font-weight-bold h3 mb-0 mt-0 {color}">{votes}</span>
</div>
