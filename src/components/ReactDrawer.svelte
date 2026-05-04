<script>
  import { Button, ButtonGroup } from '@sveltestrap/sveltestrap';
  import { colorMode } from '../store';

  let {
    emojis = [
      ['👍', '👎', '👏', '🙌', '👌'],
      ['😂', '😍', '😱', '😓', '🤨'],
      ['🤔', '😡', '🍺', '🔥', '👀'],
      ['💩', '🎉', '❤️', '🐛', '💬'],
    ],
    current = '',
    onselected,
  } = $props();
</script>

<div class="d-flex flex-wrap justify-content-around">
  {#each emojis as emojiRow, i (i)}
    <ButtonGroup>
      {#each emojiRow as emoji (emoji)}
        <Button
          color={emoji === current ? 'secondary' : $colorMode}
          data-name="emoji-button"
          data-emoji={emoji}
          onclick={() => onselected?.(emoji)}
        >
          {emoji}
        </Button>
      {/each}
    </ButtonGroup>
  {/each}
</div>
