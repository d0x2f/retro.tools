<script>
  import { createEventDispatcher } from "svelte";
  import { Button, ButtonGroup } from "sveltestrap";
  import { colorMode } from "../store";

  // rows as shown in the app
  export let emojis = [
    ["👍", "👎", "👏", "🙌", "👌"],
    ["😂", "😍", "😱", "😓", "🤨"],
    ["🤔", "😡", "🍺", "🔥", "👀"],
    ["💩", "🎉", "❤️", "🐛", "💬"],
  ];

  export let current = "";

  const dispatch = createEventDispatcher();
</script>

<div class="d-flex flex-wrap justify-content-around">
  {#each emojis as emojiRow}
    <ButtonGroup>
      {#each emojiRow as emoji}
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
