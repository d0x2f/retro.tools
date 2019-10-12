<script>
  import Icon from "fa-svelte";
  import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";

  import { board } from "../store.js";
  import Checkbox from "./Checkbox.svelte";
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";
  @import "@material/elevation/mdc-elevation";

  .container {
    position: relative;
    background-color: #fff;
    color: $primary;
  }

  .header {
    padding: 0.4em 0;
    text-align: left;
    font-weight: 700;
    font-size: 1em;
    height: 1.5em;
    padding-left: 1em;
    font-family: "Work Sans", sans-serif;
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

<div class="container mdc-elevation--z3">
  <div class="header">RETROGRADE</div>
  <div class="settings">
    <div class="horizontal">
      <Checkbox text="Voting" bind:checked={$board.voting_open} />
    </div>
    <div class="horizontal">
      <Checkbox text="Cards Allowed" bind:checked={$board.cards_open} />
    </div>
  </div>
</div>
