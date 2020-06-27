<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { autoresize } from 'svelte-textarea-autoresize';

  export let comment = '';
  export let placeholder = '';

  const dispatch = createEventDispatcher();
  let focused = false;
  let input;

  onMount(() => input.focus());

  function focus() {
    focused = true;
  }

  function blur() {
    focused = false;
    dispatch('blur');
  }

  function checkSubmission(event) {
    console.log(event);
    if (event.keyCode === 13 && !event.shiftKey) {
      if (input.value.length > 0) {
        dispatch('submit', {
          text: input.value,
        });
        input.value = '';
      }
      event.preventDefault();
      input.dispatchEvent(new Event('input'));
    } else if (event.keyCode === 27) {
      dispatch('cancel');
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
  bind:this={input}
  on:focus={focus}
  on:blur={blur}
  on:keydown={checkSubmission}
  class={focused ? 'border-primary' : ''}
  bind:value={comment}
  {placeholder} />
