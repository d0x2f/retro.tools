<script>
  import Button, { Label } from "@smui/button";

  import { board } from "../store.js";

  export let card;
  export let accent = "sad";
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  .card {
    width: 14em;
    border: 0.1em solid #eee;
    box-shadow: 0.2em 0.2em 0.4em #eee;
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
    <Button style="flex-grow: 1" disabled={!$board.voting_open}>
      <Label>Agree</Label>
    </Button>
    <Button style="flex-grow: 1">
      <Label>Edit</Label>
    </Button>
  </div>
</div>
