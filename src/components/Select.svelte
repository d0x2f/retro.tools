<script>
  import clsx from "clsx";

  let className = "";
  export { className as class };
  export let disabled = false;
  export let value = "";

  $: classes = clsx(className, "form-select");
</script>

<select class={classes} {disabled} bind:value>
  <slot />
</select>
