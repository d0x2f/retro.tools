<script>
  import { faFrown, faMeh, faSmile } from "@fortawesome/free-regular-svg-icons";
  import TextArea from "./TextArea.svelte";
  import Radio from "./Radio.svelte";

  import { ranks } from "../store.js";

  export let comment;

  let icons = {
    mad: "mood_bad",
    sad: "sentiment_very_dissatisfied",
    glad: "sentiment_very_satisfied"
  };

  let tabs = {
    mad: {
      color: "negative",
      icon: faFrown
    },
    sad: {
      color: "primary",
      icon: faMeh
    },
    glad: {
      color: "secondary",
      icon: faSmile
    }
  };
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  .comment {
    margin-bottom: 1em;
    height: 5em;
  }

  h1 {
    margin-bottom: 1em;
    font-family: "Work Sans", sans-serif;
    text-transform: uppercase;
    color: $primary;
  }
</style>

<h1>Modify Card</h1>

<div class="comment">
  <TextArea bind:text={comment} placeholder="This meeting is boring..." />
</div>
