<script>
  import { createEventDispatcher } from "svelte";
  import Switch from "@smui/switch";
  import FormField from "@smui/form-field";

  export let text = "Placeholder text";
  export let checked = false;
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  .container span {
    color: $primary;
    font-size: 100%;
    padding-left: 1em;
  }
</style>

<div class="container">
  <FormField>
    <Switch bind:checked />
    <span slot="label">{text}</span>
  </FormField>
</div>
