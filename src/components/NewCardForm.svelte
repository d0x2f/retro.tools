<script>
  import { createEventDispatcher } from "svelte";
  import Button, { Icon, Label } from "@smui/button";
  import Textfield from "@smui/textfield";
  import FormField from "@smui/form-field";
  import Radio from "@smui/radio";

  import { ranks } from "../store.js";

  const dispatch = createEventDispatcher();
  export let comment;
  export let type;

  let icons = {
    mad: "mood_bad",
    sad: "sentiment_very_dissatisfied",
    glad: "sentiment_very_satisfied"
  };
</script>

<style>
  .comment {
    margin-bottom: 1em;
  }

  h1 {
    margin-bottom: 1em;
  }

  .rank {
    display: inline-block;
    margin-left: 1em;
  }
</style>

<h1>New Card</h1>

<div class="comment">
  <Textfield fullwidth textarea bind:value={comment} label="Comment" />
</div>

{#each $ranks as rank}
  <div class="rank">
    <FormField>
      <Radio bind:group={type} value={rank.id} />
      <span slot="label">
        <Icon class="material-icons">
          {icons[rank.name.toLowerCase()] || 'sentiment_very_satisfied'}
        </Icon>
        {rank.name}
      </span>
    </FormField>
  </div>
{/each}
