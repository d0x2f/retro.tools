<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let disabled = false;
  export let value = '';
  export let color = 'secondary';

  $: classes = clsx(className, 'btn', `btn-${color}`);
</script>

<button class={classes} {disabled} on:click {value}>
  <slot />
</button>
