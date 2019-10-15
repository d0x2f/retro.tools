<script>
  import Icon from "fa-svelte";
  import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";

  import { board } from "../store.js";
  import Switch from "./Switch.svelte";
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  .container {
    position: relative;
    background-color: $background;
    color: $primary;
    box-shadow: 0 0 0.4em darken($background, 20%);
    line-height:1.5;
  }

  .header {
    padding: 0.4em 0;
    text-align: left;
    font-weight: 700;
    font-size: 1em;
    height: 1.5em;
    padding-left: 1em;
    text-transform: uppercase;
  }

  .settings {
    position: absolute;
    right: 1.5em;
    top: 0.75em;
    font-size: 0.7em;
  }

  .horizontal {
    display: inline-block;
    margin-left: 1.8em;
  }
</style>

<div class="container">
  <div class="header">retrograde</div>
  <div class="settings">
    <div class="horizontal">
      <Switch text="Voting" bind:checked={$board.voting_open} />
    </div>
    <div class="horizontal">
      <Switch text="Cards Allowed" bind:checked={$board.cards_open} />
    </div>
  </div>
</div>
