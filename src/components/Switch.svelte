<script>
  export let text = 'Placeholder text';
  export let checked = false;
  export let color = 'primary';
</script>

<style lang="scss">
  @import '../../theme/colors.scss';

  .container {
    display: flex;
    font-size: 120%;
    cursor: pointer;
  }

  .text {
    color: $disabled;
    padding-left: 1em;
    flex: 1 1 0;
    line-height: 1.4;
  }

  .switch {
    flex: 0 0 1.8em;
    position: relative;
    display: inline-block;
    width: 1.8em;
    height: 1em;
    margin-top: 0.2em;
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
    border-radius: 1em;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 0.8em;
    width: 0.8em;
    left: 0.1em;
    bottom: 0.1em;
    background-color: $background;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider:before {
    transform: translateX(0.8em);
  }

  input:checked + .primary {
    background-color: $primary;
  }

  input:focus + .primary {
    box-shadow: 0 0 0.2em $primary;
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
