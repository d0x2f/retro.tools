<script>
  export let text = "Placeholder text";
  export let checked = false;
  export let color = "primary";
</script>

<style type="text/scss">
  @import "../../theme/colors.scss";

  .container {
    display: flex;
    font-size: 120%;
    cursor: pointer;
  }

  .text {
    color: $disabled;
    padding-left: 1em;
    line-height:1.4;
    flex: 1 1 0;
  }

  .switch {
    flex: 0 0 30px;
    position: relative;
    display: inline-block;
    width: 30px;
    height: 18px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: darken($background, 20%);
    transition: 0.4s;
    border-radius: 17px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 13px;
    width: 13px;
    left: 2px;
    bottom: 2px;
    background-color: $background;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider:before {
    transform: translateX(13px);
  }

  input:checked + .primary {
    background-color: $primary;
  }

  input:focus + .primary {
    box-shadow: 0 0 1px $primary;
  }

  .primary {
    color: $primary;
  }
</style>

<label class="container">
  <div class="switch">
    <input type="checkbox" bind:checked />
    <span class="slider {color}" />
  </div>
  <div class="text {checked ? color : ''}">{text}</div>
</label>
