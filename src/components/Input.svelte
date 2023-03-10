<script>
  import clsx from 'clsx';

  import { filterDataKeys } from '../utils.js';

  let className = '';
  export { className as class };
  export let disabled = false;
  export let value = '';
  export let type = 'text';
  export let placeholder = '';

  let classes = '';
  let data = '';

  $: classes = clsx(className, 'form-control');
  $: data = filterDataKeys($$restProps);
</script>

{#if type == 'password'}
  <input
    type="password"
    {...data}
    class={classes}
    {disabled}
    on:click
    bind:value
    {placeholder}
  />
{:else}
  <input
    type="text"
    {...data}
    class={classes}
    {disabled}
    on:click
    bind:value
    {placeholder}
  />
{/if}


<style>
  input {
    height: 40px;
  }
</style>
