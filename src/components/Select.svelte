<script>
  import clsx from "clsx";

  let {
    class: className = "",
    disabled = false,
    value = $bindable(""),
    children,
  } = $props();

  let classes = $derived(clsx(className, "form-select"));
</script>

<select class={classes} {disabled} bind:value>
  {@render children?.()}
</select>
