<script>
  import clsx from "clsx";

  import { Icons } from "../data.js";

  let { class: className = "", checked = false, label = "" } = $props();

  let classes = $derived(clsx(className, { "text-secondary": !checked }));
</script>

<div class={classes} data-checked={checked}>
  <div
    class="d-inline-block icon {checked ? 'text-primary' : 'text-secondary'}"
  >
    {#if checked}
      <Icons.check size="100%" />
    {:else}
      <Icons.close size="100%" />
    {/if}
  </div>
  {label}
</div>

<style>
  .icon {
    width: 1.25em;
    height: 1.25em;
    margin-top: -4px;
  }
</style>
