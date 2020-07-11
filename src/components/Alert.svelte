<script>
  import clsx from 'clsx';
  import { fade } from 'svelte/transition';

  let className = '';
  export { className as class };
  export let isOpen = true;
  export let color = 'success';

  $: classes = clsx(className, 'alert', `alert-${color}`);
</script>

{#if isOpen}
  <div transition:fade class={classes} role="alert">
    <slot />
  </div>
{/if}
