<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let disabled = false;
  export let value = '';
  export let addon = false;

  $: classes = clsx(className, {
    'form-check-input': !addon,
  });
</script>

<input type="checkbox" class={classes} {disabled} on:input {value} />
