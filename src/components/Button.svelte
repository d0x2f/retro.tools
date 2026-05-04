<script>
  import clsx from 'clsx';

  import { filterDataKeys } from '../utils.js';

  let {
    class: className = '',
    disabled = false,
    value = '',
    color = null,
    textColor = null,
    href = null,
    target = '_top',
    children,
    onclick,
    ...rest
  } = $props();

  let classes = $derived(
    clsx(className, 'btn', {
      [`btn-${color}`]: !!color,
      [`text-${textColor}`]: !!textColor,
    })
  );
  let data = $derived(filterDataKeys(rest));
</script>

{#if href}
  <a {...data} class={classes} {disabled} {onclick} {value} {href} {target}>
    {@render children?.()}
  </a>
{:else}
  <button {...data} class={classes} {disabled} {onclick} {value}>
    {@render children?.()}
  </button>
{/if}
