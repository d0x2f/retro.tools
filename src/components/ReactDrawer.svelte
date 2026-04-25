<script>
  import { createEventDispatcher } from "svelte";
  import { Button, ButtonGroup } from "@sveltestrap/sveltestrap";
  import { colorMode } from "../store";

  let {
    emojis = [
      ["👍", "👎", "👏", "🙌", "👌"],
      ["😂", "😍", "😱", "😓", "🤨"],
      ["🤔", "😡", "🍺", "🔥", "👀"],
      ["💩", "🎉", "❤️", "🐛", "💬"],
    ],
    current = "",
  } = $props();

  const dispatch = createEventDispatcher();
</script>

<div class="d-flex flex-wrap justify-content-around">
  {#each emojis as emojiRow, i (i)}
    <ButtonGroup>
      {#each emojiRow as emoji (emoji)}
        <Button
          color={emoji === current ? "secondary" : $colorMode}
          on:click={() => dispatch("selected", emoji)}
        >
          {emoji}
        </Button>
      {/each}
    </ButtonGroup>
  {/each}
</div>
