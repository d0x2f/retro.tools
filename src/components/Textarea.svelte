<script>
  import { createEventDispatcher } from 'svelte';
  import { autoresize as autoresizer } from 'svelte-textarea-autoresize';
  import clsx from 'clsx';

  import { filterDataKeys } from '../utils.js';

  export let value = '';
  export let placeholder = '';
  export let autoresize = false;
  export let autofocus = false;
  export let minWidth = '0px';

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();
  let focused = true;
  let element;
  let classes;
  let data = '';

  function focus() {
    focused = true;
    dispatch('focus');
  }

  function blur() {
    focused = false;
    dispatch('blur');
  }

  function keyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      // 'enter' key (and not shift + enter)
      if (value.length > 0) {
        dispatch('submit', {
          text: value,
        });
      }
      event.preventDefault();
    } else if (event.keyCode === 27) {
      // 'escape' key
      dispatch('cancel');
    }
  }

  // This snippet ensures that the input box returns to a single line
  // when it's cleared via svelte reactively.
  $: {
    if (element && value.length == 0) {
      element.value = '';
      element.dispatchEvent(new Event('input'));
    }

    classes = clsx(className, 'form-control');
  }

  function use(el) {
    if (autoresize) autoresizer(el);
    if (autofocus) el.focus();
  }

  $: data = filterDataKeys($$restProps);
</script>

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

<textarea
  {...data}
  rows="1"
  style="min-width: {minWidth}"
  bind:this={element}
  use:use
  on:focus={focus}
  on:blur={blur}
  on:keydown={keyDown}
  class={classes}
  bind:value
  {placeholder} />
