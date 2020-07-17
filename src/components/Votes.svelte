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
    text-align: right;
  }

  .icon {
    width: 1.5em;
    height: 1.5em;
  }

  .unvoted {
    color: #AAA !important;
  }
</style>

<div class="m-1 d-flex">
  <div class="d-flex flex-column justify-content-center">
    <Button
      color="light"
      class="text-capitalize flex-grow-0 flex-shrink-0 btn-sm mr-1"
      disabled={!$board.voting_open}
      on:click={() => dispatch('toggleVote')}>
      <div class="icon {color}" class:unvoted={!voted}>
        <Icons.arrowUp />
      </div>
    </Button>
  </div>
  <span class="votes font-weight-bold h3 mb-0 mt-0 mr-1 {color}">{votes}</span>
</div>
