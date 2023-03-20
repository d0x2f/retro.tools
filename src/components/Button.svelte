<script>
  import clsx from "clsx";

  import { filterDataKeys } from "../utils.js";

  let className = "";
  export { className as class };
  export let disabled = false;
  export let value = "";
  export let color = null;
  export let textColor = null;
  export let href = null;
  export let target = "_top";

  let classes = "";
  let data = {};

  $: classes = clsx(className, "btn", {
    [`btn-${color}`]: !!color,
    [`text-${textColor}`]: !!textColor,
  });
  $: data = filterDataKeys($$restProps);
</script>

{#if href}
  <a {...data} class={classes} {disabled} on:click {value} {href} {target}>
    <slot />
  </a>
{:else}
  <button {...data} class={classes} {disabled} on:click {value}>
    <slot />
  </button>
{/if}
