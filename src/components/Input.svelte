<script>
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let disabled = false;
  export let value = '';
  export let type = 'text';
  export let placeholder = '';

  $: classes = clsx(className, 'form-control');
</script>

{#if type == 'password'}
  <input
    type="password"
    class={classes}
    {disabled}
    on:click
    bind:value
    {placeholder} />
{:else}
  <input
    type="text"
    class={classes}
    {disabled}
    on:click
    bind:value
    {placeholder} />
{/if}
