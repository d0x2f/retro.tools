<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { autoresize } from 'svelte-textarea-autoresize';

  export let value = '';
  export let placeholder = '';

  const dispatch = createEventDispatcher();
  let focused = false;
  let element;

  onMount(() => element.focus());

  function focus() {
    focused = true;
  }

  function blur() {
    focused = false;
    dispatch('blur');
  }

  function checkSubmission(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      if (value.length > 0) {
        dispatch('submit', {
          text: value,
        });
      }
      event.preventDefault();
    } else if (event.keyCode === 27) {
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
</script>

<style>
  textarea {
    resize: none;
    width: 100%;
    border-radius: 4px;
    border-width: 2px;
    border-style: solid;
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
  use:autoresize
  bind:this={element}
  on:focus={focus}
  on:blur={blur}
  on:keydown={checkSubmission}
  class={focused ? 'border-primary' : ''}
  bind:value
  {placeholder} />
