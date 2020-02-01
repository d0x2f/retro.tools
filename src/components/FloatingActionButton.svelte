<script>
  import { createEventDispatcher } from 'svelte';

  export let icon = false;
  export let className = 'btn-primary';

  const dispatch = createEventDispatcher();
</script>

<style>

</style>

<button
  class="rounded-circle border-0 text-center p-1 {className}"
  on:click={() => dispatch('click')}>
  {#if icon}
    <svelte:component this={icon} />
  {/if}
</button>
