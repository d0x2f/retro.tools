<script>
  import { board } from "../store.js";

  import Button from "./Button.svelte";

  export let card;
  export let color = "primary";
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  .card {
    width: 14em;
    box-shadow: 0 0 0.4em darken($background, 10%);
    margin: 1em;
    border-radius:3px;
    overflow:hidden;
  }

  .top {
    display: flex;
    padding: 0.5em;
    min-height: 2em;
  }

  .buttons {
    border-top: 1px solid darken($background, 10%);
    display: flex;
    width: 100%;
  }

  .buttons > div {
    flex: 1 1 0;
  }

  .uncommitted {
    opacity: 0.66;
  }

  .votes {
    font-size: 1.2em;
    flex: 0 0 1.5em;
    font-weight: bold;
    text-align:center;
  }

  .text {
    flex: 1 1 0;
    font-weight: 300;
    padding: 0.2em;
  }

  .negative {
    color: $negative;
  }

  .primary {
    color: $primary;
  }

  .secondary {
    color: $secondary;
  }
</style>

<div class="card {!!card.uncommitted ? 'uncommitted' : ''}">
  <div class="top">
    <span class="votes {color}">0</span>
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
