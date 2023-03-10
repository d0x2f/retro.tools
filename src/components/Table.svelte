<script>
  import clsx from "clsx";

  let className = "";
  export { className as class };
  export let hover = false;

  $: classes = clsx(className, "table", { "table-hover": hover });
</script>

<table class={classes}>
  <slot />
</table>
