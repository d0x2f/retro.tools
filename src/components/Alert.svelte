<script>
  import clsx from 'clsx';
  import { fade } from 'svelte/transition';

  import { filterDataKeys } from '../utils.js';

  let {
    class: className = '',
    isOpen = true,
    color = 'success',
    children,
    ...rest
  } = $props();

  let classes = $derived(clsx(className, 'alert', `alert-${color}`));
  let data = $derived(filterDataKeys(rest));
</script>

{#if isOpen}
  <div {...data} transition:fade class={classes} role="alert">
    {@render children?.()}
  </div>
{/if}
