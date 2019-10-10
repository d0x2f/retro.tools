<script>
  import Icon from "fa-svelte";
  import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";

  import { board } from "../store.js";
  import Checkbox from "./Checkbox.svelte";
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  .container {
    position: relative;
    background-color: #fff;
    color: $secondary;
    box-shadow: 0px 0.2em 0.4em #eee;
    z-index: 1;
  }

  .header {
    padding: 0.4em 0;
    text-align: left;
    font-weight: 700;
    font-size: 1em;
    height: 1.3em;
    padding-left: 1em;
    font-family: "Work Sans", sans-serif;
  }

  .settings {
    position: absolute;
    right: 1em;
    top: 0.5em;
    font-size: 0.7em;
  }
</style>

<div class="container">
  <div class="header">RETROGRADE</div>
  <div class="settings">
    <Checkbox text="New Cards Allowed" bind:checked={$board.cards_open} />
  </div>
</div>
