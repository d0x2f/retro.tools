<script>
  import clsx from "clsx";

  let { class: className = "", hover = false, children } = $props();

  let classes = $derived(clsx(className, "table", { "table-hover": hover }));
</script>

<table class={classes}>
  {@render children?.()}
</table>
