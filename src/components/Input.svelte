<script>
  import clsx from 'clsx';

  import { filterDataKeys } from '../utils.js';

  let {
    class: className = '',
    disabled = false,
    autofocus = false,
    value = $bindable(''),
    type = 'text',
    placeholder = '',
    onsubmit,
    oncancel,
    onclick,
    onfocus,
    onblur,
    ...rest
  } = $props();

  let classes = $derived(clsx(className, 'form-control'));
  let data = $derived(filterDataKeys(rest));

  function keyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (value.length > 0) {
        onsubmit?.();
      }
      event.preventDefault();
    } else if (event.key === 'Escape') {
      oncancel?.();
    }
  }

  function use(el) {
    if (autofocus) el.focus();
  }
</script>

{#if type == 'password'}
  <input
    type="password"
    {...data}
    class={classes}
    {disabled}
    use:use
    {onclick}
    {onfocus}
    {onblur}
    onkeydown={keyDown}
    bind:value
    {placeholder}
  />
{:else}
  <input
    type="text"
    {...data}
    class={classes}
    {disabled}
    use:use
    {onclick}
    {onfocus}
    {onblur}
    onkeydown={keyDown}
    bind:value
    {placeholder}
  />
{/if}

<style>
  input {
    height: 40px;
  }
</style>
