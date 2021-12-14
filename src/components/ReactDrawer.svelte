<script>
  import { createEventDispatcher } from 'svelte';

  export let emojis = [
    '👍',
    '👎',
    '🙌',
    '👌',
    '😂',
    '😍',
    '😱',
    '😓',
    '🤨',
    '🤔',
    '😡',
    '🍺',
    '🔥',
    '👀',
    '💩',
    '🎉',
    '❤️',
    '🐛',
    '💬',
  ];

  export let current = '';

  const dispatch = createEventDispatcher();
</script>

<div class="d-flex flex-wrap justify-content-around">
  {#each emojis as emoji}
    <div
      class="emoji"
      class:selected={emoji === current}
      on:click={dispatch('selected', emoji)}
    >
      {emoji}
    </div>
  {/each}
</div>

<style>
  .emoji {
    cursor: pointer;
    font-size: 24px;
    padding: 3px;
    margin: 3px;
  }

  .emoji:hover {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }

  .selected {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }
</style>
