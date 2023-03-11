<script>
  import clsx from "clsx";
  import { fade } from "svelte/transition";

  import { filterDataKeys } from "../utils.js";

  let className = "";
  export { className as class };
  export let isOpen = true;
  export let color = "success";

  let classes = "";
  let data = "";

  $: classes = clsx(className, "alert", `alert-${color}`);
  $: data = filterDataKeys($$restProps);
</script>

{#if isOpen}
  <div {...data} transition:fade class={classes} role="alert">
    <slot />
  </div>
{/if}
