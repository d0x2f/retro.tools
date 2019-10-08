<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "fa-svelte";
  import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";

  export let text = "Placeholder text";
  export let checked = false;
</script>

<style>
  /* Customize the label (the container) */
  .container {
    display: block;
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  .container > input {
    opacity: 0;
  }

  .container > input:checked ~ .unchecked {
    display: none;
  }

  .container > input:not(:checked) ~ .checked {
    display: none;
  }
</style>

<label class="container">
  <input type="checkbox" bind:checked />
  <span class="unchecked">
    <Icon icon={faSquare} />
  </span>
  <span class="checked">
    <Icon icon={faCheckSquare} />
  </span>
  {text}
</label>
