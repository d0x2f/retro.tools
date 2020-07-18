<script>
  import clsx from 'clsx';

  import { Icons } from '../data.js';

  let className = '';
  export { className as class };
  export let checked = false;
  export let label = '';

  $: classes = clsx(className, { 'text-secondary': !checked });
</script>

<style>
  .icon {
    width: 1.25em;
    height: 1.25em;
    margin-top: -4px;
  }
</style>

<div class={classes} data-checked={checked}>
  <div
    class="d-inline-block icon {checked ? 'text-primary' : 'text-secondary'}">
    {#if checked}
      <Icons.check />
    {:else}
      <Icons.close />
    {/if}
  </div>
  {label}
</div>
