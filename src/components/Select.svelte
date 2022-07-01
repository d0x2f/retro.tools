<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let disabled = false;
  export let value = '';
  export let onchange = () => {};

  $: classes = clsx(className, 'custom-select');
</script>

<select class={classes} {disabled} bind:value on:change={onchange}>
  <slot />
</select>
