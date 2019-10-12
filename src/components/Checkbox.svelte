<script>
  import { createEventDispatcher } from "svelte";
  import Switch from "@smui/switch";
  import FormField from "@smui/form-field";

  export let text = "Placeholder text";
  export let checked = false;
</script>

<style>
  .container span {
    font-size: 100%;
    margin-top: 0.2em;
  }
</style>

<div class="container">
  <FormField>
    <Switch bind:checked />
    <span slot="label">{text}</span>
  </FormField>
</div>
