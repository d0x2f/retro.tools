<script>
  import { run, createBubbler } from "svelte/legacy";

  const bubble = createBubbler();
  import { createEventDispatcher } from "svelte";
  import clsx from "clsx";

  import { filterDataKeys } from "../utils.js";

  let {
    class: className = "",
    disabled = false,
    autofocus = false,
    value = $bindable(""),
    type = "text",
    placeholder = "",
    ...rest
  } = $props();

  const dispatch = createEventDispatcher();
  let classes = $state("");
  let data = $state({});

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

  run(() => {
    classes = clsx(className, "form-control");
  });
  run(() => {
    data = filterDataKeys(rest);
  });
</script>

{#if type == "password"}
  <input
    type="password"
    {...data}
    class={classes}
    {disabled}
    use:use
    onclick={bubble("click")}
    onfocus={bubble("focus")}
    onblur={bubble("blur")}
    onkeydown={keyDown}
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
    onclick={bubble("click")}
    onfocus={bubble("focus")}
    onblur={bubble("blur")}
    onkeydown={keyDown}
    bind:value
    {placeholder}
  />
{/if}

<style>
  input {
    height: 40px;
  }
</style>
