<script>
  import { run } from "svelte/legacy";

  import clsx from "clsx";
  import { fade } from "svelte/transition";

  import { filterDataKeys } from "../utils.js";

  let {
    class: className = "",
    isOpen = true,
    color = "success",
    children,
    ...rest
  } = $props();

  let classes = $state("");
  let data = $state("");

  run(() => {
    classes = clsx(className, "alert", `alert-${color}`);
  });
  run(() => {
    data = filterDataKeys(rest);
  });
</script>

{#if isOpen}
  <div {...data} transition:fade class={classes} role="alert">
    {@render children?.()}
  </div>
{/if}
