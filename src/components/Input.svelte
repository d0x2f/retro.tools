<script>
  import { createEventDispatcher } from 'svelte';
  import { autoresize } from 'svelte-textarea-autoresize';

  export let value = '';
  export let placeholder = '';

  const dispatch = createEventDispatcher();
  let focused = true;
  let element;

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
  }

  function startFocused(el) {
    el.focus();
  }
</script>

<style>
  textarea {
    resize: none;
    width: 100%;
    border-radius: 4px;
    border-width: 2px;
    border-style: solid;
    border-color: lightgrey;
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
  bind:this={element}
  use:autoresize
  use:startFocused
  on:focus={focus}
  on:blur={blur}
  on:keydown={keyDown}
  class={focused ? 'border-primary' : ''}
  bind:value
  {placeholder} />
