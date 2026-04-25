<script>
  import { run, createBubbler } from "svelte/legacy";

  const bubble = createBubbler();
  import clsx from "clsx";

  import { filterDataKeys } from "../utils.js";

  let {
    class: className = "",
    disabled = false,
    value = "",
    color = null,
    textColor = null,
    href = null,
    target = "_top",
    children,
    ...rest
  } = $props();

  let classes = $state("");
  let data = $state({});

  run(() => {
    classes = clsx(className, "btn", {
      [`btn-${color}`]: !!color,
      [`text-${textColor}`]: !!textColor,
    });
  });
  run(() => {
    data = filterDataKeys(rest);
  });
</script>

{#if href}
  <a
    {...data}
    class={classes}
    {disabled}
    onclick={bubble("click")}
    {value}
    {href}
    {target}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    {...data}
    class={classes}
    {disabled}
    onclick={bubble("click")}
    {value}
  >
    {@render children?.()}
  </button>
{/if}
