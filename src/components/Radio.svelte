<script>
  import Icon from "fa-svelte";

  export let icon = false;
  export let label;
  export let value;
  export let group = "";
  export let color = "primary";
  export let style = "";
</script>

<style>
  .container {
    display: inline-block;
    width: 8em;
  }

  .tab {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon {
    padding: 0 0.5em;
  }
</style>

<div class="container" {style}>
  <label>
    <div class="tab {color}">
      <input type="radio" bind:group {value} />
      {#if icon}
        <div class="icon">
          <Icon {icon} />
        </div>
      {/if}
      {label}
    </div>
  </label>
</div>
