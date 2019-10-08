<script>
  import Icon from "fa-svelte";
  import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";

  import { board } from "../store.js";
  import Checkbox from "./Checkbox.svelte";
</script>

<style>
  .container {
    position: relative;
  }

  .header {
    padding: 0.4em 0;
    text-align: center;
    font-weight: 700;
    font-size: 1.3em;
  }

  .settings {
    position: absolute;
    right: 1em;
    top: 0.5em;
    font-size: 0.7em;
  }
</style>

<div class="container">
  <div class="header">Retograde</div>
  <div class="settings">
    <Checkbox text="Enable Card Creation" bind:checked={$board.cards_open} />
    <Checkbox text="Enable Voting" bind:checked={$board.voting_open} />
  </div>
</div>
