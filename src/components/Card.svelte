<script>
  import { board } from "../store.js";

  import Button from "./Button.svelte";

  export let card;
  export let accent = "sad";
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  .card {
    width: 14em;
    border: 0.1em solid #eee;
    box-shadow: 0 0 0.4em #eee;
    margin: 1em;
  }

  .top {
    display: flex;
    padding: 0.5em;
    min-height: 2em;
  }

  .buttons {
    border-top: 1px solid #eee;
    display: flex;
    width: 100%;
  }

  .buttons > div {
    flex: 1 1 0;
  }

  .button {
    border-left: 0.1em solid #eee;
  }

  .uncommitted {
    opacity: 0.66;
  }

  .votes {
    font-size: 1.2em;
    flex: 0 0 1em;
    font-weight: bold;
  }

  .text {
    flex: 1 1 0;
    font-weight: 100;
    font-size: 80%;
    padding: 0.2em;
  }

  .mad {
    color: $mad;
  }

  .sad {
    color: $sad;
  }

  .glad {
    color: $glad;
  }
</style>

<div class="card {!!card.uncommitted ? 'uncommitted' : ''}">
  <div class="top">
    <span class="votes {accent}">0</span>
    <span class="text">{card.description}</span>
  </div>
  <div class="buttons">
    <div class="button">
      <Button color="plain" label="agree" disabled={!$board.voting_open} />
    </div>
    <div class="button">
      <Button color="plain" label="edit" />
    </div>
  </div>
</div>
