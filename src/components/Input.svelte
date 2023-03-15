<script>
  import { createEventDispatcher } from "svelte";
  import clsx from "clsx";

  import { filterDataKeys } from "../utils.js";

  let className = "";
  export { className as class };
  export let disabled = false;
  export let autofocus = false;
  export let value = "";
  export let type = "text";
  export let placeholder = "";

  const dispatch = createEventDispatcher();
  let classes = "";
  let data = {};

  function keyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      // 'enter' key (and not shift + enter)
      if (value.length > 0) {
        dispatch("submit", {
          text: value,
        });
      }
      event.preventDefault();
    } else if (event.keyCode === 27) {
      // 'escape' key
      dispatch("cancel");
    }
  }

  function use(el) {
    if (autofocus) el.focus();
  }

  $: classes = clsx(className, "form-control");
  $: data = filterDataKeys($$restProps);
</script>

{#if type == "password"}
  <input
    type="password"
    {...data}
    class={classes}
    {disabled}
    use:use
    on:click
    on:focus
    on:blur
    on:keydown={keyDown}
    bind:value
    {placeholder}
  />
{:else}
  <input
    type="text"
    {...data}
    class={classes}
    {disabled}
    use:use
    on:click
    on:focus
    on:blur
    on:keydown={keyDown}
    bind:value
    {placeholder}
  />
{/if}

<style>
  input {
    height: 40px;
  }
</style>
