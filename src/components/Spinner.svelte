<script>
  import clsx from "clsx";

  let className = "";
  export { className as class };
  export let size = "md";
  export let color = "primary";

  $: classes = clsx(
    className,
    "spinner-border",
    `spinner-border-${size}`,
    `text-${color}`
  );
</script>

<div role="status" class={classes}>
  <span class="visually-hidden">
    <slot>Loading…</slot>
  </span>
</div>
