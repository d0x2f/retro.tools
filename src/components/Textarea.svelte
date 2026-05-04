<script>
  import { autoresize as autoresizer } from 'svelte-textarea-autoresize';
  import clsx from 'clsx';

  import { filterDataKeys } from '../utils.js';

  let {
    value = $bindable(''),
    placeholder = '',
    autoresize = false,
    autofocus = false,
    minWidth = '0px',
    class: className = '',
    onsubmit,
    oncancel,
    onfocus,
    onblur,
    ...rest
  } = $props();

  let element = $state();
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

  // Reset textarea height when value is cleared reactively.
  $effect(() => {
    if (element && value.length == 0) {
      element.value = '';
      element.dispatchEvent(new Event('input'));
    }
  });

  function use(el) {
    if (autoresize) autoresizer(el);
    if (autofocus) el.focus();
  }
</script>

<textarea
  {...data}
  rows="1"
  style="min-width: {minWidth}"
  bind:this={element}
  use:use
  {onfocus}
  {onblur}
  onkeydown={keyDown}
  class={classes}
  bind:value
  {placeholder}
></textarea>

<style>
  textarea {
    resize: none;
    overflow: hidden;
    padding: 8px;
    box-sizing: border-box;
    outline: none;
  }

  textarea:focus {
    transition: border-color 0.5s;
  }
</style>
