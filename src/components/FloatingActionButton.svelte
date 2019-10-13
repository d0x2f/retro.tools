<script>
  import Icon from "fa-svelte";
  import { createEventDispatcher } from "svelte";

  export let icon = false;
  export let color = "primary";

  const dispatch = createEventDispatcher();
</script>

<style type="text/scss">
  @import "../theme/colors.scss";

  button {
    text-transform: capitalize;
    border: none;
    text-align: center;
    text-decoration: none;
    padding: 0.6em;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    background-position: center;
    transition: background 0.8s;
    outline: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0.1em 0.2em 0.5em #999;
    font-size: 110%;
  }

  .icon {
    padding-top: 0.25em;
  }

  button:hover {
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
  }

  .primary {
    color: $on-primary;
    background-color: $primary;
  }

  .primary:hover {
    background: lighten($primary, 10%)
      radial-gradient(circle, transparent 1%, lighten($primary, 10%) 1%)
      center/15000%;
  }

  .primary:active {
    background-color: lighten($primary, 20%);
    background-size: 100%;
    transition: background 0s;
  }

  .secondary {
    color: $on-secondary;
    background-color: $secondary;
  }

  .secondary:hover {
    background: lighten($secondary, 10%)
      radial-gradient(circle, transparent 1%, lighten($secondary, 10%) 1%)
      center/15000%;
  }

  .secondary:active {
    background-color: lighten($secondary, 20%);
    background-size: 100%;
    transition: background 0s;
  }

  .negative {
    color: $on-negative;
    background-color: $negative;
  }

  .negative:hover {
    background: darken($negative, 10%)
      radial-gradient(circle, transparent 1%, darken($negative, 10%) 1%)
      center/15000%;
  }

  .negative:active {
    background-color: darken($negative, 20%);
    background-size: 100%;
    transition: background 0s;
  }

  .plain {
    color: $on-plain;
    background-color: $plain;
    border-radius: 0;
  }

  .plain:hover {
    background: darken($plain, 10%)
      radial-gradient(circle, transparent 1%, darken($plain, 10%) 1%)
      center/15000%;
  }

  .plain:active {
    background-color: darken($plain, 20%);
    background-size: 100%;
    transition: background 0s;
  }
</style>

<button class={color} on:click={() => dispatch('click')}>
  {#if icon}
    <div class="icon">
      <Icon {icon} />
    </div>
  {/if}
</button>
