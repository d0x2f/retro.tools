<script>
  import clsx from 'clsx';

  let {
    class: className = '',
    size = 'md',
    color = 'primary',
    children,
  } = $props();

  let classes = $derived(
    clsx(className, 'spinner-border', `spinner-border-${size}`, `text-${color}`)
  );
</script>

<div role="status" class={classes}>
  <span class="visually-hidden">
    {#if children}{@render children()}{:else}Loading…{/if}
  </span>
</div>
